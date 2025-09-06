import { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';
import { getDb } from '../../server/lib/mongodb';
import { AuthRequestSchema, InsertUserSchema, UpdateUserSchema } from '../../server/lib/schemas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { address, signature, message, username } = AuthRequestSchema.parse(req.body);

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check message format (should be recent)
    const messagePattern = /^RockChain auth: 0x[a-fA-F0-9]{40} @ \d+$/;
    if (!messagePattern.test(message)) {
      return res.status(401).json({ error: 'Invalid message format' });
    }

    // Extract timestamp and check if it's recent (within 5 minutes)
    const timestamp = parseInt(message.split(' @ ')[1]);
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return res.status(401).json({ error: 'Message expired' });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    const normalizedAddress = address.toLowerCase();

    // Check if user exists
    const existingUser = await usersCollection.findOne({ address: normalizedAddress });

    let user;
    if (existingUser) {
      // Update existing user
      const updateData = UpdateUserSchema.parse({
        ...(username && { username }),
        updatedAt: new Date()
      });

      await usersCollection.updateOne(
        { address: normalizedAddress },
        { $set: updateData }
      );

      user = await usersCollection.findOne({ address: normalizedAddress });
    } else {
      // Create new user
      const newUser = InsertUserSchema.parse({
        address: normalizedAddress,
        username: username || `Player_${address.slice(-6)}`,
        points: 0,
        nfts: [],
        streak: 0,
        rank: 0,
        refClaims: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await usersCollection.insertOne(newUser);
      user = await usersCollection.findOne({ _id: result.insertedId });
    }

    // Remove sensitive data and return user profile
    const { _id, ...userProfile } = user!;
    
    return res.status(200).json({
      success: true,
      user: userProfile
    });

  } catch (error) {
    console.error('User upsert error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}