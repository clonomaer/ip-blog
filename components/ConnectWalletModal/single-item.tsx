import React from 'react'
import cn from 'classnames'
import { ClassName, Web3ProviderId } from 'types'
import { connectWalletModalAssetsMap } from './assets-map'
import Button from 'components/Button'
import { config } from 'configs'
import { useObservable } from 'hooks/observable'
import { ConnectWalletModalControl } from '.'
import { filter, firstValueFrom, skip, Subject, take } from 'rxjs'
import { useControlStream } from 'hooks/control-stream'
import { localCache } from 'contexts/local-cache'
import { SignerAddress$ } from 'observables/signer-account'
import { noSentinelOrUndefined } from 'utils/no-sentinel-or-undefined'
import { waitFor } from 'helpers/wait-for'

export type ConnectWalletModalSingleItemProps = {
    className?: ClassName
    id: Web3ProviderId
    control: Subject<ConnectWalletModalControl>
}

export default function ConnectWalletModalSingleItem({
    className,
    id,
    control,
}: ConnectWalletModalSingleItemProps): React.ReactElement | null {
    const provider = useObservable(config.Web3Providers[id].provider$, {
        errorTransformer: undefined,
    })
    const loading = useControlStream(control, 'Loading')
    return (
        <Button
            className="flex flex-col items-center"
            disabled={(loading && loading !== id) || !provider}
            isLoading={loading === id}
            job={async () => {
                control.next({ Loading: id })
                const subject = localCache.observe<Web3ProviderId | undefined>(
                    config.Web3ProviderIdCacheKey,
                )
                subject.next(undefined)
                await waitFor(100)
                subject.next(id)
                await firstValueFrom(
                    SignerAddress$.pipe(
                        skip(1),
                        filter(noSentinelOrUndefined),
                        take(1),
                    ),
                ).then(() => control.next({ Loading: null, RequestExit: true }))
            }}>
            <img
                alt={id}
                src={connectWalletModalAssetsMap[id]}
                className={cn(
                    'h-20 w-20 object-contain mb-3 transition-all',
                    ((loading && loading !== id) || !provider) &&
                        'filter grayscale brightness-50',
                    loading === id && 'opacity-0',
                )}
            />
            <div className="">{id}</div>
        </Button>
    )
}
