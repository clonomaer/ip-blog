export function shortenString(
    str: string | undefined,
    showLetters: number,
    {
        trimStart = false,
        trimEnd = false,
    }: { trimStart?: boolean; trimEnd?: boolean } = {}
) {
    if (!str) {
        return undefined
    }
    const start = str.slice(0, showLetters)
    const end = str.slice(-showLetters)
    if (!trimEnd && !trimStart) {
        return `${start}...${end}`
    }
    if (trimStart) {
        return `...${end}`
    }
    return `${start}...`
}
