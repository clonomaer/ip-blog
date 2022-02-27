import { config } from 'configs'
import { localCache } from 'contexts/local-cache'
import { isWeb3ProviderId } from 'helpers/validate-web3-provider'
import { __$ } from 'locales'
import { filter, map } from 'rxjs'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'

export const Web3ProviderId$ = localCache
    .observe<string | undefined>(config.Web3ProviderIdCacheKey)
    .pipe(map(x => (x && isWeb3ProviderId(x) ? x : undefined)))
