import React, { useMemo, useState } from 'react'
import type { NextPage } from 'next'
import cn from 'classnames'
import { ClassName } from 'types'
import _ from 'lodash'
import { useRouter } from 'next/dist/client/router'
import { catchError, EMPTY, map, mergeMap, of, reduce, scan } from 'rxjs'
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
    const fileControl = useLazyRef(() =>
        ipfsTextFile$(_.castArray(router.query.postId)[0]),
    )
    const content = useObservable(() =>
        fileControl.current[0].pipe(
            mergeMap(({ content$ }) => content$),
            scan((acc, curr) => acc.concat(curr), ''),
        ),
    )
    const meta = useObservable(() =>
        fileControl.current[0].pipe(mergeMap(({ meta$ }) => meta$)),
    )
    const date = useMemo<string>(
        () =>
            meta instanceof Error || _.isNil(meta) || _.isNil(meta.mtime)
                ? __?.main.unknown ?? ''
                : new Date(meta.mtime.secs * 1000).toISOString(),
        [meta],
    )

    useOnce(() => {
        pageLoadingJobs$.next(
            fileControl.current[0].pipe(
                mergeMap(({ content$ }) => content$),
                catchError(() => EMPTY),
            ), // not a fatal error
        )
    })

    return content instanceof Error || meta instanceof Error ? (
        <Fallback
            message={
                content instanceof InvalidCIDError ||
                meta instanceof InvalidCIDError
                    ? __?.viewPost.invalidCidError
                    : null
            }
        />
    ) : (
        <div className="pt-48 pb-10 space-y-8">
            <div className="text-lg">
                <span>{`${__?.editPost.publishedOn}:`}</span>
                <span className="ml-3">{date}</span>
            </div>
            <WrappedEditor
                className="border-0"
                readOnly
                value={content ?? ''}
            />
        </div>
    )
}

export default PostViewPage
