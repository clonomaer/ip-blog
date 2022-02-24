export class ObservableError extends Error {
    constructor(...args: any[]) {
        super(...args)
        console.error(this)
    }
}
