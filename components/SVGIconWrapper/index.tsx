import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import styles from './styles.module.css'

export type SVGIconProps = {
    className?: ClassName
    Icon: any
}

export default function SVGIcon({
    className,
    Icon,
}: SVGIconProps): React.ReactElement | null {
    return (
        <div className={cn('flex items-center mx-2', className)}>
            <Icon className={styles.fillSVG} />
        </div>
    )
}
