import _ from 'lodash'
import { DependencyList, useEffect } from 'react'
import { Observable, Observer } from 'rxjs'
import { LazyEval } from 'types'
import { unLazy } from 'utils/un-lazy'

export function useSubscribe<T>(
    observable: LazyEval<Observable<T> | null | undefined>,
    observer?: Partial<Observer<T>>,
    dependencies?: DependencyList,
): void
export function useSubscribe<T>(
    observable: LazyEval<Observable<T> | null | undefined>,
    observer?: (value: T) => void,
    dependencies?: DependencyList,
): void

export function useSubscribe<T>(
    observable: LazyEval<Observable<T> | null | undefined>,
    observer?: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    dependencies?: DependencyList,
): void {
    useEffect(() => {
        const subscription = unLazy(observable)?.subscribe(observer)
        return () => {
            subscription?.unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...(_.isFunction(observable) ? [] : [observable]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...(dependencies ?? []),
    ])
}
