import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Gift, 
  Zap, 
  TrendingUp, 
  Calendar,
  Gamepad2
} from "lucide-react";

export default function Dashboard() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();

  const handleClaimDailyReward = () => {
    if (state.dailyReward.available) {
      dispatch({ type: 'CLAIM_DAILY_REWARD' });
      playSound('win');
      toast({
        title: "Daily Reward Claimed! 🎉",
        description: "You earned 5 points! Come back tomorrow for more.",
      });
    }
  };

  const games = [
    {
      title: "Rock Paper Scissors",
      description: "Quick classic duel",
      path: "/rps",
      icon: "/images/rps.jpg",
      gradient: "from-primary to-accent",
      difficulty: "Easy"
    },
    {
      title: "Tic Tac Toe",
      description: "Strategic grid battle",
      path: "/tictactoe",
      icon: "/images/tictactoe.jpg",
      gradient: "from-accent to-secondary",
      difficulty: "Medium"
    },
    {
      title: "Guess Number",
      description: "Pure luck challenge",
      path: "/guessnumber",
      icon: "/images/guess.jpg",
      gradient: "from-secondary to-primary",
      difficulty: "Hard"
    },
    {
      title: "Coin Flip",
      description: "Instant 50/50 duel",
      path: "/coinflip",
      icon: "/images/coin.jpg",
      gradient: "from-accent to-primary",
      difficulty: "Easy"
    },
    {
      title: "Dice Roll",
      description: "Classic 1-6 prediction",
      path: "/diceroll",
      icon: "/images/dice.jpg",
      gradient: "from-primary to-secondary",
      difficulty: "Medium"
    },
    {
      title: "Blackjack Lite",
      description: "Player vs dealer; basic hit/stand",
      icon: "https://cdn.pixabay.com/photo/2013/07/13/12/42/cards-161633_1280.png",
      gradient: "from-primary to-accent",
      tag: "Advanced",
      path: "/blackjack",
      difficulty: "Advanced"
    },
    {
      title: "Memory Match",
      description: "Flip card pairs; timer & move count",
      icon: "https://cdn.pixabay.com/photo/2017/08/07/06/24/brain-2603880_1280.jpg",
      gradient: "from-accent to-secondary",
      tag: "Advanced",
      path: "/memory",
      difficulty: "Advanced"
    },
    {
      title: "2048 Lite",
      description: "4×4 swipe/keyboard merges",
      icon: "https://cdn.pixabay.com/photo/2016/11/29/07/16/tiles-1868010_1280.jpg",
      gradient: "from-secondary to-primary",
      tag: "Advanced",
      path: "/2048",
      difficulty: "Advanced"
    },
    {
      title: "Reaction Time",
      description: "Wait for green, click fast",
      icon: "https://cdn.pixabay.com/photo/2017/08/10/02/05/user-2619835_1280.png",
      gradient: "from-accent to-primary",
      tag: "Advanced",
      path: "/reaction",
      difficulty: "Advanced"
    },
    {
      title: "Word Scramble",
      description: "Scramble 5-letter words; 3 hints; timer",
      icon: "https://cdn.pixabay.com/photo/2016/11/19/14/00/codex-1835964_1280.jpg",
      gradient: "from-primary to-secondary",
      tag: "Advanced",
      path: "/scramble",
      difficulty: "Advanced"
    }
  ];

  // Animated text component (slowed down)
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Slowed down from 0.05
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const splitText = (text) => {
    return text.split("");
  };

  const AnimatedText = ({ text, className }) => (
    <motion.div className="overflow-hidden">
      <div className="flex">
        {splitText(text).map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ scale: 1.1, rotate: 3, y: -3 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <AnimatedText text="Welcome to RockChain" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your duel and start earning rewards!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {[
            { label: "Points", value: state.points, icon: Trophy, color: "primary" },
            { label: "NFTs", value: state.nfts.length, icon: Gift, color: "accent" },
            { label: "Streak", value: state.streak, icon: Zap, color: "secondary" },
            { label: "Rank", value: "#42", icon: TrendingUp, color: "foreground" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 text-${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Reward */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Calendar className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Daily Reward</h3>
                    <p className="text-muted-foreground">
                      {state.dailyReward.available ? "Claim your 5 points!" : "Come back tomorrow!"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleClaimDailyReward}
                  disabled={!state.dailyReward.available}
                  className={state.dailyReward.available ? "connect-btn" : ""}
                  data-testid="button-daily-reward"
                >
                  {state.dailyReward.available ? "Claim Now" : "Claimed"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Games Grid */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              <AnimatedText text="Choose Your Duel" />
            </h2>
            <Link href="/leaderboard" data-testid="link-leaderboard">
              <Button variant="outline" size="sm">
                View Leaderboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link href={game.path} data-testid={`link-game-${index}`}>
                  <div
                    className="game-card rounded-xl p-6 cursor-pointer group relative overflow-hidden"
                    onClick={() => playSound('click')}
                  >
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden">
                        <img src={game.icon} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-accent font-semibold">+10 points</span>
                        <span className="text-sm text-muted-foreground">+ NFT</span>
                      </div>
                      <motion.div
                        className="text-muted-foreground group-hover:text-accent transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Gamepad2 className="h-5 w-5" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle><AnimatedText text="Recent Activity" /></CardTitle>
            </CardHeader>
            <CardContent>
              {state.nfts.length > 0 ? (
                <div className="space-y-3">
                  {state.nfts.slice(-3).map((nft, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          🏆
                        </div>
                        <div>
                          <p className="font-semibold">Game Won!</p>
                          <p className="text-xs text-muted-foreground">NFT earned: {nft}</p>
                        </div>
                      </div>
                      <Badge>+10 pts</Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gamepad2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start playing to see your activity here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}