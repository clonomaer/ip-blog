import { providers } from 'ethers'
import { Web3ProviderEx$ } from 'observables/web3-provider-ex'
import { combineLatest, map, startWith } from 'rxjs'
import { BscScanWeb3Provider$ } from './bsc-scan-provider'
import { CustomRemoteWeb3Providers$ } from './custom-remote-providers'
import { DefaultWeb3Provider$ } from './default-provider'

export const fallbackWeb3Provider$ = combineLatest({
    external: Web3ProviderEx$.pipe(startWith(undefined)),
    _default: DefaultWeb3Provider$.pipe(startWith(undefined)),
    remotes: CustomRemoteWeb3Providers$.pipe(startWith(undefined)),
    bscScan: BscScanWeb3Provider$.pipe(startWith(undefined)),
}).pipe(
    map(
        ({ bscScan, _default, external, remotes }) =>
            new providers.FallbackProvider([
                ...(external
                    ? [
                          {
                              provider: external,
                              priority: 1,
                              weight: 3,
                          },
                      ]
                    : []),
                ...(bscScan
                    ? [
                          {
                              provider: bscScan,
                              priority: 2,
                              weight: 2,
                          },
                      ]
                    : []),
                ...(remotes
                    ? remotes.map(remote => ({
                          provider: remote,
                          priority: 2,
                          weight: 2,
                      }))
                    : []),
                ...(_default
                    ? [
                          {
                              provider: _default,
                              priority: 3,
                              weight: 1,
                          },
                      ]
                    : []),
            ]),
    ),
)
