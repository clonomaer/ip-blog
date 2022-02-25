import { ObservableError } from 'classes/observable-error'
import { ipfs$ } from 'contexts/ipfs'
import _ from 'lodash'
import { iif, map, mergeAll, Observable, throwError } from 'rxjs'
import isIPFS from 'is-ipfs'

export class InvalidCIDError extends ObservableError {
    constructor() {
        super('E0x01 invalid CID')
    }
}

export function ipfsTextFile$(
    cid: string | null | undefined,
): [file$: Observable<string>, controller: AbortController] {
    const controller = new AbortController()
    const decoder = new TextDecoder()
    const res = iif(
        () => _.isEmpty(cid) || !isIPFS.cid(cid),
        throwError(() => new InvalidCIDError()),
        ipfs$.pipe(
            map(x => x.cat(cid!, { signal: controller.signal })),
            mergeAll(),
            map(x => decoder.decode(x)),
        ),
    )
    return [res, controller]
}
