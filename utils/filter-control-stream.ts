import { isSentinel, SENTINEL } from 'contexts/empty-sentinel'
import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import {
    ControlStream,
    ControlStreamAction,
    InferControlStreamActionDataType,
} from 'types'

export function filterControlStream<
    A extends ControlStreamAction,
    T extends A['type'],
>(
    control: ControlStream<A>,
    type: T,
): Observable<InferControlStreamActionDataType<A, T>> {
    return control.pipe(
        map(x =>
            x.type === type
                ? (x.data as InferControlStreamActionDataType<A, T>)
                : SENTINEL,
        ),
        filter(x => !isSentinel(x)),
    )
}
