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

// Custom hook for mouse position for magnetic effects  
const useMousePosition = () => {  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });  

  useEffect(() => {  
    const updateMousePosition = (e) => {  
      setMousePosition({ x: e.clientX, y: e.clientY });  
    };  

    window.addEventListener('mousemove', updateMousePosition);  

    return () => {  
      window.removeEventListener('mousemove', updateMousePosition);  
    };  
  }, []);  

  return mousePosition;  
};  

// Magnetic component wrapper  
const Magnetic = ({ children, strength = 0.1 }) => {  
  const mouse = useMousePosition();  

  return (  
    <motion.div  
      style={{  
        position: 'relative',  
      }}  
      animate={{  
        x: mouse.x * strength,  
        y: mouse.y * strength,  
        rotate: mouse.x * 0.001,  
      }}  
      transition={{ type: "spring", stiffness: 300, damping: 30 }}  
    >  
      {children}  
    </motion.div>  
  );  
};  

// Smooth heading component without letter stagger
const SmoothHeading = ({ text, className }) => (  
  <motion.h1  
    className={className}  
    initial={{ opacity: 0, y: 30 }}  
    animate={{ opacity: 1, y: 0 }}  
    transition={{ duration: 0.8, ease: "easeOut" }}  
  >  
    {text}  
  </motion.h1>  
);  

