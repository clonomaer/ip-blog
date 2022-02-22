import { useEffect, useState } from 'react'

export function useMedia(mediaQuery: string): boolean | undefined {
    const [matches, setMatches] = useState<boolean>()
    useEffect(() => {
        const queryObject = window.matchMedia(mediaQuery)
        function listener(e: MediaQueryListEvent | MediaQueryList) {
            setMatches(e.matches)
        }
        listener(queryObject)
        queryObject.addEventListener('change', listener)
        return () => {
            queryObject.removeEventListener('change', listener)
        }
    }, [mediaQuery])
    return matches
}
