import { OperatorFunction } from 'rxjs'

export type ValidationResults<
    Data = string,
    Messages extends string = string,
> = {
    data: Data
    validation: { passed: boolean; message?: Messages }
}

export type ValidationOperator<
    T = string,
    Message extends string = string,
> = () => OperatorFunction<T, ValidationResults<T, Message>>

export type FormatterOperator<args extends unknown[] = [], T = string> = (
    ...args: args
) => OperatorFunction<T, T>
