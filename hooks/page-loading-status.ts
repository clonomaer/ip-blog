import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import { jobPool } from 'contexts/job-pool'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { map, Observable, timer } from 'rxjs'
import { useObservable } from './observable'
import { useSubscribe } from './subscribe'

export function usePageLoadingStatus(): [
    isLoading: boolean | null,
    addJob: (input: Promise<unknown> | Observable<unknown>) => void,
] {
    const router = useRouter()

    const isLoading = useObservable(
        () =>
            jobPool
                .observe(config.PageLoadingPoolKey)
                .pipe(map(x => x.remaining > 0)),
        { initialValue: true, ignoreErrors: true },
    )
    const addJob = useMemo(
        () => (input: Observable<unknown> | Promise<unknown>) =>
            jobPool.add(config.PageLoadingPoolKey, input),
        [],
    )
    useSubscribe(() => jobPool.observe(config.PageLoadingPoolKey), {
        error: e => {
            console.error('Error finishing jobs required to render the page', e)
            flashToast$.next(
                'There was an error loading locale files, page will refresh to retry.',
            )
            timer(config.Delays.confirm).subscribe(() => router.reload())
        },
    })
    return [isLoading, addJob]
}
