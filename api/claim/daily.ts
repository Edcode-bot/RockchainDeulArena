import { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';
import { getDb } from '../../server/lib/mongodb';
import { DailyClaimRequestSchema } from '../../server/lib/schemas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { address, signature, message } = DailyClaimRequestSchema.parse(req.body);

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check message format
    const messagePattern = /^RockChain daily claim: 0x[a-fA-F0-9]{40} @ \d+$/;
    if (!messagePattern.test(message)) {
      return res.status(401).json({ error: 'Invalid message format' });
    }

    // Extract timestamp and check if recent
    const timestamp = parseInt(message.split(' @ ')[1]);
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return res.status(401).json({ error: 'Message expired' });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    const normalizedAddress = address.toLowerCase();
    const user = await usersCollection.findOne({ address: normalizedAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already claimed today (24 hour cooldown)
    const now24Hours = new Date();
    const yesterday = new Date(now24Hours.getTime() - 24 * 60 * 60 * 1000);

    if (user.lastDailyClaimAt && new Date(user.lastDailyClaimAt) > yesterday) {
      const nextClaimTime = new Date(user.lastDailyClaimAt.getTime() + 24 * 60 * 60 * 1000);
      return res.status(400).json({ 
        error: 'Daily claim already used',
        nextClaimAt: nextClaimTime.toISOString()
      });
    }

    // Update user with daily claim reward
    const pointsReward = 5;
    const newStreak = (user.lastDailyClaimAt && 
      new Date(user.lastDailyClaimAt) > new Date(now24Hours.getTime() - 48 * 60 * 60 * 1000)) 
      ? (user.streak || 0) + 1 
      : 1;

    await usersCollection.updateOne(
      { address: normalizedAddress },
      { 
        $set: { 
          lastDailyClaimAt: now24Hours,
          streak: newStreak,
          updatedAt: now24Hours
        },
        $inc: { 
          points: pointsReward 
        }
      }
    );

    const updatedUser = await usersCollection.findOne({ address: normalizedAddress });
    const { _id, ...userProfile } = updatedUser!;

    return res.status(200).json({
      success: true,
      message: `Daily claim successful! +${pointsReward} points`,
      pointsEarned: pointsReward,
      newStreak: newStreak,
      user: userProfile
    });

  } catch (error) {
    console.error('Daily claim error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}