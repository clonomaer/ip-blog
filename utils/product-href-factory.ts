export function productHrefFactory(
    id: string | number | undefined | null,
): string {
    return id ? `/product/${id}` : '#'
}
