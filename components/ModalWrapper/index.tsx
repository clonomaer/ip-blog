import React, { PropsWithChildren, useEffect, useRef } from 'react'
import cn from 'classnames'
import { ClassName, ControlStream, Not } from 'types'
import Portal from 'components/Portal'
import { useControlStream } from 'hooks/control-stream'
import Fade from 'components/Fade'
import { canHoverMediaQuery, observeMediaQuery } from 'hooks/responsive'
import { isPortalOpen$ } from 'contexts/is-portal-open'
import { useSubscribe } from 'hooks/subscribe'
import { combineLatest, filter, map, Subject, tap } from 'rxjs'
import { controlStreamPayload } from 'operators/control-stream-payload'
import _ from 'lodash'

export type ModalControl = Partial<{
    RequestExit: true
    Display: boolean
}>

export type ModalWrapperProps = PropsWithChildren<{
    className?: ClassName
    classNames?: { container?: ClassName }
    control: Subject<ModalControl>
}>

export default function ModalWrapper({
    className,
    classNames,
    children,
    control,
}: ModalWrapperProps): React.ReactElement | null {
    const display = useControlStream(control, 'Display')

    useSubscribe(
        () => control.pipe(controlStreamPayload('Display')),
        x => isPortalOpen$.next(x),
    )

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (display) {
            ref.current?.focus({ preventScroll: true })
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [ref.current, display]) //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Portal>
            <Fade
                visible={display ?? false}
                onClick={() => control.next({ RequestExit: true })}
                tabIndex={0}
                onKeyDown={e =>
                    e.key === 'Escape' && control.next({ RequestExit: true })
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
