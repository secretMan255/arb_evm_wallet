// chain id (decimal) for Arbitrum Sepolia testnet, ethers usually work with the numeric form
export const ARB_SEPOLIA_CHAIN_ID =
    Number(process.env.NEXT_PUBLIC_CHAIN_ID || 421614)

// chain id (hex string) for MetaMask prc methods
export const ARB_SEPOLIA_CHAIN_ID_HEX =
    process.env.NEXT_PUBLIC_CHAIN_ID_HEX || '0x66eee'

// MYRC token smart contract address on Arbitrum Sepolia
// deployed ERC-20 contract address for BLOX MYRC
// this is the contract address on the chain
export const MYRC_TOKEN_ADDRESS =
    process.env.NEXT_PUBLIC_MYRC_TOKEN_ADDRESS ||
    '0x5bd9fad99155001645b62a35f1edc5dd01609103'

// every token have different decimal (123456 / 6 = 1.23456 -> USDT)
export const MYRC_DECIMALS =
    Number(process.env.NEXT_PUBLIC_MYRC_DECIMALS || 6)

// RPC api endpoint for Arbitrum Sepolia provided by Alchemy - https://docs.arbitrum.io/build-decentralized-apps/reference/node-providers
// similar to a connection string but for the blockchain
// use for read token balance or transfer on-chain
export const ALCHEMY_RPC_URL =
    process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ''

// Network params for Arbitrum Sepolia
// if user does not have this network config, pass this connection object so MetaMask can add this network
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