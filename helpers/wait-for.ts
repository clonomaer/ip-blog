export async function waitFor(timeout: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}
