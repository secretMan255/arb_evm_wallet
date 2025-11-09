export const ARB_SEPOLIA_CHAIN_ID =
    Number(process.env.NEXT_PUBLIC_CHAIN_ID || 421614)

export const ARB_SEPOLIA_CHAIN_ID_HEX =
    process.env.NEXT_PUBLIC_CHAIN_ID_HEX || '0x66eee'

export const MYRC_TOKEN_ADDRESS =
    process.env.NEXT_PUBLIC_MYRC_TOKEN_ADDRESS ||
    '0x5bd9fad99155001645b62a35f1edc5dd01609103'

export const MYRC_DECIMALS =
    Number(process.env.NEXT_PUBLIC_MYRC_DECIMALS || 6)

export const ALCHEMY_RPC_URL =
    process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ''

export const ARB_SEPOLIA_PARAMS = {
    chainId: ARB_SEPOLIA_CHAIN_ID_HEX,
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: {
        name: 'Arbitrum Sepolia ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io'],
}