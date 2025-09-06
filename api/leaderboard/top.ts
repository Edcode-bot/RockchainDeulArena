import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../server/lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userAddress } = req.query;
    
    const db = await getDb();
    const usersCollection = db.collection('users');

    // Get top 10 users by points
    const topUsers = await usersCollection
      .find({}, { projection: { _id: 0, address: 1, username: 1, points: 1, streak: 1, nfts: 1 } })
      .sort({ points: -1, createdAt: 1 })
      .limit(10)
      .toArray();

    // Add rank to top users
    const leaderboard = topUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    let userRank = null;
    if (userAddress && typeof userAddress === 'string') {
      const normalizedUserAddress = userAddress.toLowerCase();
      
      // Find user's rank
      const userRankResult = await usersCollection
        .aggregate([
          { $sort: { points: -1, createdAt: 1 } },
          { $group: { _id: null, users: { $push: '$$ROOT' } } },
          { $unwind: { path: '$users', includeArrayIndex: 'rank' } },
          { $match: { 'users.address': normalizedUserAddress } },
          { $project: { rank: { $add: ['$rank', 1] }, user: '$users' } }
        ])
        .toArray();

      if (userRankResult.length > 0) {
        userRank = {
          rank: userRankResult[0].rank,
          user: {
            address: userRankResult[0].user.address,
            username: userRankResult[0].user.username,
            points: userRankResult[0].user.points,
            streak: userRankResult[0].user.streak,
            nfts: userRankResult[0].user.nfts || []
          }
        };
      }
    }

    return res.status(200).json({
      success: true,
      leaderboard,
      userRank
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}