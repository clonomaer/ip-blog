import { config } from 'configs'
import { Screens } from 'types'
import { useComputedExclusiveDimension } from './calc-exclusive-dimension'
import { useMedia } from './media'

export function useBetween(min: Screens, max: Screens): boolean | undefined {
    const computedExclusive = useComputedExclusiveDimension(max)
    return useMedia(
        `screen and (min-width: ${config.Screens[min]}) and (max-width: ${computedExclusive})`,
    )
}
