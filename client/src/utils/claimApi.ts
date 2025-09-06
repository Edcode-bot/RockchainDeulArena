// Claim API utilities for daily streaks and referral rewards

export interface ClaimResult {
  success: boolean;
  message: string;
  pointsEarned: number;
  newStreak?: number;
  referrer?: string;
  nextClaimAt?: string;
  error?: string;
}

// Daily claim handler
export async function handleDailyClaim(address: string): Promise<ClaimResult> {
  try {
    const response = await fetch('/api/claim/daily', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature: 'mock_signature', // Replace with actual wallet signature
        message: `RockChain daily claim: ${address} @ ${Date.now()}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Daily claim failed',
        pointsEarned: 0,
        error: data.error,
        nextClaimAt: data.nextClaimAt
      };
    }

    return {
      success: true,
      message: data.message,
      pointsEarned: data.pointsEarned,
      newStreak: data.newStreak
    };
  } catch (error) {
    console.error('Daily claim error:', error);
    return {
      success: false,
      message: 'Network error occurred',
      pointsEarned: 0,
      error: 'Network error'
    };
  }
}

// Referral claim handler
export async function handleReferralClaim(address: string, referrer: string): Promise<ClaimResult> {
  try {
    const response = await fetch('/api/claim/referral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        referrer,
        signature: 'mock_signature', // Replace with actual wallet signature
        message: `RockChain referral claim: ${address} from ${referrer} @ ${Date.now()}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Referral claim failed',
        pointsEarned: 0,
        error: data.error
      };
    }

    return {
      success: true,
      message: data.message,
      pointsEarned: data.pointsEarned,
      referrer: data.referrer
    };
  } catch (error) {
    console.error('Referral claim error:', error);
    return {
      success: false,
      message: 'Network error occurred',
      pointsEarned: 0,
      error: 'Network error'
    };
  }
}