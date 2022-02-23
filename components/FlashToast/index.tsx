import React, { PropsWithChildren, useEffect, useState } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import ModalWrapper, { ModalControlStream } from 'components/ModalWrapper'
import { useLazyRef } from 'hooks/lazy-ref'
import { delay, filter, map, merge, scan, Subject } from 'rxjs'
import { flashToast$ } from 'contexts/flash-toast'
import { useObservable } from 'hooks/observable'
import { config } from 'configs'

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
            .pipe(map(() => ({ type: 'display' as 'display', data: true })))
            .subscribe(control.current)

        merge(
            flashToast$.pipe(map(() => 1)),
            flashToast$.pipe(
                delay(config.Delays.confirm),
                map(() => -1),
            ),
        )
            .pipe(
                scan((acc, curr) => acc + curr, 0),
                filter(x => x === 0),
                map(() => ({ type: 'display' as 'display', data: false })),
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
            {message}
        </ModalWrapper>
    )
}
