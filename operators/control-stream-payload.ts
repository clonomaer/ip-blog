import { SENTINEL } from 'contexts/empty-sentinel'
import _ from 'lodash'
import { filter, map, OperatorFunction, tap } from 'rxjs'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'

export function controlStreamPayload<
    Action extends keyof Payloads,
    Payloads extends _.Dictionary<unknown>,
>(action: Action): OperatorFunction<Payloads, Payloads[Action]> {
    return source =>
        source.pipe(
            map(x => (action in x ? x[action] : SENTINEL)),
            filter(noSentinelOrUndefined),
        )
}
