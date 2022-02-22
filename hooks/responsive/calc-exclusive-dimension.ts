import { config } from 'configs'
import { useEffect, useState } from 'react'
import { Screens } from 'types'
import { PxPerRem, RemToPx } from './conversion'

function calcExclusive(dimension: string): string {
    if (dimension.endsWith('px')) {
        return `${parseFloat(dimension) - 1}px`
    }
    if (dimension.endsWith('rem')) {
        return `${(RemToPx(dimension) - 1) / PxPerRem()}rem`
    }
    throw new Error(
        'only px and rem units are supported for media queries for now',
    )
}

export function useComputedExclusiveDimension(screen: Screens): string {
    const [computedExclusive, setComputedExclusive] = useState<string>(() =>
        calcExclusive(config.Screens[screen]),
    )
    useEffect(() => {
        function listener() {
            setComputedExclusive(calcExclusive(config.Screens[screen]))
        }
        window.addEventListener('resize', listener)
        return () => {
            window.removeEventListener('resize', listener)
        }
    }, [screen, config])
    return computedExclusive
}
