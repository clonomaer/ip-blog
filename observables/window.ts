import { EMPTY, iif, of } from 'rxjs'
import { map } from 'rxjs/operators'

export const Window$ = iif(
    () => typeof window !== 'undefined',
    of(undefined).pipe(map(() => window)),
    EMPTY,
)
