import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { usePageLoadingStatus } from './page-loading-status'

export function useRouteLoadingStatus(): void {
    const router = useRouter()
    const [, addLoadingJob] = usePageLoadingStatus()
    useEffect(() => {
        router.events.on('routeChangeStart', () => {
            addLoadingJob(
                new Promise<void>((resolve, reject) => {
                    router.events.on('routeChangeComplete', () => resolve())
                    router.events.on('routeChangeError', () => reject())
                }),
                'route changed',
            )
        })
    }, [])
}
