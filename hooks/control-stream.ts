import { controlStreamPayload } from 'operators/control-stream-payload'
import { Subject } from 'rxjs'
import { ControlStream } from 'types'
import { useObservable } from './observable'

export function useControlStream<
    Action extends keyof Payloads,
    Payloads extends _.Dictionary<unknown>,
>(
    control: Subject<Payloads> | undefined,
    action: Action,
): Payloads[Action] | undefined {
    const data = useObservable(control?.pipe(controlStreamPayload(action)), {
        ignoreErrors: true,
    })
    return data
}
