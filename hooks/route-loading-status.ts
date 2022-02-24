import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { useRouter } from 'next/router'
import { useOnce } from './once'

export function useRouteLoadingStatus(): void {
    const router = useRouter()
    useOnce(() => {
        router.events.on('routeChangeStart', () => {
            pageLoadingJobs$.next(
                new Promise<void>((resolve, reject) => {
                    router.events.on('routeChangeComplete', () => resolve())
                    router.events.on('routeChangeError', () => reject())
                }),
            )
        })
    })
}
