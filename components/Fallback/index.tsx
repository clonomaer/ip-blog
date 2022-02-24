import React, { ReactNode } from 'react'
import cn from 'classnames'
import { useLocale } from 'hooks/locale'

export type FallbackProps = { message?: ReactNode }

export default function Fallback({
    message,
}: FallbackProps): React.ReactElement | null {
    const __ = useLocale()
    return (
        <div>
            {message ??
                __?.main.genericErrorMessage ??
                `E0xFF something went wrong`}
        </div>
    )
}
