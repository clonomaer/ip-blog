import { SENTINEL } from 'contexts/empty-sentinel'
import _ from 'lodash'
import { filter, map, OperatorFunction, tap } from 'rxjs'
import { NonUndefinable } from 'types'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'

export function controlStreamPayload<
    Action extends keyof Payloads,
    Payloads extends _.Dictionary<unknown>,
>(
    action: Action,
): OperatorFunction<Payloads, NonUndefinable<Payloads[Action]>> {
    return source =>
        source.pipe(
            map(x => (action in x ? x[action] : SENTINEL)),
            filter(noSentinelOrUndefined),
        )
}
