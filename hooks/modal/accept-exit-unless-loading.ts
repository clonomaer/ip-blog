import { ConfirmationModalControl } from 'components/ConfirmationModal'
import { ModalControl } from 'components/ModalWrapper'
import { useSubscribe } from 'hooks/subscribe'
import { controlStreamPayload } from 'operators/control-stream-payload'
import { filter, mergeMap, shareReplay, startWith, Subject, take } from 'rxjs'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'

export function useAcceptExitUnlessLoading(
    modalControl: Subject<ConfirmationModalControl>,
) {
    useSubscribe(
        () => {
            const sharedIsLoading = modalControl.pipe(
                controlStreamPayload('Loading'),
                filter(noSentinelOrUndefined),
                startWith(false),
                shareReplay(1),
            )
            return modalControl.pipe(
                controlStreamPayload('RequestExit'),
                filter(noSentinelOrUndefined),
                mergeMap(() => sharedIsLoading.pipe(take(1))),
                filter(x => !x),
            )
        },
        () => modalControl.next({ Display: false }),
    )
}
