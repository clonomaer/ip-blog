import React, { useMemo } from 'react'
import type { NextPage } from 'next'
import Editor from 'rich-markdown-editor'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { editorContent$, editorContentChanged$ } from 'contexts/editor-content'
import { useObservable } from 'hooks/observable'
import { filter, map, Subject, take } from 'rxjs'
import ConfirmationModal, {
    ConfirmationModalControlStream,
} from 'components/ConfirmationModal'
import { useLazyRef } from 'hooks/lazy-ref'
import { useSubscribe } from 'hooks/subscribe'
import { localCache } from 'contexts/local-cache'
import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'

export type NewPageProps = {}

const NewPage: NextPage<NewPageProps> = ({}) => {
    const __ = useLocale()
    const editorSavedValue = useObservable(() => editorContent$.pipe(take(1)))
    const dumState = useObservable(editorContent$)
    const modalControl = useLazyRef<ConfirmationModalControlStream>(
        () => new Subject(),
    )
    useSubscribe(
        () => modalControl.current.pipe(filter(x => x.type === 'requestExit')),
        () => modalControl.current.next({ type: 'display', data: false }),
    )

    const handlePublish = useMemo(
        () => () => {
            editorContentChanged$
                .pipe(
                    take(1),
                    map(f => f()),
                )
                .subscribe(editorContent$)
            modalControl.current.next({
                type: 'display',
                data: true,
            })
        },
        [modalControl],
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
        <div className="flex flex-col flex-grow h-full w-screen justify-center items-center p-3 space-y-8 py-8">
            <h2 className="text-xl">{__?.editPost.newPostHeading}</h2>
            <div className="flex flex-grow max-w-5xl w-full">
                {__ && (
                    <Editor
                        dark
                        className="px-7 py-3 bg-[#181A1B] border-2 border-primary-darker h-full w-full flex-grow"
                        placeholder={__.editPost.placeholder}
                        onChange={f => editorContentChanged$.next(f)}
                        value={editorSavedValue ?? ''}
                    />
                )}
            </div>
            <div>
                <Button job={handleSaveDraft}>{__?.editPost.draft}</Button>
                <Button job={handlePublish}>{__?.editPost.publish}</Button>
            </div>
            <ConfirmationModal control={modalControl.current}>
                <div className="max-w-xs">
                    {__?.editPost.publishConfirmationMessage}
                </div>
            </ConfirmationModal>
            <div>{dumState}</div>
        </div>
    )
}

export default NewPage
