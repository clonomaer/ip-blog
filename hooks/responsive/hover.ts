import { useMedia } from './media'

export const canHoverMediaQuery = '(hover: hover) and (pointer: fine)'

export function useHover(): boolean | undefined {
    return useMedia(canHoverMediaQuery)
}
