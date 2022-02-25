import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { useLazyRef } from 'hooks/lazy-ref'
import { filter, map, merge, of, Subject, switchAll, timer } from 'rxjs'
import { flashToast$ } from 'contexts/flash-toast'
import { useObservable } from 'hooks/observable'
import { config } from 'configs'
import _ from 'lodash'
import ModalWrapper, { ModalControl } from 'components/ModalWrapper'
import { useModal } from 'hooks/modal/modal-control'
import { controlStreamPayload } from 'operators/control-stream-payload'
import { useSubscribe } from 'hooks/subscribe'

export type FlashToastProps = {
    className?: ClassName
}

export default function FlashToast({
    className,
}: FlashToastProps): React.ReactElement | null {
    const control = useModal<ModalControl>()
    const message = useObservable(flashToast$)

    useSubscribe(
        () =>
            flashToast$.pipe(
                map(msg =>
                    merge<ModalControl[]>(
                        of({ Display: true }),
                        timer(
                            _.isString(msg)
                                ? !msg.startsWith('E0x')
                                    ? config.Delays.confirm
                                    : config.Delays.errorFlash
                                : msg.timeout,
                        ).pipe(map(() => ({ Display: false }))),
                    ),
                ),
                switchAll(),
            ),
        control,
    )

    useSubscribe(
        () =>
            control.pipe(
                controlStreamPayload('RequestExit'),
                map(() => ({ Display: false })),
            ),
        control,
    )

    return (
        <ModalWrapper className={className} control={control}>
            <div className="max-w-full w-96 text-center">
                {_.isString(message) ? message : message?.message ?? '??!!'}
            </div>
        </ModalWrapper>
    )
}
