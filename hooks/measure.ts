import _ from 'lodash'
import { useState, useRef, useEffect, MutableRefObject } from 'react'

export type Bounds = {
    left: number
    top: number
    height: number
    width: number
}

export function useMeasure<T extends HTMLElement>(): [
    ref: MutableRefObject<T | null>,
    bounds: Bounds,
] {
    const ref = useRef<T>(null)
    const [bounds, set] = useState<Bounds>({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    })
    const [resizeObserver, setResizeObserver] = useState<ResizeObserver>()
    useEffect(() => {
        if (_.isUndefined(resizeObserver)) {
            setResizeObserver(
                new ResizeObserver(([entry]) => {
                    if (entry) {
                        set(entry.contentRect)
                    }
                }),
            )
            return
        } else {
            if (ref.current) {
                resizeObserver.observe(ref.current)
            } else {
                set({ left: 0, top: 0, width: 0, height: 0 })
            }
            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [resizeObserver, ref.current]) //eslint-disable-line react-hooks/exhaustive-deps
    return [ref, bounds]
}
