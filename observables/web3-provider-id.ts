import { config } from 'configs'
import { localCache } from 'contexts/local-cache'
import { isWeb3ProviderId } from 'helpers/validate-web3-provider'
import { __$ } from 'locales'
import { distinctUntilChanged, filter, map, ReplaySubject } from 'rxjs'
import { Web3ProviderId } from 'types'

export const Web3ProviderId$ = new ReplaySubject<Web3ProviderId | undefined>(1)

localCache
    .observe<string | undefined>(config.Web3ProviderIdCacheKey)
    .pipe(
        map(x => (x && isWeb3ProviderId(x) ? x : undefined)),
        distinctUntilChanged(),
    )
    .subscribe(Web3ProviderId$)

Web3ProviderId$.pipe(
    map(x => (x && isWeb3ProviderId(x) ? x : undefined)),
    distinctUntilChanged(),
).subscribe(
    localCache.observe<string | undefined>(config.Web3ProviderIdCacheKey),
)
