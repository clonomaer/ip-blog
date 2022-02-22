import { create } from 'ipfs-core'
import { from, shareReplay } from 'rxjs'
export const ipfs$ = from(create()).pipe(shareReplay(1))
