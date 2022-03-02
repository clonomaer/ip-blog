import { config } from 'configs'
import { localCache } from './local-cache'

export const recentPosts$ = localCache.observe<string[]>(
    config.RecentPostsLocalCacheKey,
)
