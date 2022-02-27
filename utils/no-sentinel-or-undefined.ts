import { SENTINEL, Sentinel } from 'contexts/empty-sentinel'
import _ from 'lodash'
import { NonUndefinable } from 'types'

export function noSentinelOrUndefined<T>(
    value: T | Sentinel | undefined,
): value is NonUndefinable<T> {
    return !_.isUndefined(value) && value !== SENTINEL
}
