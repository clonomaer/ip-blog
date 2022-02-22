import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'

export type LoadingSpinnerProps = {
    className?: ClassName
    big?: boolean
}

export default function LoadingSpinner({
    className,
    big,
}: LoadingSpinnerProps): React.ReactElement | null {
    return (
        <div
            className={cn(
                className,
                'animate-spin',
                'absolute',
                'rounded-full',
                'border-solid',
                'border-primary-dark',
                'border-t-primary',
                big
                    ? cn('border-8', 'w-16', 'h-16')
                    : cn('border-4', 'w-5', 'h-5'),
            )}
        />
    )
}
