import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { localeFactory$ } from 'locales'
import { WebsiteLocaleData } from 'locales/interface'
import { useLazyRef } from './lazy-ref'
import { useObservable } from './observable'
import { useOnce } from './once'

export function useLocale(): WebsiteLocaleData | undefined {
    const localeData$ = useLazyRef(() => localeFactory$())
    const locale = useObservable(() => localeData$.current, {
        ignoreErrors: true,
    })
    useOnce(() => {
        pageLoadingJobs$.next(localeData$.current)
    })
    return locale
}
