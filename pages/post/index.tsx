import React, { useMemo, useRef } from 'react'
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
import { useClipboardCopy } from 'hooks/clipboard-copy'
import { flashToast$ } from 'contexts/flash-toast'
import Button from 'components/Button'

export type PostViewPageProps = {}

const PostViewPage: NextPage<PostViewPageProps> = ({}) => {
    const __ = useLocale()
    const router = useRouter()
    const postId = useMemo(() => _.castArray(router.query.postId)[0], [router])
    const fileControl = useLazyRef(() => ipfsTextFile$(postId))
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

    const spanRef = useRef<HTMLSpanElement>(null)
    const copy = useClipboardCopy(spanRef, () =>
        flashToast$.next(__?.main.done ?? 'done'),
    )

    return (
        <div
            className={cn(
                !(content instanceof Error || meta instanceof Error) &&
                    'pt-48 pb-10',
                'flex flex-grow justify-center items-center',
            )}>
            {content instanceof Error || meta instanceof Error ? (
                <Fallback
                    message={
                        content instanceof InvalidCIDError ||
                        meta instanceof InvalidCIDError
                            ? __?.viewPost.invalidCidError
                            : null
                    }
                />
            ) : (
                <div className="flex flex-col min-w-[calc(320px-2rem)] max-w-[max(50vw,theme(screens.lg))] space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="text-lg">
                            <span>{`${__?.editPost.publishedOn}:`}</span>
                            <span className="ml-3">{date}</span>
                            <span
                                ref={spanRef}
                                className="absolute h-1 w-1 overflow-hidden">
                                {postId}
                            </span>
                        </div>
                        <Button className="!p-1 !px-2" job={copy}>
                            <i className="uil-copy mr-2" />
                            {__?.viewPost.copyButton}
                        </Button>
                    </div>
                    {content && (
                        <WrappedEditor
                            className="border-0"
                            readOnly
                            value={content ?? ''}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default PostViewPage
