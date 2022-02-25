import { config } from 'configs'
import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { waitFor } from 'helpers/wait-for'
import { useRouter } from 'next/router'
import { useOnce } from './once'

export function useRouteLoadingStatus(): void {
    const router = useRouter()
    useOnce(() => {
        let completeListeners: (() => void)[] = []
        let errorListeners: (() => void)[] = []
        function listener() {
            pageLoadingJobs$.next(
                Promise.all([
                    new Promise<void>((resolve, reject) => {
                        completeListeners.push(function () {
                            resolve()
                        })
                        errorListeners.push(function () {
                            reject()
                        })
                        router.events.on(
                            'routeChangeComplete',
                            completeListeners[completeListeners.length - 1]!,
                        )
                        router.events.on(
                            'routeChangeError',
                            errorListeners[errorListeners.length - 1]!,
                        )
                    }),
                    waitFor(config.Delays.min),
                ]),
            )
        }
        router.events.on('routeChangeStart', listener)
        return () => {
            router.events.off('routeChangeStart', listener)
            completeListeners.forEach(f =>
                router.events.off('routeChangeComplete', f),
            )
            errorListeners.forEach(f =>
                router.events.off('routeChangeError', f),
            )
        }
    })
}
