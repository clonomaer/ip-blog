import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import Head from 'next/head'
import LoadingOverlay from 'components/LoadingOverlay'
import { useMobileVHFix } from 'hooks/mobile-vh-fix'
import { useMobileHoverFix } from 'hooks/mobile-hover-fix'
import MainLayout from 'components/MainLayout'
import { usePageLoadingStatus } from 'hooks/page-loading-status'
import { waitFor } from 'helpers/wait-for'
import { useRouteLoadingStatus } from 'hooks/route-loading-status'
import FlashToast from 'components/FlashToast'
import BlurOnPortalOpen from 'components/BlurOnPortalOpen'

function SafeHydrate({ children }: PropsWithChildren<unknown>) {
    const [isClient, setIsClient] = useState<boolean>(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' || !isClient ? null : children}
        </div>
    )
}

function MyApp({ Component, pageProps }: AppProps) {
    useMobileVHFix()
    useMobileHoverFix()
    const [isLoading, addLoadingJob] = usePageLoadingStatus()
    useRouteLoadingStatus()

    useEffect(() => {
        addLoadingJob(waitFor(1000), 'min delay')
    }, [])
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
