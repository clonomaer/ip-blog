import { config } from 'configs'
import { injectedConnector } from 'contexts/injected-connector'
import _ from 'lodash'
import {
    catchError,
    combineLatest,
    filter,
    from,
    fromEvent,
    map,
    mapTo,
    merge,
    mergeMap,
    Observable,
    of,
    shareReplay,
} from 'rxjs'
import { ExternalProvider } from 'types'
import { Web3ProviderEx$ } from './web3-provider-ex'

export const SignerAccount$: Observable<string | undefined> = merge(
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
                                merge(of(undefined), observable),
                            ),
                        )
                    } catch {
                        return of(undefined)
                    }
                }
                return of(undefined)
            }
            if (provider) {
                return from(provider.listAccounts()).pipe(map(([main]) => main))
            }
            return of(undefined)
        }),
    ),
    fromEvent(injectedConnector, 'Web3ReactDeactivate').pipe(mapTo(undefined)),
)
