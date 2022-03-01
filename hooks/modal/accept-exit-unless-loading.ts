import { ConfirmationModalControl } from 'components/ConfirmationModal'
import { ModalControl } from 'components/ModalWrapper'
import { useSubscribe } from 'hooks/subscribe'
import { controlStreamPayload } from 'operators/control-stream-payload'
import {
    distinctUntilChanged,
    filter,
    map,
    mapTo,
    mergeMap,
    shareReplay,
    startWith,
    Subject,
    take,
    withLatestFrom,
} from 'rxjs'

export function useAcceptExitUnlessLoading<T>(
    modalControl: Subject<{ Loading?: T } & ModalControl>,
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
                mapTo(false),
                withLatestFrom(
                    modalControl.pipe(controlStreamPayload('Display')),
                ),
                filter(([prev, curr]) => prev !== curr),
            )
        },
        () => modalControl.next({ Display: false }),
    )
}
