import { config } from 'configs'
import { Network } from 'configs/web3'
import { injectedConnector } from 'contexts/injected-connector'
import { ethers } from 'ethers'
import { merge } from 'lodash'
import {
    catchError,
    distinctUntilChanged,
    from,
    map,
    mapTo,
    mergeMap,
    Observable,
    of,
    shareReplay,
    throwError,
    withLatestFrom,
} from 'rxjs'
import { InjectedConnector } from 'services/injected-connector'
import { BinanceChainWalletExternalProvider, Web3ProviderEx } from 'types'
import { Web3ProviderId$ } from './web3-provider-id'

enum Web3ConnectErrorTypes {
    PartialNetworkSwitchCapability = 'E0x05 BinanceChainWallet only supports switching to mainnet and testnet',
    NoNetworkSwitchCapability = 'E0x06 current web3 provider does not support network switching',
    CantSwitchNetwork = 'E0x07 unknown error happened while changing network',
    UnavailableProvider = 'E0x08 no provider is selected or the selected provider is unavailable',
}
export class Web3ConnectError extends Error {
    constructor(type: Web3ConnectErrorTypes, public origin?: any) {
        super(type)
    }
}

export const Web3ProviderEx$: Observable<Web3ProviderEx | undefined> =
    Web3ProviderId$.pipe(
        distinctUntilChanged(),
        mergeMap(id =>
            !id ? of(undefined) : config.Web3Providers[id].provider$,
        ),
        map(externalProvider => {
            if (!externalProvider) {
                return undefined
            }
            const providerEx = new ethers.providers.Web3Provider(
                externalProvider,
            )
            ;(providerEx as Web3ProviderEx).external = externalProvider
            return providerEx as Web3ProviderEx
        }),
        mergeMap(provider =>
            from(
                InjectedConnector.prototype.getChainId
                    .apply({
                        externalProvider: provider,
                    })
                    .catch(() => undefined),
            ).pipe(
                map(Number),
                map(chainId => ({ provider, chainId })),
            ),
        ),
        withLatestFrom(Web3ProviderId$),
        mergeMap(([{ provider, chainId }, providerId]) => {
            if (!provider || !providerId) {
                return of(undefined)
            }
            const chain = config.Chains[config.Network]
            if (chainId === chain.id) {
                return of(provider)
            }
            let res: Observable<void>
            if (providerId === 'binanceChain') {
                const binance =
                    provider.external as BinanceChainWalletExternalProvider
                // desc: binanceChain wallet has a custom network switch method with limited functionality
                if (config.Network === Network.Mainnet) {
                    res = from(binance.switchNetwork('bsc-mainnet'))
                } else if (config.Network === Network.Testnet) {
                    res = from(binance.switchNetwork('bsc-testnet'))
                } else {
                    res = throwError(
                        () =>
                            new Web3ConnectError(
                                Web3ConnectErrorTypes.PartialNetworkSwitchCapability,
                            ),
                    )
                }
                // window.location.reload()
                return res.pipe(mapTo(provider))
            }
            if (!config.Web3Providers[providerId].supportsAddEthereumChain) {
                return throwError(
                    () =>
                        new Web3ConnectError(
                            Web3ConnectErrorTypes.NoNetworkSwitchCapability,
                        ),
                )
            }
            return from(
                provider.send('wallet_addEthereumChain', [
                    chain.config,
                ]) as Promise<{ result: null }>,
            ).pipe(mapTo(provider))
        }),
        catchError((e, observable) => merge(of(undefined), observable)),
        shareReplay(1),
    )
