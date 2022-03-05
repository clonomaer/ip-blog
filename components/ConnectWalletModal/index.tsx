import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import ModalWrapper, { ModalControl } from 'components/ModalWrapper'
import { Subject } from 'rxjs'
import Button from 'components/Button'
import { useLocale } from 'hooks/locale'
import { useControlStream } from 'hooks/control-stream'
import { useAcceptExitUnlessLoading } from 'hooks/modal/accept-exit-unless-loading'
import { config } from 'configs'
import _ from 'lodash'
import ConnectWalletModalSingleItem from './single-item'
import { SignerAddress$ } from 'observables/signer-account'
import { useObservable } from 'hooks/observable'
import { Web3ProviderId$ } from 'observables/web3-provider-id'
import { waitFor } from 'helpers/wait-for'
import Fade from 'components/Fade'
import { WalletConnectStatus$ } from 'observables/wallet-connect-status'

export type ConnectWalletModalControl = Partial<{
    Loading: string | null
}> &
    ModalControl

export type ConnectWalletModalProps = {
    className?: ClassName
    control: Subject<ConnectWalletModalControl>
}

export default function ConnectWalletModal({
    className,
    control,
}: ConnectWalletModalProps): React.ReactElement | null {
    const __ = useLocale()
    const isLoading = useControlStream(control, 'Loading')
    useAcceptExitUnlessLoading(control)
    const address = useObservable(SignerAddress$)
    const isConnected = useObservable(WalletConnectStatus$)
    return (
        <ModalWrapper
            className={className}
            mode="height"
            classNames={{
                container: cn(
                    'rounded-lg',
                    'border',
                    'border-primary-dark',
                    'bg-page-bg',
                    'p-2',
                    'space-y-2',
                    'm-4',
                ),
            }}
            control={control}>
            <div className={cn('flex', 'justify-end')}>
                <Button
                    job={() => control.next({ RequestExit: true })}
                    className={cn(
                        'h-8',
                        'w-8',
                        'flex',
                        'justify-center',
                        'items-center',
                    )}>
                    x
                </Button>
            </div>
            <div className="flex flex-col justify-center items-center mb-5">
                <Fade
                    visible={!!isConnected}
                    classNames={{
                        wrapper: 'flex flex-col justify-center items-center',
                    }}>
                    <div className="mx-4 mb-4 mt-2">{address}</div>
                    <Button
                        job={async () => {
                            control.next({ RequestExit: true })
                            // await waitFor(300)
                            Web3ProviderId$.next(undefined)
                        }}>
                        {__?.web3Provider.connect.disconnect}
                    </Button>
                </Fade>
                <Fade visible={!isConnected} className="px-3">
                    {__?.web3Provider.connect.selectProvider}
                </Fade>
                <Fade
                    visible={!isConnected}
                    className=""
                    classNames={{
                        wrapper: 'flex flex-wrap justify-center items-center',
                    }}>
                    {(
                        _.keys(
                            config.Web3Providers,
                        ) as (keyof typeof config.Web3Providers)[]
                    ).map((key, index) => (
                        <ConnectWalletModalSingleItem
                            key={`connect-${index}`}
                            id={key}
                            control={control}
                        />
                    ))}
                </Fade>
                <Fade
                    visible={!isConnected}
                    className="flex place-self-end"
                    classNames={{
                        wrapper: cn('place-self-end'),
                    }}>
                    <Button
                        disabled={!!isLoading}
                        job={() =>
                            control.next({
                                RequestExit: true,
                            })
                        }>
                        {__?.userInteraction.confirmation.cancel}
                    </Button>
                </Fade>
            </div>
        </ModalWrapper>
    )
}
