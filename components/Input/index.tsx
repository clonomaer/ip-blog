import React, { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import _ from 'lodash'
import withInputWrapper from 'components/InputWrapper'

export type InputProps = {
    className?: { outer?: ClassName; wrapper?: ClassName; target?: ClassName }
    label?: string
} & Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'className'
>

const Input = withInputWrapper<InputProps>(function InnerInput({
    className,
    label,
    error,
    isLoading,
    ...props
}) {
    return (
        <div className={cn('table-row', className?.outer)}>
            {label && <label className="table-cell pr-2">{`${label}:`}</label>}
            <div className={cn('table-cell', className?.wrapper)}>
                <input
                    className={cn(
                        'h-10',
                        'border bg-primary-darker rounded-md py-1 px-2 outline-none',
                        'transition-all',
                        _.isEmpty(error)
                            ? 'border-primary focus:border-gray-300'
                            : 'border-red-600 focus:border-red-500',
                        className?.target,
                    )}
                    {...props}
                />
                <div className="text-red-600">{error}</div>
            </div>
        </div>
    )
})
export default Input
