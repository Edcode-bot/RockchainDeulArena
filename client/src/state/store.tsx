import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface GameState {
  points: number
  nfts: string[]
  streak: number
  achievements: string[]
  profile: {
    avatar: string
    username: string
  }
  dailyReward: {
    lastClaim: string | null
    available: boolean
  }
}

interface GameAction {
  type: 'WIN_GAME' | 'CLAIM_DAILY_REWARD' | 'UPDATE_PROFILE' | 'RESET_STATE'
  payload?: any
}

const initialState: GameState = {
  points: 0,
  nfts: [],
  streak: 0,
  achievements: [],
  profile: {
    avatar: '',
    username: ''
  },
  dailyReward: {
    lastClaim: null,
    available: true
  }
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'WIN_GAME':
      const { gameType } = action.payload
      const nftUri = `ipfs://${gameType}-nft`
      
      return {
        ...state,
        points: state.points + 10,
        nfts: [...state.nfts, nftUri],
        streak: state.streak + 1,
        achievements: state.streak + 1 === 5 ? [...state.achievements, 'Win Streak 5'] : state.achievements
      }

    case 'CLAIM_DAILY_REWARD':
      const today = new Date().toDateString()
      
      return {
        ...state,
        points: state.points + 5,
        dailyReward: {
          lastClaim: today,
          available: false
        }
      }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        }
      }

    case 'RESET_STATE':
      return initialState

    default:
      return state
  }
}

const GameStateContext = createContext<{
  state: GameState
  dispatch: React.Dispatch<GameAction>
} | undefined>(undefined)

export function GameStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('gameState')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if daily reward should be available
        const today = new Date().toDateString()
        if (parsed.dailyReward.lastClaim !== today) {
          parsed.dailyReward.available = true
        }
        
        // Restore state with updated daily reward status
        Object.keys(parsed).forEach(key => {
          if (key !== 'dailyReward') {
            dispatch({ type: 'UPDATE_PROFILE', payload: { [key]: parsed[key] } })
          }
        })
      } catch (error) {
        console.error('Failed to load game state:', error)
      }
    }
  }, [])

  // Save to localStorage on state changes
  React.useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state))
  }, [state])

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider')
  }
  return context
}

// Sound effects
export function playSound(type: 'win' | 'click' | 'error') {
  try {
    const audio = new Audio()
    
    switch (type) {
      case 'win':
        // Create a simple beep sound programmatically
        const audioContext = new AudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
        break
        
      case 'click':
        // Simple click sound
        const clickContext = new AudioContext()
        const clickOscillator = clickContext.createOscillator()
        const clickGain = clickContext.createGain()
        
        clickOscillator.connect(clickGain)
        clickGain.connect(clickContext.destination)
        
        clickOscillator.frequency.value = 1000
        clickOscillator.type = 'square'
        
        clickGain.gain.setValueAtTime(0.1, clickContext.currentTime)
        clickGain.gain.exponentialRampToValueAtTime(0.01, clickContext.currentTime + 0.1)
        
        clickOscillator.start(clickContext.currentTime)
        clickOscillator.stop(clickContext.currentTime + 0.1)
        break
    }
  } catch (error) {
    console.error('Failed to play sound:', error)
  }
}
