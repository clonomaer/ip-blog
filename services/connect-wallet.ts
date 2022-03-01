import { config } from 'configs'
import { Network } from 'configs/web3'
import { injectedConnector } from 'contexts/injected-connector'
import { Web3ProviderEx$ } from 'observables/web3-provider-ex'
import { Web3ProviderId$ } from 'observables/web3-provider-id'
import { ReplaySubject } from 'rxjs'
import {
    BinanceChainWalletExternalProvider,
    Web3ProviderEx,
    Web3ProviderId,
} from 'types'
import { getSubjectValue } from 'utils/get-subject-value'

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

/**@throws {Web3ConnectError} */
export async function handleNetworkId(
    providerId: Web3ProviderId,
    provider: Web3ProviderEx,
): Promise<void> {
    const chain = config.Chains[config.Network]

    if (Number(await injectedConnector.getChainId()) !== chain.id) {
        try {
            if (providerId === 'binanceChain') {
                const binance =
                    provider.external as BinanceChainWalletExternalProvider
                // TODO: move this to a better place
                // desc: binanceChain wallet has a custom network switch method with limited functionality
                if (config.Network === Network.Mainnet) {
                    await binance.switchNetwork('bsc-mainnet')
                } else if (config.Network === Network.Testnet) {
                    await binance.switchNetwork('bsc-testnet')
                } else {
                    throw new Web3ConnectError(
                        Web3ConnectErrorTypes.PartialNetworkSwitchCapability,
                    )
                }
                window.location.reload()
            } else if (
                !config.Web3Providers[providerId].supportsAddEthereumChain
            ) {
                throw new Web3ConnectError(
                    Web3ConnectErrorTypes.NoNetworkSwitchCapability,
                )
            } else {
                await provider.send('wallet_addEthereumChain', [chain.config])
            }
        } catch (err) {
            console.error(err)
            throw new Web3ConnectError(
                Web3ConnectErrorTypes.CantSwitchNetwork,
                err,
            )
        }
    }
}

/**
 * @returns main signer account
 * @throws {Web3ConnectError}
 */
export async function connectWallet(): Promise<string | undefined> {
    const id = getSubjectValue(Web3ProviderId$)
    const provider = getSubjectValue(
        Web3ProviderEx$ as ReplaySubject<Web3ProviderEx | undefined>, // because the source is a ReplaySubject
    )
    if (!id || !provider) {
        throw new Web3ConnectError(Web3ConnectErrorTypes.UnavailableProvider)
    }
    await handleNetworkId(id, provider)
    await injectedConnector.activate()
    return (await provider.listAccounts())[0]
}
