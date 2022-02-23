import { SENTINEL, Sentinel } from 'contexts/empty-sentinel'
import _ from 'lodash'

export function truthy<T, R>(
    input: T | undefined | null | Error | Sentinel,
    defaultValue: R,
): T | R {
    if (_.isNil(input) || _.isError(input) || input === SENTINEL) {
        return defaultValue
    }
    return input
}
