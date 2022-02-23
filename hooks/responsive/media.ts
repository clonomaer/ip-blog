import { fromEvent, map, merge, Observable, of } from 'rxjs'
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

export function observeMediaQuery(mediaQuery: string): Observable<boolean> {
    const queryObject = window.matchMedia(mediaQuery)
    return merge(
        of(queryObject),
        fromEvent<MediaQueryListEvent>(queryObject, 'change'),
    ).pipe(map(e => e.matches))
}
