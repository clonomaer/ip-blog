import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { portalStatus$ } from 'contexts/portal-status'
import { useObservable } from 'hooks/observable'
import { truthy } from 'helpers/truthy'
import { animated, useSpring } from 'react-spring'

export type BlurOnPortalOpenProps = PropsWithChildren<{
    className?: ClassName
}>

export default function BlurOnPortalOpen({
    className,
    children,
}: BlurOnPortalOpenProps): React.ReactElement | null {
    const isPortalOpen = useObservable(portalStatus$)
    console.log(`isPortalOpen ${isPortalOpen}`)
    const styles = useSpring({
        from: {
            filter: truthy(isPortalOpen, false) ? 'blur(0px)' : 'blur(10px)',
        },
        to: {
            filter: truthy(isPortalOpen, false) ? 'blur(10px)' : 'blur(0px)',
        },
        config: { duration: 500 },
    })
    return (
        <animated.div className={cn(className)} style={styles}>
            {children}
        </animated.div>
    )
}
