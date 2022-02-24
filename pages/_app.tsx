import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import Head from 'next/head'
import LoadingOverlay from 'components/LoadingOverlay'
import { useMobileVHFix } from 'hooks/mobile-vh-fix'
import { useMobileHoverFix } from 'hooks/mobile-hover-fix'
import MainLayout from 'components/MainLayout'
import { useRouteLoadingStatus } from 'hooks/route-loading-status'
import FlashToast from 'components/FlashToast'
import BlurOnPortalOpen from 'components/BlurOnPortalOpen'
import { useOnce } from 'hooks/once'
import { useObservable } from 'hooks/observable'
import { isPageLoading$ } from 'observables/is-page-loading'
import { useHandlePageLoadingFailure } from 'hooks/handle-loading-failure'

function SafeHydrate({ children }: PropsWithChildren<unknown>) {
    const [isClient, setIsClient] = useState<boolean>(false)
    useOnce(() => {
        setIsClient(true)
    })
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' || !isClient ? null : children}
        </div>
    )
}

function MyApp({ Component, pageProps }: AppProps) {
    useMobileVHFix()
    useMobileHoverFix()
    const isLoading = useObservable(isPageLoading$, { ignoreErrors: true })
    useHandlePageLoadingFailure()
    useRouteLoadingStatus()

    return (
        <SafeHydrate>
            <Head>{/*  */}</Head>
            <FlashToast />
            <LoadingOverlay
                spinnerProps={{ big: true }}
                visible={isLoading ?? true}
                skipInitialTransition
                className={'!z-50 bg-page-bg'}
            />
            <BlurOnPortalOpen>
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            </BlurOnPortalOpen>
        </SafeHydrate>
    )
}
export default MyApp
