export function isNodeMeasurable(
    visibility: boolean,
    animationFrameAwaitedVisibility: boolean,
): boolean {
    return (
        (!visibility && !animationFrameAwaitedVisibility) ||
        (visibility && !animationFrameAwaitedVisibility)
    )
}
