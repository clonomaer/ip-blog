import React from 'react'
import type { NextPage } from 'next'
import _ from 'lodash'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { useRouter } from 'next/router'

const Home: NextPage = ({}) => {
    const __ = useLocale()
    const router = useRouter()

    return (
        <div className="flex w-screen justify-center overflow-auto">
            {__ && (
                <Button
                    job={() => {
                        router.push('/new')
                    }}>
                    new post
                </Button>
            )}
        </div>
    )
}

export default Home
