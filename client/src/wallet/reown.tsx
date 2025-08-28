
import { createAppKit } from '@reown/appkit/react'
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
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if wallet is already connected
        const walletInfo = modal?.getWalletInfo()
        if (walletInfo) {
          setIsConnected(true)
          setAddress(walletInfo.address || null)
        }

        // Listen to modal events
        modal?.subscribeState((state: any) => {
          if (state.open === false && state.selectedNetworkId) {
            // Modal closed and network selected
            updateWalletState()
          }
        })

        // Check for existing connection
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

    const updateWalletState = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum as any)
          const accounts = await provider.listAccounts()
          
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0].address)
            
            const balance = await provider.getBalance(accounts[0].address)
            setBalance(ethers.formatEther(balance))
          } else {
            setIsConnected(false)
            setAddress(null)
            setBalance(null)
          }
        }
      } catch (error) {
        console.error('Failed to update wallet state:', error)
      }
    }

    checkConnection()

    // Set up event listeners for wallet changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          updateWalletState()
        } else {
          setAddress(null)
          setIsConnected(false)
          setBalance(null)
        }
      }

      const handleChainChanged = () => {
        updateWalletState()
      }

      (window.ethereum as any).on('accountsChanged', handleAccountsChanged)
      (window.ethereum as any).on('chainChanged', handleChainChanged)

      return () => {
        if (window.ethereum) {
          (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged)
          (window.ethereum as any).removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [])

  const connect = async () => {
    try {
      // Open the Reown AppKit modal
      await modal?.open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      await modal?.disconnect()
      setIsConnected(false)
      setAddress(null)
      setBalance(null)
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
