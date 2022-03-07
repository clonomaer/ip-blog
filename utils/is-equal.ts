import _ from 'lodash'

export function isEqual<T, R>(obj: T, other: R): boolean {
    return _.isEqual(obj, other)
}
