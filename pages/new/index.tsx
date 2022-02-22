import React, { useState } from 'react'
import type { NextPage } from 'next'
import Editor from 'rich-markdown-editor'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { editorContent$, editorContentChanged$ } from 'contexts/editor-content'
import { useObservable } from 'hooks/observable'
import { take } from 'rxjs'

export type NewPageProps = {}

const NewPage: NextPage<NewPageProps> = ({}) => {
    const __ = useLocale()
    const editorSavedValue = useObservable(() => editorContent$.pipe(take(1)))
    const dumState = useObservable(editorContent$)

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
            <Button
                job={() => {
                    editorContent$.next(editorContentChanged$.getValue()())
                    console.log('content is up to date')
                }}>
                {__?.editPost.publish}
            </Button>
            <div>{dumState}</div>
        </div>
    )
}

export default NewPage
