
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

    const checkConnection = async () => {
      try {
        // Listen to AppKit state changes
        const unsubscribe = modal?.subscribeState((state: any) => {
          console.log('AppKit state changed:', state)
          
          // Check if wallet is connected via AppKit
          if (state.isConnected && state.address) {
            setIsConnected(true)
            setAddress(state.address)
            // Update balance
            if (window.ethereum) {
              updateWalletState()
            }
          } else if (!state.isConnected) {
            setIsConnected(false)
            setAddress(null)
            setBalance(null)
          }
        })

        // Check initial connection state
        const initialState = modal?.getState()
        if (initialState?.isConnected && initialState?.address) {
          setIsConnected(true)
          setAddress(initialState.address)
          updateWalletState()
        }

        // Also check for existing ethereum provider connection
        await updateWalletState()

        return unsubscribe
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }

    const unsubscribe = checkConnection()

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
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      }
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const connect = async () => {
    try {
      // Open the Reown AppKit modal
      await modal?.open()
      
      // The connection state will be handled by the subscribeState listener
      // No need to manually update state here as it will be done automatically
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
