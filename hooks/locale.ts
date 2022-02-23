import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import { localeContext$ } from 'contexts/locale-context'
import { __ } from 'locales'
import { WebsiteLocale } from 'locales/interface'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { timer } from 'rxjs'
import { useGetIsFirstRender } from './is-first-render'
import { useObservable } from './observable'
import { usePageLoadingStatus } from './page-loading-status'
import { useSubscribe } from './subscribe'

export function useLocale(): WebsiteLocale | undefined | Error {
    const locale = useObservable(localeContext$)
    const [_, addLoadingJob] = usePageLoadingStatus()
    const getIsFirstRender = useGetIsFirstRender()
    const router = useRouter()
    useEffect(() => {
        if (getIsFirstRender()) {
            addLoadingJob(__())
        }
    }, [])
    useSubscribe(localeContext$, {
        error: e => {
            console.error('Error loading locale', e)
            flashToast$.next(
                'There was an error loading locale files, page will refresh to retry.',
            )
            timer(config.Delays.confirm).subscribe(() => router.reload())
        },
    })
    return locale
}
