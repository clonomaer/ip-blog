export function listToMatrix<T>(list: T[], rowsCount: number): T[][] {
    const matrix: T[][] = []
    let columnCount = -1

    list.forEach((item, index) => {
        if (index % rowsCount === 0) {
            columnCount++
            matrix.push([])
        }
        matrix[columnCount]?.push(item)
    })

    return matrix
}
