import { config } from 'configs'
import { jobPool } from 'contexts/job-pool'
import { useMemo } from 'react'
import { map, Observable } from 'rxjs'
import { useObservable } from './observable'

export function usePageLoadingStatus(): [
    isLoading: boolean | null,
    addJob: (input: Promise<unknown> | Observable<unknown>) => void,
] {
    const isLoading = useObservable(
        () =>
            jobPool
                .observe(config.PageLoadingPoolKey)
                .pipe(map(x => x.remaining > 0)),
        { initialValue: true },
    )
    const addJob = useMemo(
        () => (input: Observable<unknown> | Promise<unknown>) =>
            jobPool.add(config.PageLoadingPoolKey, input),
        [],
    )
    return [isLoading, addJob]
}
