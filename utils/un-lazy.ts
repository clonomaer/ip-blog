import _ from 'lodash'
import { LazyEval } from 'types'

export function unLazy<T>(input: LazyEval<T>): T {
    return _.isFunction(input) ? input() : input
}
