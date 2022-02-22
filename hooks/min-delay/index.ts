import _ from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useImmediateState } from '../immediate-state'
import { useTimeouts } from '../timeouts'
import { PredicateEval } from '../../types'
import { config } from 'configs'

type options<T> = {
    isDonePredicate?: PredicateEval<T>
    minDelay?: number
    fastLeaveWindow?: number | null
    fastLeaveMinDelay?: number
}

/**@returns isMinDelayOver */
export function useMinDelay<T>(
    state: T,
    {
        isDonePredicate = _.negate(_.isNil),
        minDelay,
        fastLeaveWindow,
        fastLeaveMinDelay,
    }: options<T>,
): boolean {
    const [isOver, setIsOver] = useState(false)
    const getState = useImmediateState(state)
    const addTimeout = useTimeouts()
    const isPastDelay = useRef(false)

    const isDone = useMemo(
        () =>
            _.isFunction(isDonePredicate)
                ? isDonePredicate
                : (e: T) => e === isDonePredicate,
        [isDonePredicate],
    )

    useEffect(() => {
        addTimeout(() => {
            if (isDone(getState())) {
                setIsOver(true)
            } else {
                isPastDelay.current = true
            }
        }, minDelay ?? config.Delays.min)
        if (fastLeaveWindow !== null) {
            addTimeout(() => {
                if (isDone(getState())) {
                    addTimeout(() => {
                        setIsOver(true)
                    }, (fastLeaveMinDelay ?? config.Delays.fastLeave.minDelay) - (fastLeaveWindow ?? config.Delays.fastLeave.window))
                }
            }, fastLeaveWindow ?? config.Delays.fastLeave.window)
        }
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isDone(state) && isPastDelay.current) {
            setIsOver(true)
        }
    }, [state, isOver, isDone])

    return isOver
}
