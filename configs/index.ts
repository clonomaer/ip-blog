import themeConfig from '../tailwind.config'

export const config = {
    Delays: {
        min: 300,
        timeout: 20000,
        suggestRefresh: 8000,
        fastLeave: {
            window: 50,
            minDelay: 500,
        },
    },
    CountdownUnits: {
        y: 3600 * 24 * 365 * 1000,
        d: 3600 * 24 * 1000,
        h: 3600 * 1000,
        m: 60 * 1000,
        s: 1000,
    },
    Spacings: themeConfig.theme.spacing,
    Screens: themeConfig.theme.screens,
    BrowserLocalStorageCacheKey: 'browser-local-storage-',
    JobPoolMemoryCacheKey: 'job-pool-mem-cache-',
    Retry: {
        Timeout: 2000,
        MaxAttempts: 10,
        ExponentialBackOff: 1.2,
        MaxTimeout: 10000,
    },
    PageLoadingPoolKey: 'job-pool-page-loading-queue-',
}
