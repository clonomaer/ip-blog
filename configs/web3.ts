import { Web3Error } from 'classes/web3-error'
import _ from 'lodash'
import { Window$ } from 'observables/window'
import { map, mergeMap, Observable, of, throwError } from 'rxjs'
import { ExternalProvider, Web3ProviderId } from 'types'
import { Network as EthersNetwork } from '@ethersproject/networks'

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
        config: EthersNetwork & {
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
            // chainId: `0x${(56).toString(16)}`,
            chainId: 56,
            name: 'Binance Smart Chain Mainnet',
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
            // chainId: `0x${(97).toString(16)}`,
            chainId: 97,
            name: 'Smart Chain Testnet',
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
            // chainId: `0x${(31337).toString(16)}`,
            chainId: 31337,
            name: 'Local',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
            },
            rpcUrls: ['http://localhost:8545'],
        },
    },
}

const CustomEndpoints: { [network in Network]: string[] } = {
    [Network.Mainnet]: [
        'https://bsc-dataseed.binance.org',
        'https://bsc-dataseed1.defibit.io',
        'https://bsc-dataseed1.ninicoin.io',
        'https://bsc-dataseed2.defibit.io',
        'https://bsc-dataseed3.defibit.io',
        'https://bsc-dataseed4.defibit.io',
        'https://bsc-dataseed2.ninicoin.io',
        'https://bsc-dataseed3.ninicoin.io',
        'https://bsc-dataseed4.ninicoin.io',
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org',
        'https://bsc-dataseed3.binance.org',
        'https://bsc-dataseed4.binance.org',
    ],
    [Network.Testnet]: [
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/',
        'https://data-seed-prebsc-2-s2.binance.org:8545/',
        'https://data-seed-prebsc-1-s3.binance.org:8545/',
        'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ],
    [Network.Local]: ['http://127.0.0.1:8545'],
}

export const web3Config = {
    Web3Providers,
    Chains,
    Network: Network.Testnet,
    CustomEndpoints,
}
