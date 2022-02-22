import { LocalCache } from 'services/local-cache-v2'
import { browserLocalStorage } from './browser-local-storage'
import { memoryCache } from './memory-cache'

export const localCache = new LocalCache(
    browserLocalStorage,
    [],
    [],
    memoryCache,
)
