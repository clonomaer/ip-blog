import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useTimeouts } from '../timeouts'
import { LazyEval } from '../../types'

export function useDelay<T>(state: T, delay: LazyEval<number>): T

export function useDelay<T, Initial = T>(
    state: T,
    delay: LazyEval<number>,
    initialValue: Initial,
): Initial | T

export function useDelay<T, Initial = T, R = T>(
    state: T,
    delay: LazyEval<number>,
    initialValue: Initial,
    transformer: (arg: T) => R,
): R | Initial

export function useDelay(
    state: any,
    delay: LazyEval<number>,
    initialValue?: any,
    transformer: Function = _.identity,
) {
    const [delayed, setDelayed] = useState(initialValue)
    const addTimeout = useTimeouts()
    useEffect(() => {
        if (delay === 0) {
            requestAnimationFrame(() => {
                setDelayed(transformer(state))
            })
        } else if (delay === 1) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setDelayed(transformer(state))
                })
            })
        } else {
            addTimeout(
                () => {
                    setDelayed(transformer(state))
                },
                _.isFunction(delay) ? delay() : delay,
            )
        }
    }, [state])
    return delayed
}
