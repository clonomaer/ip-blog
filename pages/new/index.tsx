import React, { useMemo } from 'react'
import type { NextPage } from 'next'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { editorContent$, editorContentChanged$ } from 'contexts/editor-content'
import { useObservable } from 'hooks/observable'
import { filter, map, Subject, take } from 'rxjs'
import ConfirmationModal, {
    ConfirmationModalControl,
} from 'components/ConfirmationModal'
import { useLazyRef } from 'hooks/lazy-ref'
import { useSubscribe } from 'hooks/subscribe'
import { localCache } from 'contexts/local-cache'
import { config } from 'configs'
import { flashToast$ } from 'contexts/flash-toast'
import WrappedEditor from 'components/WrappedEditor'
import _ from 'lodash'
import { truthy } from 'helpers/truthy'
import { controlStreamPayload } from 'operators/control-stream-payload'
import { useModal } from 'hooks/modal/modal-control'

export type NewPageProps = {}

const NewPage: NextPage<NewPageProps> = ({}) => {
    const __ = useLocale()
    const editorSavedValue = useObservable(() => editorContent$.pipe(take(1)))
    const modalControl = useModal<ConfirmationModalControl>()

    useSubscribe(
        () =>
            modalControl.pipe(
                controlStreamPayload('RequestExit'),
                map(() => ({ Display: false })),
            ),
        modalControl,
    )

    const handlePublish = useMemo(
        () => () => {
            editorContentChanged$
                .pipe(
                    take(1),
                    map(f => f()),
                )
                .subscribe(editorContent$)
            modalControl.next({
                Display: true,
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
                {__ && ( // placeholder fix
                    <WrappedEditor
                        dark
                        className="px-7 py-3 bg-[#181A1B] border-2 border-primary-darker h-full w-full flex-grow"
                        placeholder={__.editPost.placeholder}
                        onChange={f => editorContentChanged$.next(f)}
                        value={truthy(editorSavedValue, '')}
                    />
                )}
            </div>
            <div>
                <Button job={handleSaveDraft}>{__?.editPost.draft}</Button>
                <Button job={handlePublish}>{__?.editPost.publish}</Button>
            </div>
            <ConfirmationModal control={modalControl}>
                <div className="max-w-xs">
                    {__?.editPost.publishConfirmationMessage}
                </div>
            </ConfirmationModal>
        </div>
    )
}

export default NewPage
