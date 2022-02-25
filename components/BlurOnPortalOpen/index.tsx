import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { shouldBlurBehindPortal$ } from 'contexts/should-blur-behind-portal'
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
    const shouldBlur = useObservable(shouldBlurBehindPortal$)
    const styles = useSpring({
        from: {
            filter: truthy(shouldBlur, false) ? 'blur(0px)' : 'blur(10px)',
        },
        to: {
            filter: truthy(shouldBlur, false) ? 'blur(10px)' : 'blur(0px)',
        },
        config: { duration: 500 },
    })
    return (
        <animated.div className={cn(className)} style={styles}>
            {children}
        </animated.div>
    )
}
