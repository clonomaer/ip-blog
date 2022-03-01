import { ethers } from 'ethers'
import { Observable, ReplaySubject, Subject } from 'rxjs'
import { EventEmitter } from 'events'

export type ExternalProvider = ethers.providers.ExternalProvider &
    EventEmitter & {
        enable?: () => Promise<unknown>
    }

export type BinanceChainWalletExternalProvider = ExternalProvider & {
    switchNetwork: (networkId: string) => Promise<void>
}

export type Web3ProviderEx = ethers.providers.Web3Provider & {
    external: ExternalProvider
}

export type Web3ProviderId = 'metamask' | 'binanceChain' | 'trust' | 'safePal'

export type Web3RegisteredListener = {
    provider: ExternalProvider
    event: string
    listener: (...args: any[]) => void
}
