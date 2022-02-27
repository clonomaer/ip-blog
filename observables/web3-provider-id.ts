import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import { localCache } from 'contexts/local-cache'
import { isWeb3ProviderId } from 'helpers/validate-web3-provider'
import { __$ } from 'locales'
import { asyncScheduler, EMPTY, filter, mergeMap, of, tap, timer } from 'rxjs'
import { Web3ProviderId } from 'types'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'

export const web3ProviderId$ = localCache
    .observe<string | undefined>(config.Web3ProviderIdCacheKey)
    .pipe(filter(noSentinelOrUndefined), filter(isWeb3ProviderId))

const validProvider: { last: Web3ProviderId | undefined } = {
    last: undefined,
}

const handleWeb3ProviderIdChangeSubscription = web3ProviderId$.subscribe({
    next: id => {
        if (validProvider.last && id && id !== validProvider.last) {
            __$.subscribe(__ => {
                flashToast$.next(__.web3Provider.changedWillReload)
                asyncScheduler.schedule(() => {
                    window.location.reload()
                }, config.Delays.errorFlash)
            })
            return
        }
        if (id) {
            validProvider.last = id
            return
        }
    },
})
