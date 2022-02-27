import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import { localCache } from 'contexts/local-cache'
import { isWeb3ProviderId } from 'helpers/validate-web3-provider'
import { __$ } from 'locales'
import {
    asyncScheduler,
    EMPTY,
    filter,
    map,
    mergeMap,
    of,
    scan,
    shareReplay,
    tap,
    timer,
} from 'rxjs'
import { Web3ProviderId } from 'types'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'

export const Web3ProviderId$ = localCache
    .observe<string | undefined>(config.Web3ProviderIdCacheKey)
    .pipe(
        map(x => (x && isWeb3ProviderId(x) ? x : undefined)),
        //HACK: this includes side effects
        scan(
            (acc, id) => {
                if (acc.lastValid && id && id !== acc.lastValid) {
                    __$.subscribe(__ => {
                        flashToast$.next(__.web3Provider.changedWillReload)
                        asyncScheduler.schedule(() => {
                            window.location.reload()
                        }, config.Delays.errorFlash)
                    })
                    return { ...acc, current: undefined }
                }
                if (id) {
                    return { lastValid: id, current: id }
                }
                return { ...acc, current: id }
            },
            { lastValid: undefined, current: undefined } as {
                [key in 'lastValid' | 'current']: Web3ProviderId | undefined
            },
        ),
        map(({ current }) => current),
    )
