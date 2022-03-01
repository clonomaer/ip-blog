import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { isPortalOpen$ } from 'contexts/is-portal-open'
import { useObservable } from 'hooks/observable'
import { truthy } from 'helpers/truthy'
import { animated, useSpring } from 'react-spring'
import { canHoverMediaQuery, observeMediaQuery } from 'hooks/responsive'
import { combineLatest, map, scan } from 'rxjs'

export type BlurOnPortalOpenProps = PropsWithChildren<{
    className?: ClassName
}>

export default function BlurOnPortalOpen({
    className,
    children,
}: BlurOnPortalOpenProps): React.ReactElement | null {
    const shouldBlur = useObservable(() =>
        isPortalOpen$.pipe(
            scan((acc, curr) => (curr ? acc + 1 : acc - 1), 1),
            map(x => x !== 0),
        ),
    )
    const styles = useSpring({
        from: {
            filter: `blur(${truthy(shouldBlur, false) ? 0 : 10}px)`,
        },
        to: {
            filter: `blur(${truthy(shouldBlur, false) ? 10 : 0}px)`,
        },
        config: { duration: 500 },
    })
    return (
        <animated.div className={cn(className)} style={styles}>
            {children}
        </animated.div>
    )
}
