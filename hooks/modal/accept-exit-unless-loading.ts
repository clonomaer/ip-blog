import { ConfirmationModalControl } from 'components/ConfirmationModal'
import { ModalControl } from 'components/ModalWrapper'
import { useSubscribe } from 'hooks/subscribe'
import { controlStreamPayload } from 'operators/control-stream-payload'
import {
    filter,
    mergeMap,
    shareReplay,
    startWith,
    Subject,
    take,
    withLatestFrom,
} from 'rxjs'

export function useAcceptExitUnlessLoading(
    modalControl: Subject<ConfirmationModalControl>,
) {
    useSubscribe(
        () => {
            return modalControl.pipe(
                controlStreamPayload('RequestExit'),
                withLatestFrom(
                    modalControl.pipe(
                        controlStreamPayload('Loading'),
                        startWith(false),
                    ),
                ),
                filter(([_, x]) => !x),
            )
        },
        () => modalControl.next({ Display: false }),
    )
}
