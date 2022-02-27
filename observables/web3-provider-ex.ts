import { config } from 'configs'
import { ethers } from 'ethers'
import { map, mergeMap, of, shareReplay } from 'rxjs'
import { Web3ProviderEx } from 'types'
import { Web3ProviderId$ } from './web3-provider-id'

export const Web3ProviderEx$ = Web3ProviderId$.pipe(
    mergeMap(id =>
        !id
            ? of(undefined)
            : config.Web3Providers[id].provider$.pipe(
                  map(externalProvider => {
                      const providerEx = new ethers.providers.Web3Provider(
                          externalProvider,
                      )
                      ;(providerEx as Web3ProviderEx).external =
                          externalProvider
                      return providerEx as Web3ProviderEx
                  }),
              ),
    ),
)