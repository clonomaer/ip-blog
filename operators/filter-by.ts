import {
    filter,
    from,
    identity,
    mapTo,
    mergeMap,
    MonoTypeOperatorFunction,
    Observable,
    take,
} from 'rxjs'

export function filterBy<T>(
    predicate: (source: T) => Observable<boolean> | Promise<boolean>,
): MonoTypeOperatorFunction<T> {
    return source =>
        source.pipe(
            mergeMap(x =>
                from(predicate(x)).pipe(take(1), filter(identity), mapTo(x)),
            ),
        )
}
