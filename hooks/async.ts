import _ from 'lodash'
import { useEffect, useMemo, useState, DependencyList } from 'react'
import { from } from 'rxjs'
import { Retry } from '../providers/retry'
import { LazyEvalAsync } from '../types'

type Optional<T> = {
    [K in keyof T]?: T[K]
}

type ErrorHandlerOption = {
    errorHandler?: (error: any) => void
}
type InitialValueOption<T> = {
    initialValue: T
}
type TransformerOption<T, R> = {
    transformer: (arg: T) => R | Promise<R>
}

export function useAsync<T>(
    input: LazyEvalAsync<T>,
    dependencies?: DependencyList,
    options?: ErrorHandlerOption,
): T | undefined
export function useAsync<T, R>(
    input: LazyEvalAsync<T>,
    dependencies: DependencyList,
    options: TransformerOption<T, R> &
        InitialValueOption<T> &
        ErrorHandlerOption,
): R
export function useAsync<T, R>(
    input: LazyEvalAsync<T>,
    dependencies: DependencyList,
    options: TransformerOption<T, R> & ErrorHandlerOption,
): R | undefined
export function useAsync<T>(
    input: LazyEvalAsync<T>,
    dependencies?: DependencyList,
    options?: InitialValueOption<T> & ErrorHandlerOption,
): T
export function useAsync<T, R>(
    input: LazyEvalAsync<T>,
    dependencies: DependencyList = [],
    {
        initialValue,
        transformer,
        errorHandler,
    }: Optional<InitialValueOption<T>> &
        Optional<TransformerOption<T, R>> &
        ErrorHandlerOption = {},
) {
    const [sync, setSync] = useState<T | R | undefined>(() => {
        if (_.isFunction(transformer) && !_.isNil(initialValue)) {
            const res = transformer(initialValue)
            if (typeof res === 'object' && 'then' in res) {
                res.then(val =>
                    setSync(curr => (curr === undefined ? val : curr)),
                )
                return undefined
            }
            return res
        }
        return initialValue
    })
    const notLazy = useMemo(
        () =>
            _.isFunction(input)
                ? Retry(input as (...args: any[]) => T | Promise<T>)
                : input,
        [...dependencies, ...(_.isFunction(input) ? [] : [input])],
    )
    useEffect(() => {
        const subscription = from(Promise.resolve(notLazy)).subscribe({
            next: async value => {
                if (_.isFunction(transformer)) {
                    try {
                        return setSync(
                            await Promise.resolve(transformer(value)),
                        )
                    } catch (err) {
                        errorHandler?.(err)
                    }
                }
                return setSync(value)
            },
            error: errorHandler,
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [...dependencies, ...(_.isFunction(input) ? [] : [input])])

    return sync
}
