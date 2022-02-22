import { config } from 'configs'
import { Screens } from 'types'
import { useMedia } from './media'

export function useFrom(width: Screens): boolean | undefined {
    return useMedia(`screen and (min-width: ${config.Screens[width]})`)
}
