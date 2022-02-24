import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import ModalWrapper, {
    ModalControlStream,
    ModalControlStreamOptions,
} from 'components/ModalWrapper'
import { useLazyRef } from 'hooks/lazy-ref'
import { filter, map, merge, of, Subject, switchAll, timer } from 'rxjs'
import { flashToast$ } from 'contexts/flash-toast'
import { useObservable } from 'hooks/observable'
import { config } from 'configs'
import _ from 'lodash'

export type FlashToastProps = {
    className?: ClassName
}

export default function FlashToast({
    className,
}: FlashToastProps): React.ReactElement | null {
    const control = useLazyRef<ModalControlStream>(() => new Subject())
    const message = useObservable(flashToast$)
    useEffect(() => {
        flashToast$
            .pipe(
                map(msg =>
                    merge<ModalControlStreamOptions[]>(
                        of({ type: 'display', data: true }),
                        timer(
                            _.isString(msg)
                                ? !msg.startsWith('E0x')
                                    ? config.Delays.confirm
                                    : config.Delays.errorFlash
                                : msg.timeout,
                        ).pipe(map(() => ({ type: 'display', data: false }))),
                    ),
                ),
                switchAll(),
            )
            .subscribe(control.current)

        control.current
            .pipe(
                filter(x => x.type === 'requestExit'),
                map(() => ({ type: 'display' as 'display', data: false })),
            )
            .subscribe(control.current)
    }, [])
    return (
        <ModalWrapper className={className} control={control.current}>
            <div className="max-w-full w-96">
                {_.isString(message) ? message : message?.message ?? '??!!'}
            </div>
        </ModalWrapper>
    )
}
