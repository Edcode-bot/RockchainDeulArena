import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { celo } from '@reown/appkit/networks'
import { ethers } from 'ethers'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const projectId = '80c0422c2745dc92c537f14ad534c015'

const metadata = {
  name: 'RockChain Duel Arena',
  description: 'Onchain Gaming Platform on Celo',
  url: 'https://rockchain-duel-arena.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const ethersAdapter = new EthersAdapter()

createAppKit({
  adapters: [ethersAdapter],
  networks: [celo],
  metadata,
  projectId,
  features: {
    analytics: true
  }
})

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum as any)
          const accounts = await provider.listAccounts()
          
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0].address)
            
            const balance = await provider.getBalance(accounts[0].address)
            setBalance(ethers.formatEther(balance))
          }
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }

    checkConnection()

    if (window.ethereum) {
      (window.ethereum as any).on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        } else {
          setAddress(null)
          setIsConnected(false)
          setBalance(null)
        }
      })

      (window.ethereum as any).on('chainChanged', () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        (window.ethereum as any).removeAllListeners('accountsChanged')
        (window.ethereum as any).removeAllListeners('chainChanged')
      }
    }
  }, [])

  const connect = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as any)
        await provider.send('eth_requestAccounts', [])
        
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)
        
        setIsConnected(true)
        setAddress(address)
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
  }

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
  }
}