// Game API utilities with Divvi integration and MongoDB persistence

export interface GameResult {
  gameId: string;
  result: 'win' | 'lose' | 'draw';
  points: number;
  nftUri?: string;
  txHash?: string;
}

// Handle game result with optional Divvi transaction
export async function handleGameResult(
  gameId: string,
  result: 'win' | 'lose' | 'draw',
  address: string,
  betAmount?: string,
  txHash?: string
): Promise<GameResult> {
  try {
    const response = await fetch('/api/game/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        gameId,
        result,
        betAmount,
        txHash,
        signature: 'mock_signature', // Replace with actual wallet signature
        message: `RockChain game result: ${gameId} ${result} @ ${Date.now()}`
      }),
    });

    if (!response.ok) {
      throw new Error(`Game result failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      gameId,
      result,
      points: data.pointsEarned || 0,
      nftUri: data.nftEarned || undefined,
      txHash: data.gameResult?.txHash
    };
  } catch (error) {
    console.error('Game result error:', error);
    throw error;
  }
}

// Helper to play sound effects
export function playSound(soundType: 'click' | 'win' | 'lose' | 'draw') {
  // Simple sound simulation with console log for now
  // In a real app, you'd use Howler or Web Audio API
  console.log(`🔊 Playing ${soundType} sound`);
}