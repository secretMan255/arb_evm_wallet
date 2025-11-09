'use client'

import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import {
  ARB_SEPOLIA_CHAIN_ID,
  ARB_SEPOLIA_CHAIN_ID_HEX,
  ARB_SEPOLIA_PARAMS,
  MYRC_TOKEN_ADDRESS,
  MYRC_DECIMALS,
  ALCHEMY_RPC_URL,
} from './lib/config'
import { ERC20_ABI } from './lib/erc20'

declare global {
  interface Window {
    ethereum?: any;
  }
}

type WalletState = {
  account: string
  chainId?: number
  ethBalance?: string
  myrcBalance?: string
}

export default function Home() {
  const [wallet, setWallet] = useState<WalletState>({ account: '' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [txTo, setTxTo] = useState('')
  const [txAmount, setTxAmount] = useState('0.001')

  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts.length) {
        setWallet({ account: '' })
      } else {
        loadWalletState(accounts[0]);
      }
    }

    const handleChainChanged = () => {
      if (wallet.account) loadWalletState(wallet.account)
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      if (!window.ethereum) return
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  }, [wallet.account])

  const ensureArbSepolia = async () => {
    const provider = window.ethereum
    if (!provider) throw new Error('MetaMask is not install')

    const currentChainId = await provider.request({ method: 'eth_chainId' })
    if (currentChainId === ARB_SEPOLIA_CHAIN_ID_HEX) return

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARB_SEPOLIA_CHAIN_ID_HEX }],
      })
    } catch (err: any) {
      if (err.code === 4902 || err.message?.includes('Unrecognized chain ID')) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [ARB_SEPOLIA_PARAMS]
        })
      } else {
        throw err
      }
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus('Please install MetaMask. https://metamask.io/download')
        return
      }

      setLoading(true)
      setStatus('Connecting ...')

      await ensureArbSepolia()

      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts.length) throw new Error('Account not obtained')

      await loadWalletState(accounts[0])

      setStatus('Wallet connected')

    } catch (err: any) {
      setStatus(`Failed to connect: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({ account: '' })
    setTxTo('')
    setTxAmount('0.001')
    setStatus('Wallet disconnect')
  }

  const loadWalletState = async (account: string) => {
    if (!window.ethereum) return

    const browserProvider = new ethers.BrowserProvider(window.ethereum)
    const network = await browserProvider.getNetwork()

    // use alchemy or arb sepolia prc read chain status
    const rpcUrl: string = ALCHEMY_RPC_URL || ''
    const alchemyProvider = new ethers.JsonRpcProvider(rpcUrl)

    // balance
    const ethBalanceBN = await alchemyProvider.getBalance(account)
    const ethBalance = ethers.formatEther(ethBalanceBN)

    // myrc balance
    const myrc = new ethers.Contract(MYRC_TOKEN_ADDRESS, ERC20_ABI, alchemyProvider)
    const myrcRaw = await myrc.balanceOf(account)
    const myrcBalance = ethers.formatUnits(myrcRaw, MYRC_DECIMALS)

    setWallet({
      account,
      chainId: Number(network.chainId),
      ethBalance,
      myrcBalance
    })
  }

  const sendTx = async () => {
    try {
      if (!window.ethereum) {
        setStatus('Please install MetaMask. https://metamask.io/download')
        return
      }

      if (!wallet.account) {
        setStatus('Please connect wallet')
        return
      }

      setLoading(true)
      setStatus('Sending transaction ...')

      await ensureArbSepolia()

      const value = ethers.parseEther(txAmount)

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.account,
            to: txTo,
            value: ethers.toBeHex(value),
            chainId: ARB_SEPOLIA_CHAIN_ID_HEX
          }
        ]
      })

      setStatus('Transaction sent')
    } catch (err: any) {
      setStatus(`Failed to send transaction: ${err.message || err}`)
    } finally {
      setLoading(false)
      if (wallet.account) {
        loadWalletState(wallet.account)
      }
    }

  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className='w-full max-w-2xl bg-slate-900/70 border border-slate-700 rounded-2xl p-6 space-y-4'>

        <div className='flex flex-row gap-5'>
          <h1 className='text-lg'>EVM Wallet (Arbitrum Sepolia Testnet)</h1>

          <button
            onClick={connectWallet}
            disabled={loading}
            className="text-md px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50"
          >
            {wallet.account ? 'Reconnect wallet' : 'Connect MetaMask'}
          </button>
          <button
            onClick={disconnectWallet}
            disabled={loading || !wallet.account}
            className='text-md px-2 py-1 rounded-lg bg-red-500 hover:bg-red-400 disabled:opacity-50'
          >
            Disconnect
          </button>
        </div>

        {status && (
          <div className="text-xs text-slate-300 bg-slate-800/70 px-3 py-2 rounded-lg">
            {status}
          </div>
        )}

        {wallet.account && (
          <div className="space-y-3 mt-2">
            <div>
              <div className="text-xs text-slate-400">Wallet Address</div>
              <div className="font-mono text-sm break-all">
                {wallet.account}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-800/70 p-3 rounded-xl">
                <div className="text-xs text-slate-400">Network</div>
                <div>
                  {wallet.chainId === ARB_SEPOLIA_CHAIN_ID
                    ? 'Arbitrum Sepolia'
                    : wallet.chainId || 'Unknow'}
                </div>
              </div>
              <div className="bg-slate-800/70 p-3 rounded-xl">
                <div className="text-xs text-slate-400">ETH Balance</div>
                <div>{wallet.ethBalance ?? '-'}</div>
              </div>
              <div className="bg-slate-800/70 p-3 rounded-xl col-span-2">
                <div className="text-xs text-slate-400">MYRC Balance</div>
                <div>{wallet.myrcBalance ?? '-'}</div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-700 pt-3 space-y-2">
              <div className="text-sm font-medium text-slate-200">
                Send Test ETH (Stretch)
              </div>
              <input
                type="text"
                placeholder="Receive Address (Arb Sepolia)"
                value={txTo}
                onChange={(e) => setTxTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs"
                />
                <button
                  onClick={sendTx}
                  disabled={loading || !txTo}
                  className="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-xs disabled:opacity-40"
                >
                  SEND
                </button>
              </div>
              <p className="text-[12px] text-slate-500">
                Note: Please ensure that the current MetaMask network is Arbitrum Sepolia and that it is using your Alchemy RPC node.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
