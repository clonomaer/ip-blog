import React, { PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = PropsWithChildren<Record<string, unknown>>

export default function Portal({
    children,
}: PortalProps): React.ReactElement | null {
    const [root, setRoot] = useState<HTMLElement | null>(null)

    useEffect(() => {
        setRoot(document.getElementById('portal_root'))
        return () => setRoot(null)
    }, [])

    return root ? createPortal(children, root) : null
}
