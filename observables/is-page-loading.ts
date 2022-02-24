import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import {
    distinctUntilChanged,
    endWith,
    from,
    ignoreElements,
    map,
    mergeMap,
    scan,
    startWith,
} from 'rxjs'

export const isPageLoading$ = pageLoadingJobs$.pipe(
    mergeMap(job =>
        from(job).pipe(ignoreElements(), startWith(1), endWith(-1)),
    ),
    scan((acc, curr) => acc + curr, 0),
    map(x => x !== 0),
    startWith(true),
    distinctUntilChanged(),
)
