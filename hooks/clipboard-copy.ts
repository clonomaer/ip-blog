import { useMemo } from 'react'

export function useClipboardCopy(
    ref: React.MutableRefObject<HTMLElement | null>,
    successCallback: () => void,
): () => void {
    return useMemo(
        () =>
            function copyToClipboard() {
                if (!ref.current) {
                    return
                }
                if (navigator?.clipboard?.writeText) {
                    navigator.clipboard
                        .writeText(ref.current.innerText)
                        .then(() => successCallback())
                } else {
                    const range = document.createRange()
                    const selection = window.getSelection()
                    range.selectNodeContents(ref.current)
                    selection?.removeAllRanges()
                    selection?.addRange(range)
                    document.execCommand('copy')
                    successCallback()
                    selection?.removeAllRanges()
                }
            },
        [ref, successCallback],
    )
}
