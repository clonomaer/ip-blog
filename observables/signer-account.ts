import { map, mergeMap, shareReplay } from 'rxjs'
import { Web3ProviderEx$ } from './web3-provider-ex'

export const SignerAccount$ = Web3ProviderEx$.pipe(
    mergeMap(provider => provider.listAccounts()),
    map(([main]) => main),
)
