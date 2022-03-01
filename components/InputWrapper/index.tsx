import React, {
    DetailedHTMLProps,
    InputHTMLAttributes,
    useEffect,
    useState,
} from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import {
    animationFrameScheduler,
    asapScheduler,
    asyncScheduler,
    distinctUntilChanged,
    filter,
    map,
    OperatorFunction,
    Subject,
    subscribeOn,
} from 'rxjs'
import _ from 'lodash'
import { useControlStream } from 'hooks/control-stream'
import { useSubscribe } from 'hooks/subscribe'
import { controlStreamPayload } from 'operators/control-stream-payload'

export type InputComponentError = string

export type InputControl = Partial<{
    Disable: boolean
    Value: string
    Error: string
    Loading: boolean
}>

type HTMLInputProps = Pick<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'value' | 'disabled' | 'onChange'
>

export type InputWrapperProps = {
    control: Subject<InputControl>
    validator?: OperatorFunction<string, InputComponentError>
    formatter?: OperatorFunction<string, string>
    parser?: OperatorFunction<string, string>
    sanitizer?: OperatorFunction<string, string>
} & HTMLInputProps

export type InputWrapperInnerComponentProps = {
    error: string | undefined
    isLoading: boolean | undefined
} & HTMLInputProps

export default function withInputWrapper<InnerComponentProps>(
    Component: React.FC<InnerComponentProps & InputWrapperInnerComponentProps>,
): React.FC<InnerComponentProps & InputWrapperProps> {
    return function WrappedComponent(p) {
        useEffect(() => {
            !_.isNil(p.value) && p.control.next({ Value: String(p.value) })
        }, [p.value])
        useEffect(() => {
            !_.isNil(p.disabled) && p.control.next({ Disable: p.disabled })
        }, [p.disabled])
        useSubscribe(
            () =>
                p.control.pipe(
                    controlStreamPayload('Value'),
                    distinctUntilChanged(),
                    p.parser ?? (x => x),
                    p.sanitizer ?? (x => x),
                    p.validator ?? filter(() => false),
                    map(x => ({ Error: x })),
                ),
            x => p.control.next(x),
        )
        useSubscribe(
            () =>
                p.control.pipe(
                    subscribeOn(asapScheduler),
                    controlStreamPayload('Value'),
                    distinctUntilChanged(),
                    p.sanitizer ?? (x => x),
                    p.formatter ?? (x => x),
                    map(x => ({ Value: x })),
                ),
            x => p.control.next(x),
        )
        const value = useControlStream(p.control, 'Value')
        const disabled = useControlStream(p.control, 'Disable')
        const error = useControlStream(p.control, 'Error')
        const isLoading = useControlStream(p.control, 'Loading')

        return (
            <Component
                {...(_.omit(p, [
                    'validator',
                    'sanitizer',
                    'control',
                    'formatter',
                    'parser',
                ]) as typeof p)}
                value={value ?? ''}
                disabled={disabled}
                error={error}
                isLoading={isLoading}
                onChange={e => {
                    p.onChange?.(e)
                    p.control.next({ Value: e.target.value })
                    const state = {
                        cursorStart: e.target.selectionStart,
                        cursorEnd: e.target.selectionEnd,
                        set: e.target.setSelectionRange.bind(e.target),
                    }
                    asapScheduler.schedule(
                        (_state?: typeof state) =>
                            _state?.set(_state.cursorStart, _state.cursorEnd),
                        undefined,
                        state,
                    )
                }}
            />
        )
    }
}
