import { useEffect, useRef } from 'react'

export function useGetIsFirstRender() {
    const isFirstRender = useRef(true)
    useEffect(() => {
        isFirstRender.current = false
    }, [])
    return () => isFirstRender.current
}
