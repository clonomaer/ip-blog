import { config } from 'configs'
import { ethers } from 'ethers'
import { map, mergeMap, Observable, of } from 'rxjs'
import { Web3ProviderEx } from 'types'
import { Web3ProviderId$ } from './web3-provider-id'

export const Web3ProviderEx$: Observable<Web3ProviderEx | undefined> =
    Web3ProviderId$.pipe(
        mergeMap(id =>
            !id ? of(undefined) : config.Web3Providers[id].provider$,
        ),
        map(externalProvider => {
            if (!externalProvider) {
                return undefined
            }
            const providerEx = new ethers.providers.Web3Provider(
                externalProvider,
            )
            ;(providerEx as Web3ProviderEx).external = externalProvider
            return providerEx as Web3ProviderEx
        }),
    )
