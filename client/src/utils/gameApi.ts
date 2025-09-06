// Simple game API utilities for standalone system
// No blockchain transactions - just local state management

export interface GameResult {
  gameId: string;
  result: 'win' | 'lose' | 'draw';
  points: number;
  nftUri?: string;
}

// Simple game result handler for local state
export async function handleGameResult(
  gameId: string,
  result: 'win' | 'lose' | 'draw',
  address?: string
): Promise<GameResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const points = result === 'win' ? 10 : result === 'draw' ? 2 : 0;
  let nftUri: string | undefined;
  
  // Award NFT URI for wins
  if (result === 'win') {
    const nftUris: Record<string, string> = {
      'rps': 'ipfs://rps-nft',
      'coin': 'ipfs://coin-nft', 
      'dice': 'ipfs://dice-nft',
      'guess': 'ipfs://guess-nft',
      'tictactoe': 'ipfs://tictactoe-nft',
      'blackjack': 'ipfs://blackjack-nft',
      'memory': 'ipfs://memory-nft',
      '2048': 'ipfs://2048-nft',
      'reaction': 'ipfs://reaction-nft',
      'scramble': 'ipfs://scramble-nft'
    };
    nftUri = nftUris[gameId];
  }
  
  return {
    gameId,
    result,
    points,
    nftUri
  };
}

// Helper to play sound effects
export function playSound(soundType: 'click' | 'win' | 'lose' | 'draw') {
  // Simple sound simulation with console log for now
  // In a real app, you'd use Howler or Web Audio API
  console.log(`🔊 Playing ${soundType} sound`);
}