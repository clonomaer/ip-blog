import React from 'react'
import type { NextPage } from 'next'
import _ from 'lodash'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import { usePageLoadingStatus } from 'hooks/page-loading-status'
import { waitFor } from 'helpers/wait-for'

const Home: NextPage = ({}) => {
    const __ = useLocale()
    const [, addLoadingJob] = usePageLoadingStatus()
    const router = useRouter()

    return (
        <div className="flex w-screen justify-center overflow-auto">
            {__ && (
                <Button
                    job={() => {
                        router.push('/new')
                        addLoadingJob(waitFor(100))
                    }}>
                    new post
                </Button>
            )}
        </div>
    )
}

export default Home
