import React from 'react'
import cn from 'classnames'
import { ClassName } from 'types'
import Button from 'components/Button'
import { shortenString } from 'utils/shorten-string'
import { useObservable } from 'hooks/observable'
import { SignerAccount$ } from 'observables/signer-account'
import ConnectWalletModal, {
    ConnectWalletModalControl,
} from 'components/ConnectWalletModal'
import { useCreateControl } from 'hooks/control/create-control'
import { useLocale } from 'hooks/locale'
import { ipfs$ } from 'contexts/ipfs'
import Fade from 'components/Fade'
import styles from './styles.module.css'
import Link from 'next/link'
import { useRoutePush } from 'hooks/route-push'
import { useDelay } from 'hooks/delay'

export type MainTopBarProps = {
    className?: ClassName
}

export default function MainTopBar({
    className,
}: MainTopBarProps): React.ReactElement | null {
    const __ = useLocale()
    const ipfs = useObservable(ipfs$)
    const push = useRoutePush()
    const connectIconHide = useDelay(!!ipfs, 2000)

    const signer = useObservable(() => SignerAccount$)
    const [modalControl$] = useCreateControl<ConnectWalletModalControl>()
    return (
        <div className="flex w-full justify-between items-center p-3">
            <div className="flex items-center sm:ml-3">
                <span
                    className={cn(
                        styles.title,
                        'text-2xl font-bold cursor-pointer',
                    )}
                    onClick={push('/')}>
                    IPBlog
                </span>
                <div className="relative self-start ml-3 text-3xl">
                    <Fade visible={!ipfs} className="absolute">
                        <i className="uil-link-broken text-red-500 animate-ping " />
                    </Fade>
                    <Fade
                        visible={!!ipfs && !connectIconHide}
                        className="absolute">
                        <i className="uil-link-alt text-green-500" />
                    </Fade>
                </div>
            </div>
            <div className="">
                <ConnectWalletModal control={modalControl$} />
                <Button
                    job={async () => modalControl$.next({ Display: true })}
                    className="flex items-center justify-center"
                    active={!!signer}>
                    <i
                        className={cn(
                            signer ? 'uil-link-alt' : 'uil-link-broken',
                            'text-3xl',
                        )}
                    />
                    <span className="ml-3 hidden sm:inline">
                        {signer
                            ? shortenString(String(signer), 4)
                            : __?.web3Provider.connect.connectButton
                                  .notConnected}
                    </span>
                </Button>
            </div>
        </div>
    )
}
