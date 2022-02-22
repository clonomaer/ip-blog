export type ScrollableNodeProps<T> = {
    ref: React.RefObject<T>
    onScroll: React.UIEventHandler<T>
}
