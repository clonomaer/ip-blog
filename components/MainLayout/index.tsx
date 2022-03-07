import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import Fade from 'components/Fade'
import { useObservable } from 'hooks/observable'
import { isPageLoading$ } from 'observables/is-page-loading'
import MainTopBar from 'components/MainTopBar'
import BlurOnPortalOpen from 'components/BlurOnPortalOpen'

export default function MainLayout({
    children,
}: PropsWithChildren<unknown>): React.ReactElement | null {
    const isLoading = useObservable(isPageLoading$, {
        ignoreErrors: true,
        initialValue: true,
        errorTransformer: true,
    })
    return (
        <Fade
            visible={!isLoading}
            animationOptions={{
                enter: { filter: 'blur(0px)', opacity: 1 },
                leave: { filter: 'blur(100px)', opacity: 1 },
                from: { filter: 'blur(100px)', opacity: 1 },
                config: { duration: 500 },
                expires: false,
            }}
            id="MainLayout"
            className={cn(
                'scrollbar-hide',
                'min-h-[var(--h-screen)]',
                isLoading && 'h-[var(--h-screen)]',
                'flex',
                'overflow-hidden',
                'justify-center',
                'w-screen px-[max(calc((100vw-theme(screens.2xl))/2),1rem)]',
            )}
            classNames={{
                wrapper: 'flex-grow h-full w-full children:max-w-full',
            }}>
            <BlurOnPortalOpen>
                <MainTopBar className="h-top-bar" />
                <div
                    className={cn(
                        'h-full',
                        'flex',
                        'justify-center',
                        'items-center',
                        'children:max-w-full',
                        'children:max-h-full',
                        'min-h-main-content',
                    )}>
                    {children}
                </div>
            </BlurOnPortalOpen>
        </Fade>
    )
}
