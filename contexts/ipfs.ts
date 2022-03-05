import { config } from 'configs'
import { create } from 'ipfs-core'
import { Window$ } from 'observables/window'
import {
    from,
    mergeMap,
    of,
    retryWhen,
    shareReplay,
    throwError,
    throwIfEmpty,
    timer,
} from 'rxjs'

const ipfsNode$ = Window$.pipe(
    mergeMap(() => create()),
    shareReplay(1),
)
ipfsNode$
    .pipe(throwIfEmpty())
    .subscribe({ complete: () => console.log('ipfs node created') })

export const ipfs$ = ipfsNode$.pipe(
    mergeMap(ipfs =>
        ipfs.isOnline() ? of(ipfs) : throwError(() => 'ipfs is not ready'),
    ),
    retryWhen(() => timer(config.Retry.Timeout)),
    shareReplay(1),
)

ipfs$
    .pipe(throwIfEmpty())
    .subscribe({ complete: () => console.log('ipfs node online') })
