import { config } from 'configs'
import { providers } from 'ethers'
import {
    filter,
    from,
    map,
    mapTo,
    mergeMap,
    scan,
    shareReplay,
    tap,
} from 'rxjs'

export const CustomRemoteWeb3Providers$ = from([config.Network]).pipe(
    mergeMap(x => config.CustomEndpoints[x]),
    map(x => new providers.JsonRpcProvider(x)),
    mergeMap(provider =>
        from(provider.getBlockNumber()).pipe(
            tap(
                x =>
                    x < 1 &&
                    provider.emit('error', new Error('endpoint not available')), // avoid extra network overhead
            ),
            filter(x => x >= 1),
            mapTo(provider),
        ),
    ),
    scan(
        (acc, curr) =>
            curr.network.chainId === acc[0]?.network.chainId
                ? [...acc, curr]
                : [curr],
        [] as providers.JsonRpcProvider[],
    ),
    shareReplay(1),
)
