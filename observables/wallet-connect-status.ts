import { combineLatest, distinctUntilChanged, map, shareReplay } from 'rxjs'
import { SignerAddress$ } from './signer-account'
import { Web3ProviderId$ } from './web3-provider-id'

export const WalletConnectStatus$ = combineLatest([
    Web3ProviderId$,
    SignerAddress$,
]).pipe(
    map(([id, address]) => !!(id && address)),
    distinctUntilChanged(),
    shareReplay(1),
)
