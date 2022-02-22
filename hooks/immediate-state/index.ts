import { useEffect, useMemo, useRef } from 'react'

export function useImmediateState<T>(state: T): () => T {
    const immediate = useRef(state)
    useEffect(() => {
        immediate.current = state
    }, [state])
    const getImmediateState = useMemo(() => {
        return function getImmediateState() {
            return immediate.current
        }
    }, [])
    return getImmediateState
}
