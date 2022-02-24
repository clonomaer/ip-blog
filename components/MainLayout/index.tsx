import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import Fade from 'components/Fade'
import { useObservable } from 'hooks/observable'
import { isPageLoading$ } from 'observables/is-page-loading'

export default function MainLayout({
    children,
}: PropsWithChildren<unknown>): React.ReactElement | null {
    const isLoading = useObservable(isPageLoading$, { ignoreErrors: true })
    return (
        <Fade
            visible={!isLoading}
            animationOptions={{
                enter: { filter: 'blur(0px)', opacity: 1 },
                leave: { filter: 'blur(0px)', opacity: 1 },
                from: { filter: 'blur(100px)', opacity: 1 },
                config: { duration: 500 },
            }}
            id="MainLayout"
            className={cn(
                'scrollbar-hide',
                // 'px-[max(calc((100vw-75rem)/2),0.5rem)]',
                'min-h-[var(--h-screen)]',
                isLoading && 'h-[var(--h-screen)]',
                'flex',
                'justify-center',
                'items-center',
                'overflow-hidden',
                'children:max-w-full',
                'children:max-h-full',
            )}>
            {children}
        </Fade>
    )
}
