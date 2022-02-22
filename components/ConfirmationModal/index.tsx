import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { ClassName, ControlStream } from 'types'
import Button from 'components/Button'
import ModalWrapper, { ModalControlStream } from 'components/ModalWrapper'
import { useLocale } from 'hooks/locale'

export type ConfirmationModalControlStream =
    ModalControlStream extends ControlStream<infer C>
        ? ControlStream<C | { type: 'confirm' }>
        : never

export type ConfirmationModalProps = PropsWithChildren<{
    className?: ClassName
    control: ConfirmationModalControlStream
}>

export default function ConfirmationModal({
    className,
    children,
    control,
}: ConfirmationModalProps): React.ReactElement | null {
    const __ = useLocale()
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
            control={control as ModalControlStream}>
            <div className={cn('flex', 'justify-end')}>
                <Button
                    job={() =>
                        control.next({
                            type: 'requestExit',
                        })
                    }
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
                    job={() =>
                        control.next({
                            type: 'requestExit',
                        })
                    }>
                    {__?.userInteraction.confirmation.cancel}
                </Button>
                <Button
                    job={() => control.next({ type: 'confirm' })}
                    className="border-primary bg-primary-darker hover:bg-primary-dark">
                    {__?.userInteraction.confirmation.confirm}
                </Button>
            </div>
        </ModalWrapper>
    )
}
