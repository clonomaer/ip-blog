import _ from 'lodash'
import { useEffect } from 'react'
import { Subject } from 'rxjs'
import { useLazyRef } from '../lazy-ref'

export function useModal<
    Control extends _.Dictionary<unknown> = never,
>(): Subject<Control> {
    const control$ = useLazyRef<Subject<Control>>(() => new Subject())
    useEffect(() => {
        return () => {
            control$.current.complete()
        }
    }, [])
    return control$.current
}
