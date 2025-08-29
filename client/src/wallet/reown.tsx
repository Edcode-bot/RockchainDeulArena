import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { celo } from '@reown/appkit/networks'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
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

// Create AppKit with proper configuration
const modal = createAppKit({
  adapters: [ethersAdapter],
  networks: [celo],
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: []
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#00D2FF',
    '--w3m-color-mix-strength': 20
  }
})

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  openModal: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }): JSX.Element {
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const [balance, setBalance] = useState<string | null>(null)

  // Update balance when wallet connects
  useEffect(() => {
    const updateBalance = async () => {
      if (isConnected && address && walletProvider) {
        try {
          const provider = new ethers.BrowserProvider(walletProvider)
          const balance = await provider.getBalance(address)
          setBalance(ethers.formatEther(balance))
        } catch (error) {
          console.error('Failed to fetch balance:', error)
          setBalance(null)
        }
      } else {
        setBalance(null)
      }
    }

    updateBalance()
  }, [isConnected, address, walletProvider])

  const connect = async () => {
    try {
      await modal?.open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      await modal?.disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const openModal = () => {
    modal?.open()
  }

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      balance,
      connect,
      disconnect,
      openModal
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

// Export the modal for direct use
export { modal }

declare global {
  interface Window {
    ethereum?: any
  }
}