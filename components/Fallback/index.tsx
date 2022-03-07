import React, { ReactNode } from 'react'
import cn from 'classnames'
import { useObservable } from 'hooks/observable'
import { __$ } from 'locales'

export type FallbackProps = { message?: ReactNode }

export default function Fallback({
    message,
}: FallbackProps): React.ReactElement | null {
    const __ = useObservable(__$, { ignoreErrors: true })
    return (
        <div>
            {message ??
                __?.main.genericErrorMessage ??
                `E0xFF something went wrong`}
        </div>
    )
}
