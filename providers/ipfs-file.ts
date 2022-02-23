import { ipfs$ } from 'contexts/ipfs'
import _ from 'lodash'
import { map, mergeAll, Observable } from 'rxjs'

export function ipfsTextFile$(
    cid: string,
): [file$: Observable<string>, controller: AbortController] {
    const controller = new AbortController()
    const decoder = new TextDecoder()
    const res = ipfs$.pipe(
        map(x => x.cat(cid, { signal: controller.signal })),
        mergeAll(),
        map(x => decoder.decode(x)),
    )
    return [res, controller]
}
