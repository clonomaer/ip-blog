import { useReducer } from 'react'
import { Observable } from 'rxjs'
import { useSubscribe } from './subscribe'

export type HistoryReducerAction<T> = {
    type: 'push'
    payload: T
}

type HistoryReducer<T> = (
    prevState: T[],
    action: HistoryReducerAction<T>,
) => T[]

function historyReducerFactory<T>(
    stackSize: number | undefined,
): HistoryReducer<T> {
    return function (prevState, action) {
        switch (action.type) {
            case 'push':
                if (stackSize !== undefined && prevState.length >= stackSize) {
                    prevState.shift()
                }
                return prevState.concat(action.payload)
        }
    }
}

export function useHistoricalObserve<T>(
    observable: Observable<T>,
    {
        preAddCallback,
        stackSize = undefined,
    }: { preAddCallback?: (value: T) => void; stackSize?: number | undefined },
): T[] {
    const [history, dispatch] = useReducer<HistoryReducer<T>>(
        historyReducerFactory(stackSize),
        [],
    )
    useSubscribe(observable, value => {
        preAddCallback?.(value)
        dispatch({ type: 'push', payload: value })
    })
    return history
}
