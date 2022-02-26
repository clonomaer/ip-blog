import React from 'react'
import type { NextPage } from 'next'
import _ from 'lodash'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import { useObservable } from 'hooks/observable'
import { ipfs$ } from 'contexts/ipfs'

const Home: NextPage = ({}) => {
    const __ = useLocale()
    const router = useRouter()
    const ipfs = useObservable(ipfs$)

    return (
        <div className="flex flex-col justify-center items-center overflow-auto">
            <div className="flex flex-col w-56">
            <Button
                job={() => {
                    router.push('/new')
                }}>
                {__?.landing.newPost}
            </Button>
            </div>
        </div>
    )
}

export default Home
