import { config } from 'configs'
import { BscscanProvider } from '@ethers-ancillary/bsc'
import { Network } from 'configs/web3'
import { filter, from, map, shareReplay } from 'rxjs'

export const BscScanWeb3Provider$ = from([config.Network]).pipe(
    filter(x => x !== Network.Local),
    map(x => new BscscanProvider(config.Chains[x].network)),
    shareReplay(1),
)
