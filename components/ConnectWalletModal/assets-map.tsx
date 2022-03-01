import { Web3ProviderId } from 'types'
import binanceChain from 'assets/wallet-providers/binance-logo.svg'
import metamask from 'assets/wallet-providers/metamask-logo.svg'
import safePal from 'assets/wallet-providers/safe-pal-logo.svg'
import trust from 'assets/wallet-providers/trust-wallet-logo.svg'

export const connectWalletModalAssetsMap: { [key in Web3ProviderId]: any } = {
    binanceChain,
    metamask,
    safePal,
    trust,
}
