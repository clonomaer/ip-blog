import { config } from 'configs'
import { injectedConnector } from 'contexts/injected-connector'
import _ from 'lodash'
import {
    asyncScheduler,
    catchError,
    combineLatest,
    distinctUntilChanged,
    filter,
    from,
    fromEvent,
    map,
    mapTo,
    merge,
    mergeMap,
    Observable,
    observeOn,
    of,
    shareReplay,
    startWith,
    take,
    tap,
    withLatestFrom,
} from 'rxjs'
import { ExternalProvider } from 'types'
import { Web3ProviderEx$ } from './web3-provider-ex'
import { Web3ProviderId$ } from './web3-provider-id'

export const Signer$ = combineLatest({
    update: fromEvent(injectedConnector, 'Web3ReactUpdate').pipe(
        startWith(undefined),
    ),
    provider: Web3ProviderEx$.pipe(startWith(undefined)),
    deactivate: fromEvent(injectedConnector, 'Web3ReactDeactivate').pipe(
        startWith(undefined),
    ),
}).pipe(
    map(({ provider }) => provider?.getSigner()),
    distinctUntilChanged(),
    shareReplay(1),
)

export const SignerAddress$ = Signer$.pipe(
    mergeMap(x => x?.getAddress().catch(() => undefined) ?? of(undefined)),
    shareReplay(1),
)
