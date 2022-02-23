import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React, { PropsWithChildren, useEffect } from 'react'
import Head from 'next/head'
import LoadingOverlay from 'components/LoadingOverlay'
import { useMobileVHFix } from 'hooks/mobile-vh-fix'
import { useMobileHoverFix } from 'hooks/mobile-hover-fix'
import MainLayout from 'components/MainLayout'
import { usePageLoadingStatus } from 'hooks/page-loading-status'
import { waitFor } from 'helpers/wait-for'
import { useRouteLoadingStatus } from 'hooks/route-loading-status'
import FlashToast from 'components/FlashToast'

function SafeHydrate({ children }: PropsWithChildren<unknown>) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

function MyApp({ Component, pageProps }: AppProps) {
    useMobileVHFix()
    useMobileHoverFix()
    const [isLoading, addLoadingJob] = usePageLoadingStatus()
    useRouteLoadingStatus()

    useEffect(() => {
        addLoadingJob(waitFor(1000))
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
            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </SafeHydrate>
    )
}
export default MyApp
