import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'
import {
    SendReturnResult,
    SendReturn,
    Send,
    SendOld,
} from '@web3-react/injected-connector/dist/types'
import { ExternalProvider } from '../types'
import { config } from 'configs'
import { Web3ProviderEx$ } from 'observables/web3-provider-ex'
import { Web3ProviderId$ } from 'observables/web3-provider-id'
import { take } from 'rxjs'
import { SignerAccount$ } from 'observables/signer-account'

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
    return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
    public constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'No Ethereum provider was found.'
    }
}

export class UserRejectedRequestError extends Error {
    public constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'The user rejected the request.'
    }
}

export class InjectedConnector extends AbstractConnector {
    public externalProvider?: ExternalProvider | undefined

    constructor() {
        super({ supportedChainIds: [config.Chains[config.Network].id] })
        Web3ProviderEx$.subscribe({
            next: val => {
                if (val) {
                    this.externalProvider = val.external
                    Web3ProviderId$.pipe(take(1)).subscribe(
                        id =>
                            id !== 'binanceChain' &&
                            this.activate().catch(() => {
                                Web3ProviderId$.next(undefined)
                            }),
                    )
                }
            },
        })
        this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
        this.handleChainChanged = this.handleChainChanged.bind(this)
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    private handleChainChanged(chainId: string | number): void {
        this.emitUpdate({ chainId, provider: this.externalProvider })
    }

    private handleAccountsChanged(accounts: string[]): void {
        if (accounts.length === 0) {
            this.emitDeactivate()
        } else {
            this.emitUpdate({ account: accounts[0] ?? null })
        }
    }

    private handleClose(code: number, reason: string): void {
        this.emitDeactivate()
    }

    private handleNetworkChanged(networkId: string | number): void {
        this.emitUpdate({ chainId: networkId, provider: this.externalProvider })
    }

    public async activate(
        shouldEnable: boolean = true,
    ): Promise<ConnectorUpdate> {
        if (!this.externalProvider) {
            throw new NoEthereumProviderError()
        }

        if (this.externalProvider.on) {
            this.externalProvider.on('chainChanged', this.handleChainChanged)
            this.externalProvider.on(
                'accountsChanged',
                this.handleAccountsChanged,
            )
            this.externalProvider.on('close', this.handleClose)
            this.externalProvider.on(
                'networkChanged',
                this.handleNetworkChanged,
            )
        }

        if (this.externalProvider.isMetaMask) {
            ;(this.externalProvider as any).autoRefreshOnNetworkChange = false
        }

        // try to activate + get account via eth_requestAccounts
        let account
        if (shouldEnable) {
            try {
                account = await (this.externalProvider.send as any as Send)(
                    'eth_requestAccounts',
                ).then(sendReturn => parseSendReturn(sendReturn)[0])
            } catch (error) {
                if ((error as any).code === 4001) {
                    throw new UserRejectedRequestError()
                }
                warning(
                    false,
                    'eth_requestAccounts was unsuccessful, falling back to enable',
                )
            }

            // if unsuccessful, try enable
            if (!account) {
                // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
                account = await this.externalProvider
                    .enable?.()
                    .then(
                        sendReturn =>
                            sendReturn && parseSendReturn(sendReturn)[0],
                    )
            }
        }

        return {
            provider: this.externalProvider,
            ...(account ? { account } : {}),
        }
    }

    public async getProvider(): Promise<any> {
        return this.externalProvider
    }

    public async getChainId(): Promise<number | string> {
        if (!this.externalProvider) {
            throw new NoEthereumProviderError()
        }

        let chainId
        try {
            chainId = await (this.externalProvider.send as any as Send)(
                'eth_chainId',
            ).then(parseSendReturn)
        } catch {
            warning(
                false,
                'eth_chainId was unsuccessful, falling back to net_version',
            )
        }

        if (!chainId) {
            try {
                chainId = await (this.externalProvider.send as any as Send)(
                    'net_version',
                ).then(parseSendReturn)
            } catch {
                warning(
                    false,
                    'net_version was unsuccessful, falling back to net version v2',
                )
            }
        }

        if (!chainId) {
            try {
                chainId = parseSendReturn(
                    (this.externalProvider.send as SendOld)({
                        method: 'net_version',
                    }),
                )
            } catch {
                warning(
                    false,
                    'net_version v2 was unsuccessful, falling back to manual matches and static properties',
                )
            }
        }

        if (!chainId) {
            if ((this.externalProvider as any).isDapper) {
                chainId = parseSendReturn(
                    (this.externalProvider as any).cachedResults.net_version,
                )
            } else {
                chainId =
                    (this.externalProvider as any).chainId ||
                    (this.externalProvider as any).netVersion ||
                    (this.externalProvider as any).networkVersion ||
                    (this.externalProvider as any)._chainId
            }
        }

        return chainId
    }

    public async getAccount(): Promise<null | string> {
        if (!this.externalProvider) {
            throw new NoEthereumProviderError()
        }

        let account
        try {
            account = await (this.externalProvider.send as any as Send)(
                'eth_accounts',
            ).then(sendReturn => parseSendReturn(sendReturn)[0])
        } catch {
            warning(
                false,
                'eth_accounts was unsuccessful, falling back to enable',
            )
        }

        if (!account) {
            try {
                account = await this.externalProvider
                    .enable?.()
                    .then(sendReturn => parseSendReturn(sendReturn)[0])
            } catch {
                warning(
                    false,
                    'enable was unsuccessful, falling back to eth_accounts v2',
                )
            }
        }

        if (!account) {
            account = parseSendReturn(
                (this.externalProvider.send as SendOld)({
                    method: 'eth_accounts',
                }),
            )[0]
        }

        return account
    }

    public deactivate() {
        if (this.externalProvider && this.externalProvider.removeListener) {
            this.externalProvider.removeListener(
                'chainChanged',
                this.handleChainChanged,
            )
            this.externalProvider.removeListener(
                'accountsChanged',
                this.handleAccountsChanged,
            )
            this.externalProvider.removeListener('close', this.handleClose)
            this.externalProvider.removeListener(
                'networkChanged',
                this.handleNetworkChanged,
            )
        }
    }

    public async isAuthorized(): Promise<boolean> {
        if (!this.externalProvider) {
            return false
        }

        try {
            return await (this.externalProvider.send as any as Send)(
                'eth_accounts',
            ).then(sendReturn => {
                if (parseSendReturn(sendReturn).length > 0) {
                    return true
                } else {
                    return false
                }
            })
        } catch {
            return false
        }
    }
}
