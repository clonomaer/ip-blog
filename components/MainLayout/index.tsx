import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { usePageLoadingStatus } from 'hooks/page-loading-status'
import Fade from 'components/Fade'

export default function MainLayout({
    children,
}: PropsWithChildren<unknown>): React.ReactElement | null {
    const [isLoading] = usePageLoadingStatus()
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
                'bg-page-bg',
                'text-gray-100',
            )}>
            {children}
        </Fade>
    )
}
