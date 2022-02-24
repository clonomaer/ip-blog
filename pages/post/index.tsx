import React, { useMemo, useState } from 'react'
import type { NextPage } from 'next'
import cn from 'classnames'
import { ClassName } from 'types'
import _ from 'lodash'
import { useRouter } from 'next/dist/client/router'
import { catchError, EMPTY, scan } from 'rxjs'
import { InvalidCIDError, ipfsTextFile$ } from 'providers/ipfs-file'

import { useObservable } from 'hooks/observable'
import WrappedEditor from 'components/WrappedEditor'
import Fallback from 'components/Fallback'
import { useLazyRef } from 'hooks/lazy-ref'
import { useOnce } from 'hooks/once'
import { pageLoadingJobs$ } from 'contexts/loading-jobs'
import { useLocale } from 'hooks/locale'

export type PostViewPageProps = {}

const PostViewPage: NextPage<PostViewPageProps> = ({}) => {
    const __ = useLocale()
    const router = useRouter()
    const postId = useMemo(() => _.castArray(router.query.postId)[0], [router])
    const fileControl = useLazyRef(() => ipfsTextFile$(postId))
    const content = useObservable(() =>
        fileControl.current[0].pipe(scan((acc, curr) => acc + curr, '')),
    )

    useOnce(() => {
        pageLoadingJobs$.next(
            fileControl.current[0].pipe(catchError(() => EMPTY)), // not a fatal error
        )
    })

    return (
        <div className="py-10">
            {content instanceof Error ? (
                <Fallback
                    message={
                        content instanceof InvalidCIDError
                            ? __?.viewPost.invalidCidError
                            : null
                    }
                />
            ) : (
                <WrappedEditor
                    className="border-0"
                    readOnly
                    value={content ?? ''}
                />
            )}
        </div>
    )
}

export default PostViewPage
