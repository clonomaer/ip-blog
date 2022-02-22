import { useRef, useEffect, useState, RefObject, useMemo } from 'react'
import { throttle } from 'lodash'

/**
 * Check if an element is in viewport

 * @param {number} offset - Number of pixels up to the observable element from the top
 * @param {number} throttleMilliseconds - Throttle observable listener, in ms
 */
export default function useVisibility<Element extends HTMLElement>(
    offset = 0,
    throttleMilliseconds = 100,
): [isVisible: boolean, ref: RefObject<Element>] {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<Element>(null)

    const onScroll = useMemo(
        () =>
            throttle(() => {
                if (!ref.current) {
                    setIsVisible(false)
                    return
                }
                const top = ref.current.getBoundingClientRect().top
                setIsVisible(
                    top + offset >= 0 && top - offset <= window.innerHeight,
                )
            }, throttleMilliseconds),
        [offset, throttleMilliseconds],
    )

    useEffect(() => {
        onScroll()
        document.addEventListener('scroll', onScroll, true)
        return () => document.removeEventListener('scroll', onScroll, true)
    })

    return [isVisible, ref]
}
