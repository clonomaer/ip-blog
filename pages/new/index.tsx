import React, { useMemo } from 'react'
import type { NextPage } from 'next'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { editorContent$, editorContentChanged$ } from 'contexts/editor-content'
import { useObservable } from 'hooks/observable'
import {
    combineLatest,
    delay,
    filter,
    map,
    mergeMap,
    of,
    sample,
    shareReplay,
    startWith,
    Subject,
    take,
    tap,
    timer,
} from 'rxjs'
import ConfirmationModal, {
    ConfirmationModalControl,
} from 'components/ConfirmationModal'
import { useLazyRef } from 'hooks/lazy-ref'
import { useSubscribe } from 'hooks/subscribe'
import { localCache } from 'contexts/local-cache'
import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import WrappedEditor from 'components/WrappedEditor'
import _, { merge } from 'lodash'
import { truthy } from 'helpers/truthy'
import { controlStreamPayload } from 'operators/control-stream-payload'
import { useCreateControl } from 'hooks/control/create-control'
import { useAcceptExitUnlessLoading } from 'hooks/modal/accept-exit-unless-loading'
import { ipfsPushText$ } from 'providers/ipfs-push'
import { useRouter } from 'next/router'
import { __$ } from 'locales'
import { recentPosts$ } from 'contexts/recent-posts'
import { getSubjectValue } from 'utils/get-subject-value'

export type NewPageProps = {}

const NewPage: NextPage<NewPageProps> = ({}) => {
    const __ = useLocale()
    const editorSavedValue = useObservable(() => editorContent$.pipe(take(1)))
    const [modalControl$] = useCreateControl<ConfirmationModalControl>()
    useAcceptExitUnlessLoading(modalControl$)

    const router = useRouter()
    useSubscribe(
        () => modalControl$.pipe(controlStreamPayload('Confirm')),
        () => {
            modalControl$.next({ Loading: true })
            editorContent$
                .pipe(
                    take(1),
                    map(x => ipfsPushText$(x)),
                    mergeMap(([cid$]) => cid$),
                    tap(() => {
                        modalControl$.next({ Loading: false, Display: false })
                    }),
                    delay(config.Delays.min),
                    tap(() => {
                        flashToast$.next('') //hack: fixes the bug!
                        __$.subscribe(__ => {
                            flashToast$.next(__.editPost.publishedSuccessfully)
                        })
                    }),
                    delay(config.Delays.confirm),
                )
                .subscribe(cid => {
                    recentPosts$.next([
                        ...(getSubjectValue(recentPosts$) ?? []),
                        cid.toString(),
                    ])

                    router.push(`/post?postId=${cid.toString?.()}`)
                })
        },
    )

    const handlePublish = useMemo(
        () => () => {
            editorContentChanged$
                .pipe(
                    take(1),
                    map(f => f()),
                )
                .subscribe(x => editorContent$.next(x))
            modalControl$.next({
                Display: true,
            })
        },
        [modalControl$],
    )

    const handleSaveDraft = useMemo(
        () => () => {
            editorContentChanged$
                .pipe(
                    take(1),
                    map(f => f()),
                )
                .subscribe(
                    localCache.observe<string>(config.EditorContent.CacheKey),
                )
            flashToast$.next(__?.editPost.draftSaved ?? '')
        },
        [__],
    )

    return (
        <div className="flex flex-col flex-grow min-h-main-content justify-center items-center space-y-8 py-8">
            <h2 className="text-xl">{__?.editPost.newPostHeading}</h2>
            <div className="flex flex-grow max-w-5xl w-full">
                {__ && ( // placeholder fix
                    <WrappedEditor
                        dark
                        className="px-7 py-3 bg-[#181A1B] border-2 border-primary-darker w-full flex-grow"
                        placeholder={__.editPost.placeholder}
                        onChange={f => editorContentChanged$.next(f)}
                        value={truthy(editorSavedValue, '')}
                    />
                )}
            </div>
            <div className="justify-self-end">
                <Button job={handleSaveDraft}>{__?.editPost.draft}</Button>
                <Button job={handlePublish}>{__?.editPost.publish}</Button>
            </div>
            <ConfirmationModal control={modalControl$}>
                <div className="max-w-xs">
                    {__?.editPost.publishConfirmationMessage}
                </div>
            </ConfirmationModal>
        </div>
    )
}

export default NewPage
