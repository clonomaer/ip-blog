import { filter, map, OperatorFunction } from 'rxjs'
import { ControlStreamAction, InferControlStreamActionDataType } from 'types'

export function controlStreamData<
    A extends ControlStreamAction,
    K extends A extends ControlStreamAction<infer Keys> ? Keys : never,
>(key: K): OperatorFunction<A, InferControlStreamActionDataType<A, K>> {
    return source =>
        source.pipe(
            filter(x => x.type === key),
            map(x => x.data),
        )
}
