import { Web3Error } from 'classes/web3-error'
import _ from 'lodash'
import { Window$ } from 'observables/window'
import { map, mergeMap, Observable, of, throwError } from 'rxjs'
import { ExternalProvider, Web3ProviderId } from 'types'

function providerNotFoundErrorFactory() {
    return new Web3Error('E0x04 selected provider is not available')
}

const Web3Providers: {
    [providerKey in Web3ProviderId]: {
        id: Web3ProviderId
        provider$: Observable<ExternalProvider>
        supportsAddEthereumChain?: boolean
    }
} = {
    metamask: {
        id: 'metamask',
        provider$: Window$.pipe(
            mergeMap(win =>
                !!_.get(win, 'ethereum')?.isMetaMask
                    ? of(win)
                    : throwError(providerNotFoundErrorFactory),
            ),
            map(win => _.get(win, 'ethereum')),
        ),
        supportsAddEthereumChain: true,
    },
    binanceChain: {
        id: 'binanceChain',
        provider$: Window$.pipe(
            mergeMap(win =>
                !!_.get(window, 'BinanceChain')
                    ? of(win)
                    : throwError(providerNotFoundErrorFactory),
            ),
            map(win => _.get(win, 'BinanceChain')),
        ),
        supportsAddEthereumChain: false,
    },
    trust: {
        id: 'trust',
        provider$: Window$.pipe(
            mergeMap(win =>
                !!_.get(window, 'ethereum')?.isTrust
                    ? of(win)
                    : throwError(providerNotFoundErrorFactory),
            ),
            map(win => _.get(win, 'ethereum')),
        ),
        supportsAddEthereumChain: false,
    },
    safePal: {
        id: 'safePal',
        provider$: Window$.pipe(
            mergeMap(win =>
                !!_.get(window, 'ethereum')?.isSafePal
                    ? of(win)
                    : throwError(providerNotFoundErrorFactory),
            ),
            map(win => _.get(win, 'ethereum')),
        ),
        supportsAddEthereumChain: false,
    },
}
export const web3Config = {
    Web3Providers,
}
