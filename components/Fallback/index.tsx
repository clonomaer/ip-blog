import React from 'react'
import cn from 'classnames'

export type FallbackProps = {}

export default function Fallback({}: FallbackProps): React.ReactElement | null {
    return <div>something went wrong</div>
}
