import React, {
    CSSProperties,
    ForwardedRef,
    forwardRef,
    HTMLProps,
    PropsWithoutRef,
} from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import {
    animated,
    PickAnimated,
    SpringValue,
    useSpring,
    useTransition,
    UseTransitionProps,
} from 'react-spring'
import { useMeasure } from 'hooks/measure'
import { Valid } from '@react-spring/core/dist/declarations/src/types/common'
import _ from 'lodash'

export type FadeMode = 'opacity' | 'height' | 'width'

export type ExtraAnimationOptions<ExtraAnimationProps> =
    | UseTransitionProps<boolean>
    | (ExtraAnimationProps &
          Valid<ExtraAnimationProps, UseTransitionProps<boolean>>)

export type FadeProps<
    ExtraAnimationProps extends CSSProperties = CSSProperties,
> = PropsWithoutRef<HTMLProps<HTMLDivElement>> & {
    className?: ClassName
    classNames?: { wrapper?: ClassName }
    visible: boolean
    mode?: FadeMode
    skipInitialTransition?: boolean
    animationOptions?: ExtraAnimationOptions<ExtraAnimationProps>
    animationOptionsTransformer?: (styles: {
        [prop in keyof CSSProperties]: SpringValue
    }) => PickAnimated<CSSProperties>
}

function InnerFade<ExtraAnimationProps>(
    {
        className,
        classNames,
        visible,
        mode = 'opacity',
        children,
        skipInitialTransition,
        animationOptions,
        animationOptionsTransformer = _.identity,
        ...props
    }: FadeProps<ExtraAnimationProps>,
    ref: ForwardedRef<HTMLDivElement>,
): React.ReactElement | null {
    const [measure, { height, width }] = useMeasure<HTMLDivElement>()
    const transitions = useTransition<
        boolean,
        { opacity: number } & ExtraAnimationProps
    >(
        visible,
        _.merge(
            {
                from: { opacity: skipInitialTransition ? 1 : 0 },
                enter: { opacity: 1 },
                leave: { opacity: 0 },
                reverse: visible,
            },
            animationOptions ?? {},
        ) as ExtraAnimationOptions<ExtraAnimationProps>,
    )
    const dimensions = useSpring({
        ...(mode === 'height' ? { height: visible ? height : 0 } : {}),
        ...(mode === 'width' ? { width: visible ? width : 0 } : {}),
        ...(['height', 'width'].includes(mode)
            ? { margin: visible ? '' : 0 }
            : {}),
    })
    return (
        <>
            {transitions(
                (styles, item) =>
                    item && (
                        <animated.div
                            style={{
                                ...dimensions,
                                transitionProperty: 'margin',
                            }}
                            className={cn(
                                'overflow-hidden',
                                'transition-all',
                                className,
                            )}
                            ref={ref}
                            {...props}>
                            <animated.div
                                style={animationOptionsTransformer(styles)}
                                ref={measure}
                                className={cn(classNames?.wrapper)}>
                                {children}
                            </animated.div>
                        </animated.div>
                    ),
            )}
        </>
    )
}

const Fade = forwardRef(InnerFade)
export default Fade
