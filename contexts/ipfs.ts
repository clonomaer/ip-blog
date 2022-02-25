import { config } from 'configs'
import { create } from 'ipfs-core'
import {
    from,
    mergeMap,
    of,
    retryWhen,
    shareReplay,
    throwError,
    timer,
} from 'rxjs'

const ipfsNode$ = from(create()).pipe(shareReplay(1))
ipfsNode$.subscribe({ complete: () => console.log('ipfs node created') })

export const ipfs$ = ipfsNode$.pipe(
    mergeMap(ipfs =>
        ipfs.isOnline() ? of(ipfs) : throwError(() => 'ipfs is not ready'),
    ),
    retryWhen(() => timer(config.Retry.Timeout)),
    shareReplay(1),
)

ipfs$.subscribe({ complete: () => console.log('ipfs node online') })
