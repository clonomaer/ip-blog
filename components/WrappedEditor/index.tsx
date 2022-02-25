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
                'px-7',
                'py-5',
                'h-full',
                'w-full',
                'flex-grow',
                'bg-indigo-800',
                'bg-opacity-10',
                'rounded-2xl',
                'border',
                'border-primary-dark',
                'revert-tailwind-preflight',
                'shadow-strong',
                styles.container,
                className,
            )}
            {...props}
        />
    )
}
