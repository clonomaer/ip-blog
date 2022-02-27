import { from, map, mergeMap, of, shareReplay } from 'rxjs'
import { Web3ProviderEx$ } from './web3-provider-ex'

export const SignerAccount$ = Web3ProviderEx$.pipe(
    mergeMap(provider =>
        !provider
            ? of(undefined)
            : from(provider.listAccounts()).pipe(map(([main]) => main)),
    ),
)
