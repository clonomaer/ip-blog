import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import { localeContext$ } from 'contexts/locale-context'
import { __ } from 'locales'
import { WebsiteLocale } from 'locales/interface'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { timer } from 'rxjs'
import { useObservable } from './observable'
import { useOnce } from './once'
import { usePageLoadingStatus } from './page-loading-status'
import { useSubscribe } from './subscribe'

export function useLocale(): WebsiteLocale | undefined {
    const locale = useObservable(localeContext$, { ignoreErrors: true })
    const [_, addLoadingJob] = usePageLoadingStatus()
    const router = useRouter()
    useOnce(() => {
        addLoadingJob(__(), 'locale')
    })
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
