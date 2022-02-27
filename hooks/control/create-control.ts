import { useObservable } from 'hooks/observable'
import _ from 'lodash'
import { useEffect } from 'react'
import { scan, Subject } from 'rxjs'
import { useLazyRef } from '../lazy-ref'

export function useCreateControl<
    Control extends _.Dictionary<unknown> = never,
>(): [control$: Subject<Control>, control: Control] {
    const control$ = useLazyRef<Subject<Control>>(() => new Subject())
    const control = useObservable(
        () =>
            control$.current.pipe(
                scan((acc, curr) => ({ ...acc, ...curr }), {} as Control),
            ),
        { ignoreErrors: true, initialValue: {} as Control },
    )
    useEffect(() => {
        return () => {
            control$.current.complete()
        }
    }, [])
    return [control$.current, control]
}
