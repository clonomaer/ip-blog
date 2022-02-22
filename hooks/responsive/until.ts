import { Screens } from 'types'
import { useComputedExclusiveDimension } from './calc-exclusive-dimension'
import { useMedia } from './media'

export function useUntil(width: Screens): boolean | undefined {
    const computedExclusive = useComputedExclusiveDimension(width)
    return useMedia(`screen and (max-width: ${computedExclusive})`)
}
