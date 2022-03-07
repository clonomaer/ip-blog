import _ from 'lodash'
import { map, mergeMap, Observable, of, OperatorFunction } from 'rxjs'

export function withUpdatesFrom<T, R>(
    sourceOrMapper: ((input: T) => Observable<R>) | Observable<R>,
): OperatorFunction<T, [T, R]> {
    return source =>
        source.pipe(
            mergeMap(x =>
                (_.isFunction(sourceOrMapper)
                    ? sourceOrMapper(x)
                    : sourceOrMapper
                ).pipe(map(res => [x, res] as [T, R])),
            ),
        )
}
