import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { waitFor } from 'helpers/wait-for'
import { useRouter } from 'next/router'

export function useRoutePush() {
    const router = useRouter()
    return (path: string) => () =>
        pageLoadingJobs$.next(waitFor(200).then(() => router.push(path)))
}
