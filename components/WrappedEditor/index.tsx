import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import styles from './styles.module.css'
import Editor, { Props as EditorProps } from 'rich-markdown-editor'
import { fromEvent, throttleTime } from 'rxjs'
import { useSubscribe } from 'hooks/subscribe'
import { useMeasure } from 'hooks/measure'
import { useUntil } from 'hooks/responsive'

export type WrappedEditorProps = {
    className?: ClassName
} & Partial<EditorProps>

export default function WrappedEditor({
    className,
    readOnly,
    ...props
}: WrappedEditorProps): React.ReactElement | null {
    const [shouldExpand, setShouldExpand] = useState<boolean>(false)
    const isMobile = useUntil('sm')
    console.log('isMobile', isMobile)
    const ref = useRef<Editor>()
    useSubscribe(
        () =>
            fromEvent(window, 'scroll').pipe(
                throttleTime(100, undefined, { trailing: true, leading: true }),
            ),
        () => {
            const { scrollTop, clientHeight: viewPortHeight } =
                document.documentElement
            let { clientHeight: eHeight } = ref.current?.element ?? {}
            const eY = ref.current?.element?.getBoundingClientRect().y ?? 0
            const eBottom =
                ref.current?.element?.getBoundingClientRect().bottom ?? 0
            eHeight = eHeight ?? 0
            const threshold = viewPortHeight / 3
            setShouldExpand(
                (readOnly ?? false) &&
                    (isMobile ?? false) &&
                    eHeight - 2 * threshold > 2 * viewPortHeight && // is worth doing the transition
                    Math.abs(eY) > threshold && // lower than the top threshold
                    eBottom > viewPortHeight + threshold && // higher than the bottom threshold
                    scrollTop > 0, // obvious but it fixes a bug with eY being reported wrong
            )
        },
        [isMobile],
    )
    return (
        <Editor
            dark
            className={cn(
                'h-full',
                'w-full',
                'flex-grow',
                'rounded-2xl',
                'revert-tailwind-preflight',
                'transition-all duration-1000',
                'pl-4 pr-3 md:px-7 py-5 ',
                'border',
                styles.shouldExpand,
                shouldExpand
                    ? cn(
                          'bg-page-bg shadow-none border-transparent',
                          styles.expanded,
                      )
                    : 'shadow-strong bg-opacity-10 bg-indigo-800 border-primary-dark',
                styles.container,
                className,
            )}
            readOnly={readOnly ?? false}
            ref={_ref => (ref.current = _ref ?? undefined)}
            {...props}
        />
    )
}
