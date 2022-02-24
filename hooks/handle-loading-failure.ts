import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import { useRouter } from 'next/router'
import { isPageLoading$ } from 'observables/is-page-loading'
import { timer } from 'rxjs'
import { useSubscribe } from './subscribe'

export function useHandlePageLoadingFailure(): void {
    const router = useRouter()

    useSubscribe(isPageLoading$, {
        error: e => {
            console.error(
                'E0x00: Error finishing jobs required to render the page, origin:',
                e,
            )
            flashToast$.next(
                `E0x00: There was a fatal error loading the page, page will refresh to retry. origin: ${
                    e?.toString?.() ?? e
                }`,
            )
            timer(config.Delays.confirm).subscribe(() => router.reload())
        },
    })
}
