import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { useLazyRef } from 'hooks/lazy-ref'
import {
    combineLatest,
    filter,
    map,
    mapTo,
    merge,
    mergeMap,
    mergeWith,
    of,
    pairwise,
    scan,
    startWith,
    Subject,
    switchAll,
    tap,
    timer,
    withLatestFrom,
} from 'rxjs'
import { flashToast$ } from 'contexts/flash-toast'
import { useObservable } from 'hooks/observable'
import { config } from 'configs'
import _ from 'lodash'
import ModalWrapper, { ModalControl } from 'components/ModalWrapper'
import { useCreateControl } from 'hooks/control/create-control'
import { controlStreamPayload } from 'operators/control-stream-payload'
import { useSubscribe } from 'hooks/subscribe'
import { SENTINEL } from 'contexts/empty-sentinel'

export type FlashToastProps = {
    className?: ClassName
}

export default function FlashToast({
    className,
}: FlashToastProps): React.ReactElement | null {
    const [control$] = useCreateControl<ModalControl>()
    const message = useObservable(flashToast$, {
        errorTransformer: err => err.message,
    })

    useSubscribe(
        () =>
            flashToast$.pipe(
                mergeMap(msg =>
                    combineLatest([
                        timer(
                            _.isString(msg)
                                ? !msg.startsWith('E0x')
                                    ? config.Delays.confirm
                                    : config.Delays.errorFlash
                                : msg.timeout,
                        ),
                        control$.pipe(
                            controlStreamPayload('RequestExit'),
                            startWith(SENTINEL),
                        ),
                    ]).pipe(
                        filter(([_, x]) => x === SENTINEL),
                        mapTo(-1),
                        startWith(1),
                    ),
                ),
                mergeWith(
                    control$.pipe(
                        controlStreamPayload('RequestExit'),
                        mapTo(null),
                    ),
                ),
                scan((acc, curr) => (curr === null ? 0 : acc + curr), 0),
                startWith(0),
                pairwise(),
            ),
        x =>
            (x[0] === 0 || x[1] === 0) &&
            x[0] !== x[1] &&
            control$.next(x[0] === 0 ? { Display: true } : { Display: false }),
    )

    useSubscribe(
        () =>
            control$.pipe(
                controlStreamPayload('RequestExit'),
                withLatestFrom(control$.pipe(controlStreamPayload('Display'))),
                filter(([_, x]) => x),
                map(() => ({ Display: false })),
            ),
        control$,
    )

    return (
        <ModalWrapper className={className} control={control$}>
            <div className="max-w-full w-96 text-center">
                {_.isString(message) ? message : message?.message ?? '??!!'}
            </div>
        </ModalWrapper>
    )
}
