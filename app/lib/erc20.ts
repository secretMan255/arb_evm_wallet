// ERC-20 ABI used by ethers.js when interacting with a token contrack
// ABI stand for Application Binary Interface is like an 'API description' for a smart contract
// tells ethers which funtions exists on the contract like params and thier response
// Provide the token contract address and ethers can generate a contrack instance let us call functions such as balanceOf, transfer
export const ERC20_ABI = [
    // return token symbol. eg: USDT, ETH, BTC, SOL
    'function symbol() view returns (string)',
    // return the token number of decimal which used by the token
    'function decimals() view returns (uint8)',
    // convert decimal the human-readable amount 
    'function balanceOf(address owner) view returns (uint256)',
    // send amount of token from the connected signer to 'to'
    'function transfer(address to, uint256 amount) returns (bool)',
]