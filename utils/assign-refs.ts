import _ from 'lodash'
import { ForwardedRef } from 'react'

export function assignRefs<T extends HTMLElement>(
    refs: ForwardedRef<T>[],
): (ref: T | null) => void {
    return _ref => {
        refs.forEach(ref => {
            if (_.isFunction(ref)) {
                ref(_ref)
            } else if (!_.isNil(ref)) {
                ref.current = _ref
            }
        })
    }
}
