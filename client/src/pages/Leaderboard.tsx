import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Trophy, 
  Crown, 
  Medal, 
  Award,
  TrendingUp,
  Users
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  nfts: number;
  streak: number;
  isCurrentUser?: boolean;
}

export default function Leaderboard() {
  const { state } = useGameState();
  const { address } = useWallet();

  // Mock leaderboard data - in a real app this would come from an API
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, username: "RockChain_Master", points: 2450, nfts: 245, streak: 42 },
    { rank: 2, username: "CeloGamer_Pro", points: 2180, nfts: 218, streak: 35 },
    { rank: 3, username: "NFT_Hunter_254", points: 1890, nfts: 189, streak: 28 },
    { rank: 4, username: "DuelKing_UG", points: 1670, nfts: 167, streak: 23 },
    { rank: 5, username: "CoinFlip_Legend", points: 1520, nfts: 152, streak: 19 },
    { rank: 6, username: "Dice_Prophet", points: 1340, nfts: 134, streak: 16 },
    { rank: 7, username: "TicTac_Sage", points: 1180, nfts: 118, streak: 14 },
    { rank: 8, username: "Number_Oracle", points: 980, nfts: 98, streak: 12 },
    { rank: 9, username: "Gaming_Wizard", points: 820, nfts: 82, streak: 9 },
    { rank: 10, username: "Chain_Warrior", points: 670, nfts: 67, streak: 7 },
  ];

  // Add current user to leaderboard if they have points
  const currentUserRank = 42; // Mock rank
  const currentUserEntry: LeaderboardEntry = {
    rank: currentUserRank,
    username: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "You",
    points: state.points,
    nfts: state.nfts.length,
    streak: state.streak,
    isCurrentUser: true
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return "default";
    if (rank <= 10) return "secondary";
    return "outline";
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" data-testid="link-back">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black">Leaderboard</h1>
              <p className="text-muted-foreground">Top players in RockChain</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Rank</p>
                    <p className="text-2xl font-bold text-primary" data-testid="text-user-rank">#{currentUserRank}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Points</p>
                    <p className="text-2xl font-bold text-accent" data-testid="text-user-points">{state.points}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Players</p>
                    <p className="text-2xl font-bold text-secondary">170</p>
                  </div>
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Top Score</p>
                    <p className="text-2xl font-bold text-foreground">2,450</p>
                  </div>
                  <Crown className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🏆 Top Champions 🏆</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {leaderboardData.slice(0, 3).map((player, index) => (
                  <motion.div
                    key={player.rank}
                    className={`text-center p-4 rounded-lg ${
                      player.rank === 1 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' 
                        : player.rank === 2
                        ? 'bg-gradient-to-br from-gray-400/20 to-slate-400/20 border border-gray-400/30'
                        : 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-600/30'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    data-testid={`podium-${player.rank}`}
                  >
                    <div className="mb-3">
                      {getRankIcon(player.rank)}
                    </div>
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarFallback className="text-lg font-bold">
                        {getInitials(player.username)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-sm mb-1">{player.username}</h3>
                    <p className="text-2xl font-black text-primary mb-1">{player.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{player.nfts} NFTs</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((player, index) => (
                  <motion.div
                    key={player.rank}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    data-testid={`player-${player.rank}`}
                  >
                    <div className="flex items-center space-x-4">
                      <Badge variant={getRankBadgeVariant(player.rank)} className="min-w-[2.5rem]">
                        #{player.rank}
                      </Badge>
                      <Avatar>
                        <AvatarFallback>{getInitials(player.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{player.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.nfts} NFTs • {player.streak} streak
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{player.points.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </motion.div>
                ))}

                {/* Current User if not in top 10 */}
                {state.points > 0 && (
                  <>
                    <div className="flex items-center justify-center py-2">
                      <div className="text-muted-foreground text-sm">...</div>
                    </div>
                    
                    <motion.div
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      data-testid="current-user-entry"
                    >
                      <div className="flex items-center space-x-4">
                        <Badge variant="default" className="min-w-[2.5rem]">
                          #{currentUserEntry.rank}
                        </Badge>
                        <Avatar>
                          <AvatarFallback>{getInitials(currentUserEntry.username)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{currentUserEntry.username} (You)</p>
                          <p className="text-sm text-muted-foreground">
                            {currentUserEntry.nfts} NFTs • {currentUserEntry.streak} streak
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{currentUserEntry.points.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Climb the Ranks!</h3>
              <p className="text-muted-foreground mb-4">
                Play more games to earn points and climb up the leaderboard
              </p>
              <Link href="/dashboard">
                <Button className="connect-btn" data-testid="button-play-now">
                  Play Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
