import { __ } from 'locales'
import { WebsiteLocale } from 'locales/interface'
import { useEffect } from 'react'
import { useAsync } from './async'
import { useGetIsFirstRender } from './is-first-render'
import { usePageLoadingStatus } from './page-loading-status'

export function useLocale(): WebsiteLocale | undefined {
    const locale = useAsync(__())
    const [_, addLoadingJob] = usePageLoadingStatus()
    const getIsFirstRender = useGetIsFirstRender()
    useEffect(() => {
        if (getIsFirstRender()) {
            addLoadingJob(__())
        }
    }, [])
    return locale
}
