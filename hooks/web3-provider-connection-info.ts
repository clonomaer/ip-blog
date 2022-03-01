import { flashToast$ } from 'contexts/flash-toast'
import { __$ } from 'locales'
import { SignerAccount$ } from 'observables/signer-account'
import { useSubscribe } from './subscribe'

export function useWeb3ProviderConnectionInfo() {
    useSubscribe(
        () => SignerAccount$,
        x =>
            x !== undefined &&
            __$.subscribe(__ => {
                flashToast$.next(
                    x
                        ? __.web3Provider.connect.connected ?? ''
                        : __.web3Provider.connect.disconnected ?? '',
                )
            }),
    )
}
