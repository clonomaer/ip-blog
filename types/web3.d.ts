import { ethers } from 'ethers'
import { Observable, ReplaySubject, Subject } from 'rxjs'
import { EventEmitter } from 'events'

export type ExternalProvider = ethers.providers.ExternalProvider &
    EventEmitter & {
        enable?: () => Promise<unknown>
    }

export type Web3ProviderEx = ethers.providers.Web3Provider & {
    external: ExternalProvider
}

export type Web3ProviderId = 'metamask' | 'binanceChain' | 'trust' | 'safePal'

export type SignerAccountObservable = ReplaySubject<string | undefined>

export type Web3ProviderExObservable = ReplaySubject<Web3ProviderEx | undefined>

export type Web3ProviderIdObservable = ReplaySubject<Web3ProviderId | undefined>

export type WalletConnectStatusObservable = Observable<true | Error>

export type Web3RegisteredListener = {
    provider: ExternalProvider
    event: string
    listener: (...args: any[]) => void
}
