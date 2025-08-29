import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useWallet } from "@/wallet/reown";
import { useTheme } from "@/components/ThemeProvider";
import { ConnectButton } from "@/components/ConnectButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Dice1, 
  Globe, 
  Moon, 
  Sun, 
  Menu, 
  Play, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ExternalLink,
  Twitter,
  MessageCircle,
  Send
} from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isConnected } = useWallet();
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 32, seconds: 18 });

  // Force repaint for MetaMask compatibility
  useEffect(() => {
    const handleLoad = () => {
      document.body.style.background = 'linear-gradient(135deg, #f97316 0%, #16a34a 100%)';
      document.documentElement.style.background = 'linear-gradient(135deg, #f97316 0%, #16a34a 100%)';
    };
    
    handleLoad();
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      setLocation("/dashboard");
    }
  }, [isConnected, setLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset countdown
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleConnectClick = () => {
    toast({
      title: "Connecting...",
      description: "Please check your wallet",
    });
  };

  const games = [
    {
      title: "Rock Paper Scissors",
      description: "Classic duel against AI. Best of 3 rounds wins the NFT prize.",
      icon: "✂️",
      gradient: "from-primary to-accent",
      tag: "Quick Play"
    },
    {
      title: "Tic Tac Toe",
      description: "Strategic 3x3 grid battle. Outsmart the AI to claim victory.",
      icon: "⭕",
      gradient: "from-accent to-secondary",
      tag: "Strategy"
    },
    {
      title: "Guess Number",
      description: "Predict the hidden number between 1-100. Pure luck meets intuition.",
      icon: "🔍",
      gradient: "from-secondary to-primary",
      tag: "Luck"
    },
    {
      title: "Coin Flip",
      description: "Call heads or tails. Simple, fast, and instantly rewarding.",
      icon: "🪙",
      gradient: "from-accent to-primary",
      tag: "Instant"
    },
    {
      title: "Dice Roll",
      description: "Predict the dice outcome from 1-6. Test your gaming luck.",
      icon: "🎲",
      gradient: "from-primary to-secondary",
      tag: "Classic"
    }
  ];

  const testimonials = [
    {
      name: "Saint_Brisa",
      location: "Uganda",
      avatar: "SB",
      text: "RockChain turned my duels into instant NFT rewards. Fast, fun, reliable.",
      gradient: "from-primary to-accent"
    },
    {
      name: "Leakey Njeru",
      location: "Kenya",
      avatar: "LN",
      text: "Seamless wallet to leaderboard flow. The rewards and UI are transparent—love it.",
      gradient: "from-accent to-secondary"
    },
    {
      name: "Oliseh GENESIS",
      location: "Uganda",
      avatar: "OG",
      text: "Tested RPS and Coin Flip—wins arrived in minutes. RockChain just works.",
      gradient: "from-secondary to-primary"
    },
    {
      name: "Rwego Edcode",
      location: "Uganda • Founder",
      avatar: "RE",
      text: "RockChain is for real onchain gaming and rewards. Duel in a tap.",
      gradient: "from-accent to-primary",
      special: true
    }
  ];

  const stats = [
    {
      value: "$12K",
      label: "Total Volume",
      change: "+25% from last month",
      icon: TrendingUp,
      gradient: "from-primary to-accent"
    },
    {
      value: "170",
      label: "Active Users",
      change: "+19% from last month",
      icon: Users,
      gradient: "from-accent to-secondary"
    },
    {
      value: "2 min",
      label: "Avg. Transfer Time",
      change: "-12% from last month",
      icon: Clock,
      gradient: "from-secondary to-primary"
    },
    {
      value: "99%",
      label: "Success Rate",
      change: "Consistent performance",
      icon: CheckCircle,
      gradient: "from-accent to-primary"
    }
  ];

  return (
    <div 
      className="min-h-screen animated-bg"
      style={{
        background: 'linear-gradient(135deg, #f97316 0%, #16a34a 100%)',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Dice1 className="text-white text-sm" />
              </div>
              <span className="font-bold text-xl text-foreground">RockChain</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#games" className="text-muted-foreground hover:text-foreground transition-colors">Games</a>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
              </nav>
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  data-testid="button-language"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                >
                  <Globe className="text-sm" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  data-testid="button-theme"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80"
                >
                  {theme === "dark" ? <Sun className="text-sm" /> : <Moon className="text-sm" />}
                </Button>
              </div>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="sm" data-testid="button-menu">
                <Menu />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
          {/* Floating particles */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -2 }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-secondary rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -4 }}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-text">Duel & Earn</span><br />
            <span className="text-foreground">Onchain Rewards</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Play epic duels, win NFTs, and earn cUSD instantly on Celo. 
            The ultimate onchain gaming experience for Africa.
          </motion.p>
          
          {/* Daily Challenge Countdown */}
          <motion.div 
            className="mb-8 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-sm text-muted-foreground mb-1">Daily Challenge Ends In</div>
            <div className="text-2xl font-bold text-accent" data-testid="text-countdown">
              {countdown.hours.toString().padStart(2, '0')}h{' '}
              {countdown.minutes.toString().padStart(2, '0')}m{' '}
              {countdown.seconds.toString().padStart(2, '0')}s
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div onClick={handleConnectClick}>
              <ConnectButton />
            </div>
            <Button 
              variant="outline"
              className="px-8 py-4 rounded-xl font-semibold text-lg border border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-colors"
              data-testid="button-demo"
            >
              <Play className="mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary" data-testid="text-players">170</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent" data-testid="text-volume">$12K</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary" data-testid="text-success">99%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="hero-text">Epic Duels</span> Await
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your battle, defeat AI opponents, and claim instant NFT rewards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div 
                key={game.title}
                className="game-card rounded-xl p-6 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                data-testid={`card-game-${index}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${game.gradient} rounded-xl flex items-center justify-center text-2xl`}>
                    {game.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Reward</div>
                    <div className="text-lg font-bold text-accent">+10 pts</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                <p className="text-muted-foreground mb-4">{game.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">{game.tag}</span>
                  <motion.div
                    className="text-muted-foreground group-hover:text-accent transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            ))}

            <motion.div 
              className="game-card rounded-xl p-6 group cursor-pointer border-2 border-accent/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              data-testid="card-coming-soon"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center text-2xl">
                  ➕
                </div>
                <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full">Coming Soon</span>
              </div>
              <h3 className="text-xl font-bold mb-2">More Games</h3>
              <p className="text-muted-foreground mb-4">New duels and challenges launching soon. Stay tuned!</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updates weekly</span>
                <div className="text-muted-foreground group-hover:text-accent transition-colors">🔔</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              See RockChain in <span className="hero-text">Action</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Watch how easy it is to duel and earn NFTs/cUSD in just a few taps
            </p>
            
            <div className="relative max-w-3xl mx-auto">
              <Card className="aspect-video overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center">
                    <motion.div 
                      className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Play className="text-3xl text-white ml-1" />
                    </motion.div>
                    <p className="text-lg font-semibold">Demo Video Player</p>
                    <p className="text-sm text-muted-foreground">Click to watch the full demo</p>
                  </div>
                </div>
              </Card>
              
              <Button 
                variant="outline"
                className="inline-flex items-center mt-6 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
                data-testid="button-youtube"
              >
                <ExternalLink className="mr-2 text-red-500" />
                Watch on YouTube
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="hero-text">Real-time</span> Platform Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Live statistics showcasing our platform's performance and growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.label}
                  className="stat-card rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`stat-${index}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <div className="text-3xl font-black text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-accent">{stat.change}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Trusted by Players <span className="hero-text">Across Africa</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real experiences from users dueling and earning on Celo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name}
                className={`stat-card rounded-xl p-6 ${testimonial.special ? 'border-2 border-accent/30' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className={`text-sm ${testimonial.special ? 'text-accent' : 'text-muted-foreground'}`}>
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <motion.div 
                className="flex items-center space-x-2 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Dice1 className="text-white text-sm" />
                </div>
                <span className="font-bold text-xl">RockChain Duel Arena</span>
              </motion.div>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                Making onchain gaming accessible to everyone in Africa through Celo. 
                Fast, secure, rewarding duels.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg hover:bg-primary transition-colors" data-testid="link-twitter">
                  <Twitter className="text-sm" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg hover:bg-primary transition-colors" data-testid="link-discord">
                  <MessageCircle className="text-sm" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg hover:bg-primary transition-colors" data-testid="link-telegram">
                  <Send className="text-sm" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="#games" className="text-muted-foreground hover:text-foreground transition-colors">Games</Link></li>
                <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link></li>
                <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Rewards</span></li>
                <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">NFT Gallery</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                © 2025 RockChain Duel Arena. All rights reserved. Empowering African web3 gaming!
              </p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>Built by:</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Rwego Edcode</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Bruno Maa</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Saint_Brisa</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
