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
    take,
    tap,
    withLatestFrom,
} from 'rxjs'
import { ExternalProvider } from 'types'
import { Web3ProviderEx$ } from './web3-provider-ex'
import { Web3ProviderId$ } from './web3-provider-id'

export const SignerAccount$: Observable<string | undefined | null> = merge(
    Web3ProviderEx$.pipe(
        mergeMap(provider => {
            if (!provider) {
                return of(null)
            }
            return from(provider.listAccounts()).pipe(map(([main]) => main))
        }),
    ),
    combineLatest({
        update: fromEvent(injectedConnector, 'Web3ReactUpdate'),
        provider: Web3ProviderEx$,
    }).pipe(
        mergeMap(({ update, provider }) => {
            if (_.has(update, 'account')) {
                return of(_.get(update, 'account') as string)
            }
            if (_.has(update, 'chainId')) {
                if (
                    Number(_.get(update, 'chainId')) ===
                    config.Chains[config.Network].id
                ) {
                    if (provider) {
                        return from(provider.listAccounts()).pipe(
                            map(([main]) => main),
                        )
                    }
                    const exProvider = _.get(
                        update,
                        'provider',
                    ) as ExternalProvider
                    try {
                        return from(
                            (exProvider.request?.({
                                method: 'eth_requestAccounts',
                            }) as Promise<string[]>) ?? of([] as string[]),
                        ).pipe(
                            map(([main]) => main),
                            catchError((e, observable) =>
                                merge(of(null), observable),
                            ),
                        )
                    } catch {
                        return of(null)
                    }
                }
                return of(null)
            }
            if (provider) {
                return from(provider.listAccounts()).pipe(map(([main]) => main))
            }
            return of(null)
        }),
    ),
    fromEvent(injectedConnector, 'Web3ReactDeactivate').pipe(mapTo(null)),
).pipe(
    catchError((e, observable) => merge(of(null), observable)),
    distinctUntilChanged(),
    tap(x => x === null && Web3ProviderId$.next(undefined)),
    shareReplay(1),
)
