import { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';
import { getDb } from '../../server/lib/mongodb';
import { ReferralClaimRequestSchema } from '../../server/lib/schemas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { address, referrer, signature, message } = ReferralClaimRequestSchema.parse(req.body);

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check message format
    const messagePattern = /^RockChain referral claim: 0x[a-fA-F0-9]{40} from 0x[a-fA-F0-9]{40} @ \d+$/;
    if (!messagePattern.test(message)) {
      return res.status(401).json({ error: 'Invalid message format' });
    }

    // Extract timestamp and check if recent
    const timestamp = parseInt(message.split(' @ ')[1]);
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return res.status(401).json({ error: 'Message expired' });
    }

    // Validate addresses
    const normalizedAddress = address.toLowerCase();
    const normalizedReferrer = referrer.toLowerCase();

    if (normalizedAddress === normalizedReferrer) {
      return res.status(400).json({ error: 'Cannot claim referral from yourself' });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ address: normalizedAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referrerUser = await usersCollection.findOne({ address: normalizedReferrer });
    if (!referrerUser) {
      return res.status(404).json({ error: 'Referrer not found' });
    }

    // Check if already claimed from this referrer
    const existingClaim = user.refClaims?.find(
      (claim: any) => claim.referrer.toLowerCase() === normalizedReferrer
    );

    if (existingClaim) {
      return res.status(400).json({ 
        error: 'Referral already claimed from this address',
        claimedAt: existingClaim.at
      });
    }

    // Add referral claim and award points
    const pointsReward = 10;
    const claimTime = new Date();

    await usersCollection.updateOne(
      { address: normalizedAddress },
      { 
        $push: { 
          refClaims: {
            referrer: normalizedReferrer,
            at: claimTime
          }
        },
        $inc: { 
          points: pointsReward 
        },
        $set: {
          updatedAt: claimTime
        }
      }
    );

    const updatedUser = await usersCollection.findOne({ address: normalizedAddress });
    const { _id, ...userProfile } = updatedUser!;

    return res.status(200).json({
      success: true,
      message: `Referral claim successful! +${pointsReward} points from ${referrer}`,
      pointsEarned: pointsReward,
      referrer: normalizedReferrer,
      user: userProfile
    });

  } catch (error) {
    console.error('Referral claim error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}