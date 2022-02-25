import { useEffect } from 'react'
import { useLazyRef } from './lazy-ref'

// this hook is to prevent HMR to run effects that have no dependencies more than once to ease development.
export function useOnce(cb: () => (() => void) | void): void {
    const isDone = useLazyRef(() => false)
    useEffect(() => {
        let cleanup: (() => void) | void
        if (!isDone.current && typeof window !== 'undefined') {
            isDone.current = true
            cleanup = cb()
        }
        return cleanup
    }, [])
}
