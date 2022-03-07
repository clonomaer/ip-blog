import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { locale$, __$ } from 'locales'
import { take } from 'rxjs'
import { useOnce } from './once'

export function useBuildLocale(): void {
    useOnce(() => {
        locale$.next('en')
    })
    useOnce(() => {
        pageLoadingJobs$.next(__$.pipe(take(1)))
    })
}
