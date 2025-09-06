import { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';
import { getDb } from '../../server/lib/mongodb';
import { GameResultRequestSchema, InsertGameResultSchema } from '../../server/lib/schemas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request body
    const { address, gameId, result, betAmount, txHash, signature, message } = GameResultRequestSchema.parse(req.body);

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Check message format
    const messagePattern = /^RockChain game result: [a-z0-9]+ (win|loss|draw) @ \d+$/;
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
    const gamesCollection = db.collection('games');

    const normalizedAddress = address.toLowerCase();
    const user = await usersCollection.findOne({ address: normalizedAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate points and NFT URI based on result
    let pointsDelta = 0;
    let nftUri: string | undefined;

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

    if (result === 'win') {
      pointsDelta = 10;
      nftUri = nftUris[gameId];
    } else if (result === 'draw') {
      pointsDelta = 2;
    }

    // Record game result
    const gameResult = InsertGameResultSchema.parse({
      address: normalizedAddress,
      gameId: gameId as any,
      result: result === 'loss' ? 'loss' : result,
      betAmount,
      txHash,
      pointsDelta,
      nftUri,
      createdAt: new Date()
    });

    await gamesCollection.insertOne(gameResult);

    // Update user points and NFTs
    const updateData: any = {
      $inc: { points: pointsDelta },
      $set: { updatedAt: new Date() }
    };

    if (nftUri && !user.nfts?.includes(nftUri)) {
      updateData.$push = { nfts: nftUri };
    }

    await usersCollection.updateOne(
      { address: normalizedAddress },
      updateData
    );

    const updatedUser = await usersCollection.findOne({ address: normalizedAddress });
    const { _id, ...userProfile } = updatedUser!;

    return res.status(200).json({
      success: true,
      gameResult,
      pointsEarned: pointsDelta,
      nftEarned: nftUri,
      user: userProfile
    });

  } catch (error) {
    console.error('Game result error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}