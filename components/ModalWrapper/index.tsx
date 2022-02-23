import React, { PropsWithChildren, useEffect, useRef } from 'react'
import cn from 'classnames'
import { ClassName, ControlStream } from 'types'
import Portal from 'components/Portal'
import { useControlStream } from 'hooks/control-stream'
import Fade from 'components/Fade'
import { canHoverMediaQuery, observeMediaQuery } from 'hooks/responsive'
import { portalStatus$ } from 'contexts/portal-status'
import { useSubscribe } from 'hooks/subscribe'
import { combineLatest, filter, map, tap } from 'rxjs'

export type ModalControlStreamOptions =
    | { type: 'requestExit' }
    | { type: 'display'; data: boolean }

export type ModalControlStream = ControlStream<ModalControlStreamOptions>

export type ModalWrapperProps = PropsWithChildren<{
    className?: ClassName
    classNames?: { container?: ClassName }
    control: ModalControlStream
}>

export default function ModalWrapper({
    className,
    classNames,
    children,
    control,
}: ModalWrapperProps): React.ReactElement | null {
    const display = useControlStream(control, 'display')

    useSubscribe(
        () =>
            combineLatest([
                control.pipe(
                    filter(x => x.type === 'display'),
                    map(x => ('data' in x ? x.data : false)),
                ),
                observeMediaQuery(canHoverMediaQuery),
            ]).pipe(map(([display, canHover]) => display && canHover)),
        portalStatus$,
    )

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (display) {
            ref.current?.focus()
        }
    }, [ref.current, display]) //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Portal>
            <Fade
                visible={display ?? false}
                onClick={() => control.next({ type: 'requestExit' })}
                tabIndex={0}
                onKeyDown={e =>
                    e.key === 'Escape' && control.next({ type: 'requestExit' })
                }
                ref={ref}>
                <div
                    className={cn(
                        'flex',
                        'justify-center',
                        'items-center',
                        'fixed',
                        'inset-0',
                        'bg-black',
                        'bg-opacity-60',
                        'z-50',
                        'overflow-y-auto',
                        'overscroll-none',
                        className,
                    )}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className={cn(
                            'flex',
                            'flex-col',
                            classNames?.container,
                        )}>
                        {children}
                    </div>
                </div>
            </Fade>
        </Portal>
    )
}
