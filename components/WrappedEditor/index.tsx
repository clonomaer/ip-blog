import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import styles from './styles.module.css'
import Editor, { Props as EditorProps } from 'rich-markdown-editor'

export type WrappedEditorProps = {
    className?: ClassName
} & Partial<EditorProps>

export default function WrappedEditor({
    className,
    ...props
}: WrappedEditorProps): React.ReactElement | null {
    return (
        <Editor
            dark
            className={cn(
                'px-7 py-3 border-2 border-primary-darker h-full w-full flex-grow',
                styles.container,
                className,
            )}
            {...props}
        />
    )
}
