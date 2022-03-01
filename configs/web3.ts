import { Web3Error } from 'classes/web3-error'
import _ from 'lodash'
import { Window$ } from 'observables/window'
import { map, mergeMap, Observable, of, throwError } from 'rxjs'
import { ExternalProvider, Web3ProviderId } from 'types'

export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Local = 'local',
}

function providerNotFoundErrorFactory() {
    return new Web3Error('E0x04 selected provider is not available')
}

const Web3Providers: {
    [providerKey in Web3ProviderId]: {
        id: Web3ProviderId
        provider$: Observable<ExternalProvider | undefined>
        supportsAddEthereumChain?: boolean
    }
} = {
    metamask: {
        id: 'metamask',
        provider$: Window$.pipe(
            map(win =>
                !!_.get(win, 'ethereum')?.isMetaMask
                    ? (_.get(win, 'ethereum') as ExternalProvider)
                    : undefined,
            ),
        ),
        supportsAddEthereumChain: true,
    },
    binanceChain: {
        id: 'binanceChain',
        provider$: Window$.pipe(
            map(win =>
                !!_.get(win, 'BinanceChain')
                    ? (_.get(win, 'BinanceChain') as ExternalProvider)
                    : undefined,
            ),
        ),
        supportsAddEthereumChain: false,
    },
    trust: {
        id: 'trust',
        provider$: Window$.pipe(
            map(win =>
                !!_.get(win, 'ethereum')?.isTrust
                    ? (_.get(win, 'ethereum') as ExternalProvider)
                    : undefined,
            ),
        ),
        supportsAddEthereumChain: false,
    },
    safePal: {
        id: 'safePal',
        provider$: Window$.pipe(
            map(win =>
                !!_.get(win, 'ethereum')?.isSafePal
                    ? (_.get(win, 'ethereum') as ExternalProvider)
                    : undefined,
            ),
        ),
        supportsAddEthereumChain: false,
    },
}

const Chains: {
    [key in Network]: {
        id: number
        config: {
            chainId: string
            chainName: string
            nativeCurrency: {
                name: string
                symbol: string
                decimals: number
            }
            rpcUrls: string[]
            blockExplorerUrls?: string[]
        }
    }
} = {
    [Network.Mainnet]: {
        id: 56,
        config: {
            chainId: `0x${(56).toString(16)}`,
            chainName: 'Binance Smart Chain Mainnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
            },
            rpcUrls: [
                // "https://bsc-dataseed1.ninicoin.io",
                // "https://bsc-dataseed1.defibit.io",
                'https://bsc-dataseed.binance.org',
            ],
            blockExplorerUrls: ['https://bscscan.com/'],
        },
    },
    [Network.Testnet]: {
        id: 97,
        config: {
            chainId: `0x${(97).toString(16)}`,
            chainName: 'Smart Chain Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
        },
    },
    [Network.Local]: {
        id: 31337,
        config: {
            chainId: `0x${(31337).toString(16)}`,
            chainName: 'Local',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
            },
            rpcUrls: ['http://localhost:8545'],
        },
    },
}

export const web3Config = {
    Web3Providers,
    Chains,
    Network: Network.Mainnet,
}
