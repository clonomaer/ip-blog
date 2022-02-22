import { MutableRefObject, useEffect, useState } from 'react'

export function useWebkitAutofillState(
    ref: MutableRefObject<HTMLInputElement | null>,
): boolean {
    const [isAutoFilled, setIsAutoFilled] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            try {
                if (ref.current?.matches(':-internal-autofill-selected')) {
                    setIsAutoFilled(true)
                }
            } catch {
                return
            }
        }, 500)
    }, [ref, ref.current]) //eslint-disable-line react-hooks/exhaustive-deps
    return isAutoFilled
}
