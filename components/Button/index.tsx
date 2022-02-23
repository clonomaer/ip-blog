import React, {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    PropsWithChildren,
} from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import withButtonWrapper, {
    WithButtonWrapperInnerComponentRequiredProps,
} from 'components/ButtonWrapper'
import _ from 'lodash'
import LoadingOverlay from 'components/LoadingOverlay'

export type ButtonProps = PropsWithChildren<{
    className?: ClassName
    activeClassName?: ClassName
    inactiveClassName?: ClassName
    active?: boolean
}> &
    DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > &
    WithButtonWrapperInnerComponentRequiredProps

const Button = withButtonWrapper<ButtonProps>(function InnerButton({
    className,
    children,
    active,
    activeClassName,
    inactiveClassName,
    isLoading,
    ...props
}): React.ReactElement | null {
    return (
        <button
            className={cn(
                'rounded-lg border transition-colors duration-150 px-4 py-2 m-2 disabled:border-gray-500 disabled:bg-gray-800 disabled:text-gray-500 hover:border-gray-400 hover:text-page-text-hover',
                active
                    ? activeClassName ??
                          'border-primary bg-primary-dark active:bg-primary-dark'
                    : inactiveClassName ??
                          'border-primary-dark active:bg-primary-dark',
                'relative',
                isLoading &&
                    'text-transparent hover:text-transparent disabled:text-transparent',
                className,
            )}
            {..._.omit(props, 'job')}>
            <LoadingOverlay visible={!!isLoading} />
            {children}
        </button>
    )
})
export default Button
