import { useEffect, useMemo, useRef, useState } from 'react'
import config from './config'
import { ScrollableNodeProps } from './type'

export function useHasScrolled<T extends HTMLElement>(
    threshold: number = config.defaultThreshold,
): [hasScrolled: boolean | null, scrollableNodeProps: ScrollableNodeProps<T>] {
    const ref = useRef<T>(null)
    const [scrolled, setScrolled] = useState<boolean | null>(null)
    useEffect(() => {
        if (ref.current) {
            if (ref.current.scrollHeight > ref.current.clientHeight) {
                setScrolled(false)
            }
        }
    }, [])
    const onScroll = useMemo(
        () => () => {
            if (ref.current) {
                if (ref.current.scrollHeight > ref.current.clientHeight) {
                    setScrolled(ref.current.scrollTop > threshold)
                } else {
                    setScrolled(null)
                }
            }
        },
        [setScrolled],
    )
    return [scrolled, { ref, onScroll }]
}
