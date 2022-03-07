import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import { useObservable } from 'hooks/observable'
import { recentPosts$ } from 'contexts/recent-posts'
import Fallback from 'components/Fallback'
import { shortenString } from 'utils/shorten-string'
import { useRoutePush } from 'hooks/route-push'
import { __$ } from 'locales'

export type RecentPostsProps = {
    className?: ClassName
}

export default function RecentPosts({
    className,
}: RecentPostsProps): React.ReactElement | null {
    const __ = useObservable(__$, { ignoreErrors: true })
    const postList = useObservable(recentPosts$)
    const push = useRoutePush()
    return (
        <div
            className={cn(
                'flex flex-col border border-primary rounded-lg p-3 items-center',
                className,
            )}>
            <div className="w-full text-center mb-4">
                {__?.viewPost.recentPostsTitle}
            </div>
            <div className="w-full border-b border-primary-dark mb-4" />
            <div className="flex flex-col mb-2">
                {postList instanceof Error ? (
                    <Fallback />
                ) : postList ? (
                    postList.map((cid, index) => (
                        <a
                            key={`${cid}-${index}`}
                            className="flex transition-all hover:text-primary cursor-pointer active:text-primary-dark"
                            onClick={push(`/post?postId=${cid}`)}>
                            <i className="uil-file-alt text-xl mr-1" />
                            {shortenString(cid, 6)}
                        </a>
                    ))
                ) : (
                    <div>{__?.viewPost.recentPostsEmpty}</div>
                )}
            </div>
        </div>
    )
}
