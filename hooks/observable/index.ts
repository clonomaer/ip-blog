import { ObservableError } from 'classes/observable-error'
import { SENTINEL, Sentinel } from 'contexts/empty-sentinel'
import _ from 'lodash'
import React, { DependencyList, useEffect, useState } from 'react'
import { BehaviorSubject, Observable } from 'rxjs'
import { LazyEval } from 'types'
import { unLazy } from 'utils/un-lazy'
import Fallback from 'components/Fallback'

type Options<R> = {
    dependencies?: DependencyList
    errorTransformer?: ((err: ObservableError) => R) | R
}

export function useObservable<T, R = T>(
    observable: BehaviorSubject<T> | LazyEval<BehaviorSubject<T>>,
    options?: Options<R> & { ignoreErrors?: false },
): R | T | ObservableError
export function useObservable<T, R = T>(
    observable: BehaviorSubject<T> | LazyEval<BehaviorSubject<T>>,
    options?: Options<R> & { ignoreErrors: true },
): R | T

export function useObservable<T, R = T>(
    observable: Observable<T> | LazyEval<Observable<T>>,
    options?: Options<R> & { ignoreErrors?: false },
): R | T | undefined | ObservableError
export function useObservable<T, R = T>(
    observable: Observable<T> | LazyEval<Observable<T>>,
    options?: Options<R> & { ignoreErrors: true },
): R | T | undefined

export function useObservable<T, R = T>(
    observable:
        | null
        | Observable<T>
        | BehaviorSubject<T>
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>,
    options?: Options<R> & { ignoreErrors?: false },
): R | undefined | T | ObservableError
export function useObservable<T, R = T>(
    observable:
        | null
        | Observable<T>
        | BehaviorSubject<T>
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>,
    options?: Options<R> & { ignoreErrors: true },
): R | undefined | T

export function useObservable<T, R = T>(
    observable:
        | Observable<T>
        | BehaviorSubject<T>
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>
        | null,
    options?: Options<R> & { initialValue: T } & { ignoreErrors?: false },
): R | T | ObservableError
export function useObservable<T, R = T>(
    observable:
        | Observable<T>
        | BehaviorSubject<T>
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>
        | null,
    options?: Options<R> & { initialValue: T } & { ignoreErrors: true },
): R | T

export function useObservable<T, R = T>(
    observable:
        | Observable<T>
        | BehaviorSubject<T>
        | null
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>,
    {
        initialValue = SENTINEL,
        dependencies = [],
        ignoreErrors,
        errorTransformer,
    }: Options<R> & {
        initialValue?: T | Sentinel
        ignoreErrors?: boolean
    } = {
        initialValue: SENTINEL,
        dependencies: [],
        ignoreErrors: false,
        errorTransformer: _.identity,
    },
): R | T | ObservableError | undefined {
    const [state, setState] = useState<R | T | undefined | ObservableError>(
        () => {
            if (initialValue !== SENTINEL) {
                return initialValue
            }
            if (_.isNil(observable)) {
                return undefined
            }
            const _observable = unLazy(observable)
            if (!_.isNil(_observable) && 'getValue' in _observable) {
                return _observable.getValue()
            }
            return undefined
        },
    )

    useEffect(() => {
        const subscription = unLazy(observable)?.subscribe({
            next: x => {
                if (_.isObjectLike(x)) {
                    try {
                        return setState(_.cloneDeep(x))
                    } catch {
                        // ignore
                    }
                }
                return setState(x)
            },
            error: e => {
                if (ignoreErrors) {
                    setState(undefined)
                }
                const error = (
                    _.isFunction(errorTransformer)
                        ? errorTransformer
                        : () => errorTransformer
                )(e instanceof ObservableError ? e : new ObservableError(e))
                const fallbackRender = () =>
                    React.createElement(Fallback, {
                        key: `fallback-content-${('message' in e
                            ? String(e.message)
                            : String(e)
                        ).replace(/ +/g, '-')}`,
                        message: 'message' in e ? String(e.message) : String(e),
                    })
                _.assign(fallbackRender, error)
                //@ts-ignore
                setState(fallbackRender)
            },
        })
        return () => {
            subscription?.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(_.isFunction(observable) ? [] : [observable]), ...dependencies])
    return state
}
