import { config } from 'configs'
import { getDefaultProvider } from '@ethers-ancillary/bsc'
import { from, map, shareReplay } from 'rxjs'

export const DefaultWeb3Provider$ = from([config.Network]).pipe(
    map(x => getDefaultProvider(config.Chains[x].config)),
    shareReplay(1),
)
