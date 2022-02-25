import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { ClassName, ControlStream } from 'types'
import Button from 'components/Button'
import ModalWrapper, { ModalControl } from 'components/ModalWrapper'
import { useLocale } from 'hooks/locale'
import { Subject } from 'rxjs'
import { useControlStream } from 'hooks/control-stream'

export type ConfirmationModalControl = Partial<{
    Confirm: true
    Loading: boolean
}> &
    ModalControl
export type ConfirmationModalProps = PropsWithChildren<{
    className?: ClassName
    control: Subject<ConfirmationModalControl>
}>

export default function ConfirmationModal({
    className,
    children,
    control,
}: ConfirmationModalProps): React.ReactElement | null {
    const __ = useLocale()
    const isLoading = useControlStream(control, 'Loading')
    return (
        <ModalWrapper
            className={className}
            classNames={{
                container: cn(
                    'rounded-lg',
                    'border',
                    'border-primary-dark',
                    'bg-page-bg',
                    'p-2',
                    'space-y-2',
                ),
            }}
            control={control}>
            <div className={cn('flex', 'justify-end')}>
                <Button
                    job={() => control.next({ RequestExit: true })}
                    className={cn(
                        'h-8',
                        'w-8',
                        'flex',
                        'justify-center',
                        'items-center',
                    )}>
                    x
                </Button>
            </div>
            <div className="px-3">{children}</div>
            <div className={cn('flex justify-end')}>
                <Button
                    disabled={isLoading}
                    job={() =>
                        control.next({
                            RequestExit: true,
                        })
                    }>
                    {__?.userInteraction.confirmation.cancel}
                </Button>
                <Button
                    job={() => control.next({ Confirm: true })}
                    isLoading={isLoading ?? false}
                    active>
                    {__?.userInteraction.confirmation.confirm}
                </Button>
            </div>
        </ModalWrapper>
    )
}
