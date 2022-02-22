import { useEffect, useState } from 'react'
import { RemToPx } from './conversion'

export function useRem(rem: number | string): number {
    const [px, setPx] = useState(() => RemToPx(rem))
    useEffect(() => {
        function listener() {
            setPx(RemToPx(rem))
        }
        listener()
        window.addEventListener('resize', listener)
        return () => {
            window.removeEventListener('resize', listener)
        }
    }, [rem])
    return px
}
