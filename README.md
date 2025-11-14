# 🚀 EVM Wallet — Arbitrum Sepolia Testnet
A simple EVM wallet demo built for the BLOX Engineering Assessment.  
The app allows a user to:

- Connect their MetaMask wallet  
- Ensure they are on **Arbitrum Sepolia**  
- View wallet info (address + chain id/name)  
- Read balances:
  - Native ETH  
  - MYRC ERC-20 token  
- *(Stretch goal)* Send a basic ETH transaction via MetaMask  
- Read on-chain data through **Alchemy RPC**  

Live Demo: https://arb-evm-wallet.vercel.app

---

# 📦 Tech Stack

- **Next.js 14 (React App Router)**
- **ethers.js v6**
- **MetaMask (window.ethereum)**
- **Alchemy RPC (Arbitrum Sepolia)**
- **TailwindCSS (for basic styling)**

Everything runs client-side because MetaMask only exists in the browser.

---

# ⚙️ Setup

```bash
git clone https://github.com/secretMan255/arb_evm_wallet
cd arb_evm_wallet
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_CHAIN_ID_HEX=0x66eee

NEXT_PUBLIC_MYRC_TOKEN_ADDRESS=0x5bd9fad99155001645b62a35f1edc5dd01609103
NEXT_PUBLIC_MYRC_DECIMALS=6

# Your Alchemy endpoint
NEXT_PUBLIC_ALCHEMY_RPC_URL="https://arb-sepolia.g.alchemy.com/v2/your-key"
```

Run locally:

```bash
npm run dev
```

---

# 🧠 How It Works (Friendly Explanation)

## 1. Connecting MetaMask
The dApp requests accounts using:

```ts
window.ethereum.request({ method: 'eth_requestAccounts' })
```

Before connecting, it ensures the network is **Arbitrum Sepolia**.

If not, it auto-switches using:

```ts
wallet_switchEthereumChain
```

If MetaMask does not have the chain, it auto-adds it using:

```ts
wallet_addEthereumChain
```

---

## 2. Reading Chain & Wallet Info

- `ethers.BrowserProvider` reads chainId  
- address stored in React state  
- UI shows address + chain name  

---

## 3. Reading ETH Balance

Uses Alchemy RPC:

```ts
const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL)
const balance = await provider.getBalance(account)
```

---

## 4. Reading MYRC Token Balance

Uses ERC-20 ABI:

```ts
const myrc = new ethers.Contract(MYRC_TOKEN_ADDRESS, ERC20_ABI, provider)
const raw = await myrc.balanceOf(account)
```

Converted using decimals (MYRC = 6):

```ts
ethers.formatUnits(raw, 6)
```

---

## 5. Sending ETH Transaction (Stretch Goal)

```ts
window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{ from, to, value }]
})
```

MetaMask:

- signs  
- broadcasts  
- updates balance  

---

# 📁 Project Structure

```
app/
 └─ page.tsx
lib/
 ├─ config.ts
 └─ erc20.ts
```

---

# 🧩 Key Decisions & Trade-offs

### 1. ethers.js over web3.js
Cleaner, modern, smaller.

### 2. Client-only Web3
MetaMask works only in browser.

### 3. Alchemy RPC
More reliable than public RPC.

### 4. Minimal ERC-20 ABI
Only necessary functions.

### 5. No backend
Simplifies architecture.

---

# 🧠 Assumptions

- Only MetaMask is required  
- Only MYRC token on Sepolia  
- No need for transaction history  
- No backend storage  
- Alchemy RPC available  

---

# 🚀 If I Had One More Week…

- Add more chain connection, eg: cardano, solana
- Transaction history  
