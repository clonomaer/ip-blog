import React, { useRef, useState } from 'react'
import type { NextPage } from 'next'
import Editor from 'rich-markdown-editor'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
export type NewPageProps = {}

const NewPage: NextPage<NewPageProps> = ({}) => {
    const __ = useLocale()
    const getContent = useRef<() => string>()
    const [dumState, setDumState] = useState<string>('')

    return (
        <div className="flex flex-col flex-grow h-full w-screen justify-center items-center p-3 space-y-8 py-8">
            <h2 className="text-xl">{__?.editPost.newPostHeading}</h2>
            <div className="flex flex-grow max-w-5xl w-full">
                <Editor
                    dark
                    className="px-7 py-3 bg-[#181A1B] border-2 border-primary-darker h-full w-full flex-grow"
                    placeholder={__?.editPost.placeholder}
                    onChange={e => (getContent.current = e)}
                />
            </div>
            <Button job={() => setDumState(getContent.current?.() ?? '')}>
                {__?.editPost.publish}
            </Button>
            <div>{dumState}</div>
        </div>
    )
}

export default NewPage
