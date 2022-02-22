import { useMedia } from './media'

export function useHover(): boolean | undefined {
    return useMedia('(hover: hover) and (pointer: fine)')
}
