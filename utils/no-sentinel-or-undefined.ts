import { SENTINEL, Sentinel } from 'contexts/empty-sentinel'
import _ from 'lodash'

export function noSentinelOrUndefined<T>(
    value: T | Sentinel | undefined,
): value is T {
    return !_.isUndefined(value) && value !== SENTINEL
}