export default function Dashboard() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const mouse = useMousePosition();

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
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN--ldGj66p2AeBpgzMggacd_-3vZuNqP5MhBROugSHw&s=10",
      gradient: "from-primary to-accent",
      difficulty: "Easy",
      category: "Basic",
      featured: true,
      new: false
    },
    {
      title: "Tic Tac Toe",
      description: "Strategic grid battle",
      path: "/tictactoe",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFAuleG-NX2uVBoDGPMhaiGIFGrK8nb_XpU_rVTPobeA&s=10",
      gradient: "from-accent to-secondary",
      difficulty: "Medium",
      category: "Basic",
      featured: true,
      new: false
    },
    {
      title: "Guess Number",
      description: "Pure luck challenge",
      path: "/guessnumber",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsRTwW2pokMJXwqhEIbzpSYFrMSFwNPAbCD5iI1_9sZg&s=10",
      gradient: "from-secondary to-primary",
      difficulty: "Hard",
      category: "Basic",
      featured: false,
      new: false
    },
    {
      title: "Coin Flip",
      description: "Instant 50/50 duel",
      path: "/coinflip",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4o_06ceMHb78AaiSezrVevPnv-300BVq1Q&s",
      gradient: "from-accent to-primary",
      difficulty: "Easy",
      category: "Basic",
      featured: true,
      new: false
    },
    {
      title: "Dice Roll",
      description: "Classic 1-6 prediction",
      path: "/diceroll",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxjlfFuImsgmbptALrXguWcLUFOpBnc6g7gXUpo8IPwQ&s=10",
      gradient: "from-primary to-secondary",
      difficulty: "Medium",
      category: "Basic",
      featured: false,
      new: false
    },
    {
      title: "Blackjack Lite",
      description: "Player vs dealer; basic hit/stand",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8G1_pEp0lo6GOwuvCUb3Zg0Wqry5HpG9Rjs4g_y6SoA&s=10",
      gradient: "from-primary to-accent",
      tag: "Advanced",
      path: "/blackjack",
      difficulty: "Advanced",
      category: "Advanced",
      featured: true,
      new: true
    },
    {
      title: "Memory Match",
      description: "Flip card pairs; timer & move count",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsSUtKXZdsKhY9xFixwpioGhNSpEEBpXCPmFxBMH5Nw&s=10",
      gradient: "from-accent to-secondary",
      tag: "Advanced",
      path: "/memory",
      difficulty: "Advanced",
      category: "Advanced",
      featured: false,
      new: true
    },
    {
      title: "2048 Lite",
      description: "4×4 swipe/keyboard merges",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZgus5nj6wLdyoi81zLQEiHk6pxtUkggp3jNevtE22sg&s",
      gradient: "from-secondary to-primary",
      tag: "Advanced",
      path: "/2048",
      difficulty: "Advanced",
      category: "Advanced",
      featured: true,
      new: true
    },
    {
      title: "Reaction Time",
      description: "Wait for green, click fast",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJuwRHh1v0q2-iTJBJCZEn7-6g7KA5QtB64dwQLD9lTw&s=10",
      gradient: "from-accent to-primary",
      tag: "Advanced",
      path: "/reaction",
      difficulty: "Advanced",
      category: "Advanced",
      featured: false,
      new: true
    },
    {
      title: "Word Scramble",
      description: "Scramble 5-letter words; 3 hints; timer",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnN89zLHRyEJ1drSasbsKFBa0JIRMFI9wlD3G8lUB56g&s",
      gradient: "from-primary to-secondary",
      tag: "Advanced",
      path: "/scramble",
      difficulty: "Advanced",
      category: "Advanced",
      featured: true,
      new: true
    }
  ];

  const categories = ["All", "Basic", "Advanced"];

  // Filter games based on category and search
  const filteredGames = games.filter(game => {
    if (activeCategory !== "All" && game.category !== activeCategory) return false;
    if (searchQuery && !game.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Featured games (large cards)
  const featuredGames = filteredGames.filter(g => g.featured).slice(0, 4);
  // Recent/new games
  const recentGames = filteredGames.filter(g => g.new).slice(0, 6);
  // All library with pagination
  const gamesPerPage = 6;
  const pages = Math.ceil(filteredGames.length / gamesPerPage);
  const visibleLibrary = filteredGames.slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage);

  // Auto-advance for featured carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pages);
    }, 8000);
    return () => clearInterval(interval);
  }, [pages]);

  const renderGameCard = (game, index, size = "normal") => (
    <motion.div
      key={game.path}
      className={`relative overflow-hidden rounded-xl cursor-pointer group col-span-1 ${
        size === "featured" ? "p-8" : "p-6"
      }`}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ 
        y: -10, 
        rotateY: 5, 
        scale: 1.02, 
        transition: { type: "spring", stiffness: 300 } 
      }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
      viewport={{ once: true }}
      data-testid={`link-game-${index}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/0 to-transparent"
        animate={{ 
          background: ["linear-gradient(45deg, transparent, white)", "linear-gradient(45deg, white, transparent)"], 
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-10">
        <div className="relative flex items-center justify-between mb-4">
          <Magnetic strength={0.02}>
            <div className={`rounded-xl overflow-hidden ${size === "featured" ? "w-16 h-16" : "w-12 h-12"}`}>
              <img 
                src={game.icon} 
                alt={game.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
          </Magnetic>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs">
              {game.difficulty}
            </Badge>
            {game.new && <Badge variant="destructive" className="ml-2 animate-pulse">NEW</Badge>}
          </div>
        </div>
        <h3 className={`font-bold mb-2 group-hover:text-primary transition-colors ${
          size === "featured" ? "text-2xl" : "text-xl"
        }`}>
          {game.title}
        </h3>
        <p className={`text-muted-foreground mb-4 ${size === "featured" ? "text-base" : "text-sm"}`}>
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
      <Link href={game.path} className="absolute inset-0" onClick={() => playSound('click')} />
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-20 md:pb-8" style={{ perspective: '1000px' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SmoothHeading 
            text="Welcome to RockChain" 
            className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
          />
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
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="stat-card relative overflow-hidden">
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
                      </div>
                      <Magnetic strength={0.03}>
                        <Icon className={`h-8 w-8 text-${stat.color}`} />
                      </Magnetic>
                    </div>
                  </CardContent>
                  <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}/10 opacity-50`}></div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Daily Reward */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Magnetic strength={0.02}>
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 relative overflow-hidden">
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <Calendar className="text-white" />
                    </div>
                    <div>
                      <SmoothHeading text="Daily Reward" className="font-bold text-lg" />
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
          </Magnetic>
        </motion.div>

        {/* Game Arena Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <SmoothHeading 
              text="Choose Your Duel" 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
            />
            <Link href="/leaderboard" data-testid="link-leaderboard">
              <Button variant="outline" size="sm">
                View Leaderboard
              </Button>
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-4 mb-8 pb-4 -mx-4 px-4">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-card focus:border-primary transition-colors"
            />
          </div>

          {/* Tier 1: Featured Games (Large Cards) */}
          <section className="mb-16">
            <SmoothHeading 
              text="Featured Games" 
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <AnimatePresence mode="wait">
                {featuredGames.map((game, index) => renderGameCard(game, index, "featured"))}
              </AnimatePresence>
            </div>
            {featuredGames.length > 0 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(featuredGames.length / 4) }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                    className="w-3 h-3 rounded-full p-0"
                  />
                ))}
              </div>
            )}
          </section>

          {/* Tier 2: Recently Added */}
          <section className="mb-16">
            <SmoothHeading 
              text="Recently Added" 
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {recentGames.map((game, index) => renderGameCard(game, index + 4))}
              </AnimatePresence>
            </div>
          </section>

          {/* Tier 3: All Games Library */}
          <section className="mb-8">
            <SmoothHeading 
              text="All Games" 
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {visibleLibrary.map((game, index) => renderGameCard(game, index + 10))}
              </AnimatePresence>
            </div>
            {pages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: pages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    onClick={() => setCurrentPage(i)}
                    size="sm"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </section>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <SmoothHeading text="Recent Activity" className="text-lg font-bold" />
              </CardTitle>
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