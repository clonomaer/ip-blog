import {
    ControlStream,
    ControlStreamAction,
    InferControlStreamActionDataType,
} from 'types'
import { filterControlStream } from 'utils/filter-control-stream'
import { useObservable } from './observable'

export function useControlStream<
    A extends ControlStreamAction,
    T extends A['type'],
>(
    control: ControlStream<A> | undefined,
    type: T,
): InferControlStreamActionDataType<A, T> | null | undefined {
    const data = useObservable(
        control ? () => filterControlStream(control, type) : null,
    )
    return data
}
