import { ipfs$ } from 'contexts/ipfs'
import { Utf8ArrayToStr } from 'helpers/utf8-array-to-str'
import _ from 'lodash'
import { Window$ } from 'observables/window'
import {
    concatMap,
    defaultIfEmpty,
    from,
    map,
    mergeAll,
    Observable,
    shareReplay,
} from 'rxjs'

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
