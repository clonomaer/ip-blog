import { ObservableError } from 'classes/observable-error'
import { ipfs$ } from 'contexts/ipfs'
import _ from 'lodash'
import {
    concat,
    iif,
    map,
    mergeAll,
    Observable,
    of,
    tap,
    throwError,
} from 'rxjs'
import isIPFS from 'is-ipfs'
import { IPFSEntry } from 'ipfs-core-types/src/root'

export class InvalidCIDError extends ObservableError {
    constructor() {
        super('E0x01 invalid CID')
    }
}

export function ipfsTextFile$(cid: string | null | undefined): [
    file$: Observable<{
        content$: Observable<string>
        meta$: Observable<IPFSEntry>
    }>,
    controller: AbortController,
] {
    const controller = new AbortController()
    const decoder = new TextDecoder()

    const content$ = ipfs$.pipe(
        map(x => x.cat(cid!, { signal: controller.signal })),
        mergeAll(),
        map(x => decoder.decode(x)),
    )

    const meta$ = ipfs$.pipe(
        map(x => x.ls(cid!, { signal: controller.signal })),
        mergeAll(),
    )

    const res$ = iif(
        () => !_.isEmpty(cid) && isIPFS.cid(cid),
        of({ content$, meta$ }),
        throwError(() => new InvalidCIDError()),
    )
    return [res$, controller]
}
