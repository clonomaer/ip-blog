import { ObservableError } from 'classes/observable-error'
import { SENTINEL, Sentinel } from 'contexts/empty-sentinel'
import _ from 'lodash'
import { DependencyList, useEffect, useState } from 'react'
import { BehaviorSubject, Observable } from 'rxjs'
import { LazyEval } from 'types'
import { unLazy } from 'utils/un-lazy'

type Options = {
    dependencies?: DependencyList
}

export function useObservable<T>(
    observable: BehaviorSubject<T> | LazyEval<BehaviorSubject<T>>,
    options?: Options,
): T | ObservableError
export function useObservable<T>(
    observable: Observable<T> | LazyEval<Observable<T>>,
    options?: Options,
): T | undefined | ObservableError
export function useObservable<T>(
    observable:
        | null
        | Observable<T>
        | BehaviorSubject<T>
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>,
    options?: Options,
): undefined | T | ObservableError
export function useObservable<T>(
    observable:
        | Observable<T>
        | BehaviorSubject<T>
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>
        | null,
    options?: Options & { initialValue: T },
): T | ObservableError

export function useObservable<T>(
    observable:
        | Observable<T>
        | BehaviorSubject<T>
        | null
        | LazyEval<BehaviorSubject<T> | Observable<T> | null | undefined>,
    {
        initialValue = SENTINEL,
        dependencies = [],
    }: Options & {
        initialValue?: T | Sentinel
    } = {
        initialValue: SENTINEL,
        dependencies: [],
    },
): T | ObservableError | undefined {
    const [state, setState] = useState<T | undefined | ObservableError>(() => {
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
    })

    useEffect(() => {
        const subscription = unLazy(observable)?.subscribe({
            next: setState,
            error: e => setState(new ObservableError(e)),
        })
        return () => {
            subscription?.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(_.isFunction(observable) ? [] : [observable]), ...dependencies])
    return state
}
