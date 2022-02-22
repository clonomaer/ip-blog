import { useEffect, useMemo, useRef } from 'react'

export function useTimeouts() {
    const timeouts = useRef<NodeJS.Timeout[]>([])

    const add = useMemo(() => {
        function addTimeout(
            callback: (...args: any[]) => void,
            ms: number,
            ...args: any[]
        ) {
            timeouts.current.push(setTimeout(callback, ms, ...args))
        }
        return addTimeout
    }, [])

    useEffect(() => {
        return () => {
            timeouts.current.forEach(clearTimeout)
        }
    }, [])

    return add
}
