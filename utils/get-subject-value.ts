import { ReplaySubject } from 'rxjs'

/**@description to be used only with ReplaySubjects */

export function getSubjectValue<T>(
    subject: ReplaySubject<T> | null | undefined,
): T | undefined {
    let current: T | undefined = undefined
    const sub = subject?.subscribe(value => {
        current = value
    })
    sub?.unsubscribe()
    return current
}
