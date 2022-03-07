import { ethers } from 'ethers'
import { Observable, ReplaySubject, Subject } from 'rxjs'
import { EventEmitter } from 'events'

export type Web3ProviderId = 'metamask' | 'binanceChain' | 'trust' | 'safePal'

export type Web3RegisteredListener = {
    provider: providers.ExternalProvider
    event: string
    listener: (...args: any[]) => void
}
