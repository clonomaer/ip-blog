import { config } from 'configs'
import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { waitFor } from 'helpers/wait-for'
import { useRouter } from 'next/router'
import { useOnce } from './once'

export function useRouteLoadingStatus(): void {
    const router = useRouter()
    useOnce(() => {
        router.events.on('routeChangeStart', () => {
            pageLoadingJobs$.next(
                Promise.all([
                    new Promise<void>((resolve, reject) => {
                        router.events.on('routeChangeComplete', () => resolve())
                        router.events.on('routeChangeError', () => reject())
                    }),
                    waitFor(config.Delays.min),
                ]),
            )
        })
    })
}
