import { useMemo } from 'react'
import { useDelay } from '../delay'
import { isNodeMeasurable } from './is-node-measurable'

export function useFade(
    visible: boolean,
    animationDuration: number,
    delay: number | null = 0,
): {
    renderCondition: boolean
    fadeOutCondition: boolean
    isMeasurable: boolean
    animationDelayedVisibility: boolean
    measurementSuitableVisibility: boolean
} {
    const originalDelayVisibility = useDelay(visible, delay ?? 0, false)
    const measurementSuitableVisibility = useDelay(
        originalDelayVisibility,
        0,
        false,
    )
    const animationDelayedVisibility = useDelay(
        delay === null ? visible : measurementSuitableVisibility,
        animationDuration,
        false,
    )
    const fadeOutCondition = useDelay(
        delay === null ? visible : measurementSuitableVisibility,
        0,
        false,
        e => !e,
    )

    const renderCondition = useMemo(() => {
        return (
            (delay === null ? visible : measurementSuitableVisibility) ||
            animationDelayedVisibility
        )
    }, [
        visible,
        measurementSuitableVisibility,
        animationDelayedVisibility,
        delay,
    ])

    const isMeasurable = useMemo(
        () => isNodeMeasurable(renderCondition, fadeOutCondition),
        [renderCondition, fadeOutCondition],
    )

    return {
        renderCondition,
        fadeOutCondition,
        isMeasurable,
        animationDelayedVisibility,
        measurementSuitableVisibility,
    }
}
