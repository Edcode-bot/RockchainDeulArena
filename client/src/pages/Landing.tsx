import { motion, AnimatePresence } from "framer-motion";  
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
  X,  
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

export default function Landing() {  
  const [, setLocation] = useLocation();  
  const { isConnected } = useWallet();  
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();  
  const { toast } = useToast();  
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 32, seconds: 18 });  
  const [showAdvanced, setShowAdvanced] = useState(false);  
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  const mouse = useMousePosition();  

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
          hours = 23;  
          minutes = 59;  
          seconds = 59;  
        }  

        return { hours, minutes, seconds };  
      });  
    }, 1000);  

    return () => clearInterval(interval);  
  }, []);  

  useEffect(() => {  
    const timer = setTimeout(() => {  
      setShowAdvanced(true);  
    }, 5000);  
    return () => clearTimeout(timer);  
  }, []);  

  const handleConnectClick = () => {  
    toast({  
      title: "Connecting...",  
      description: "Please check your wallet",  
    });  
  };  

  // Letter stagger animation for text  
  const textVariants = {  
    hidden: { opacity: 0, y: 20 },  
    visible: (i) => ({  
      opacity: 1,  
      y: 0,  
      transition: {  
        delay: i * 0.05,  
        duration: 0.5,  
        ease: "easeOut"  
      }  
    })  
  };  

  const splitText = (text) => {  
    return text.split("");  
  };  

  const basicGames = [  
    {  
      title: "Rock Paper Scissors",  
      description: "Classic duel against AI. Best of 3 rounds wins the NFT prize.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN--ldGj66p2AeBpgzMggacd_-3vZuNqP5MhBROugSHw&s=10",  
      gradient: "from-primary to-accent",  
      tag: "Quick Play",  
      path: "/rps"  
    },  
    {  
      title: "Tic Tac Toe",  
      description: "Strategic 3x3 grid battle. Outsmart the AI to claim victory.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFAuleG-NX2uVBoDGPMhaiGIFGrK8nb_XpU_rVTPobeA&s=10",  
      gradient: "from-accent to-secondary",  
      tag: "Strategy",  
      path: "/tictactoe"  
    },  
    {  
      title: "Guess Number",  
      description: "Predict the hidden number between 1-100. Pure luck meets intuition.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsRTwW2pokMJXwqhEIbzpSYFrMSFwNPAbCD5iI1_9sZg&s=10",  
      gradient: "from-secondary to-primary",  
      tag: "Luck",  
      path: "/guess"  
    },  
    {  
      title: "Coin Flip",  
      description: "Call heads or tails. Simple, fast, and instantly rewarding.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4o_06ceMHb78AaiSezrVevPnv-300BVq1Q&s",  
      gradient: "from-accent to-primary",  
      tag: "Instant",  
      path: "/coin"  
    },  
    {  
      title: "Dice Roll",  
      description: "Predict the dice outcome from 1-6. Test your gaming luck.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxjlfFuImsgmbptALrXguWcLUFOpBnc6g7gXUpo8IPwQ&s=10",  
      gradient: "from-primary to-secondary",  
      tag: "Classic",  
      path: "/dice"  
    }  
  ];  

  const advancedGames = [  
    {  
      title: "Blackjack Lite",  
      description: "Player vs dealer; basic hit/stand; win logic. +10 points & NFT on win.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8G1_pEp0lo6GOwuvCUb3Zg0Wqry5HpG9Rjs4g_y6SoA&s=10",  
      gradient: "from-primary to-accent",  
      tag: "Advanced",  
      path: "/blackjack"  
    },  
    {  
      title: "Memory Match",  
      description: "Flip card pairs; timer & move count; win on complete. +10 points & NFT on win.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqsSUtKXZdsKhY9xFixwpioGhNSpEEBpXCPmFxBMH5Nw&s=10",  
      gradient: "from-accent to-secondary",  
      tag: "Advanced",  
      path: "/memory"  
    },  
    {  
      title: "2048 Lite",  
      description: "4×4 swipe/keyboard merges; win at 2048 or best score. +10 points & NFT on win.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZgus5nj6wLdyoi81zLQEiHk6pxtUkggp3jNevtE22sg&s",  
      gradient: "from-secondary to-primary",  
      tag: "Advanced",  
      path: "/2048"  
    },  
    {  
      title: "Reaction Time",  
      description: "Wait for green, click fast; award if under threshold. +10 points & NFT on win.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJuwRHh1v0q2-iTJBJCZEn7-6g7KA5QtB64dwQLD9lTw&s=10",  
      gradient: "from-accent to-primary",  
      tag: "Advanced",  
      path: "/reaction"  
    },  
    {  
      title: "Word Scramble",  
      description: "Scramble 5-letter words; 3 hints; timer; win on correct. +10 points & NFT on win.",  
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnN89zLHRyEJ1drSasbsKFBa0JIRMFI9wlD3G8lUB56g&s",  
      gradient: "from-primary to-secondary",  
      tag: "Advanced",  
      path: "/scramble"  
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

  const renderGameCard = (game, index) => (  
    <motion.div   
      key={game.title}  
      className="group cursor-pointer relative overflow-hidden rounded-xl p-6"  
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
      data-testid={`card-game-${index}`}  
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
            <div className="w-12 h-12 rounded-xl overflow-hidden">  
              <img src={game.icon} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />  
            </div>  
          </Magnetic>  
          <div className="text-right">  
            <div className="text-sm text-muted-foreground">Reward</div>  
            <motion.div  
              className="text-lg font-bold text-accent"  
              whileHover={{ scale: 1.1 }}  
            >+10 pts</motion.div>  
          </div>  
        </div>  
        <h3 className="text-xl font-bold mb-2 relative z-10">{game.title}</h3>  
        <p className="text-muted-foreground mb-4 relative z-10">{game.description}</p>  
        <div className="flex items-center justify-between relative z-10">  
          <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">{game.tag}</span>  
          <motion.div  
            className="text-muted-foreground group-hover:text-accent transition-colors"  
            whileHover={{ x: 10 }}  
          >  
            →  
          </motion.div>  
        </div>  
      </div>  
      <Link href={game.path} className="absolute inset-0" />  
    </motion.div>  
  );  

  // Animated text component  
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
            whileHover={{ scale: 1.2, rotate: 5, y: -5 }}  
          >  
            {char === " " ? "\u00A0" : char}  
          </motion.span>  
        ))}  
      </div>  
    </motion.div>  
  );  

  return (  
    <div className="min-h-screen animated-bg" style={{ perspective: '1000px' }}>  
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

            {/* Desktop Nav */}  
            <div className="hidden md:flex items-center space-x-6">  
              <nav className="flex space-x-6">  
                <a href="#games" className="text-muted-foreground hover:text-foreground transition-colors">Games</a>  
                <a href="#video" className="text-muted-foreground hover:text-foreground transition-colors">Watch Video</a>  
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>  
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
                <ConnectButton onClick={handleConnectClick} />  
              </div>  
            </div>  

            {/* Mobile Menu Button */}  
            <div className="md:hidden">  
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} data-testid="button-menu">  
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}  
              </Button>  
            </div>  
          </div>  

          {/* Mobile Menu */}  
          <AnimatePresence>  
            {isMenuOpen && (  
              <motion.div  
                initial={{ opacity: 0, height: 0, y: -20 }}  
                animate={{ opacity: 1, height: "auto", y: 0 }}  
                exit={{ opacity: 0, height: 0, y: -20 }}  
                transition={{ duration: 0.3, ease: "easeInOut" }}  
                className="md:hidden pb-4"  
              >  
                <nav className="flex flex-col space-y-4 pt-4">  
                  <a href="#games" className="text-muted-foreground hover:text-foreground transition-colors py-2">Games</a>  
                  <a href="#video" className="text-muted-foreground hover:text-foreground transition-colors py-2">Watch Video</a>  
                  <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors py-2">Testimonials</a>  
                  <Button  
                    variant="ghost"  
                    onClick={toggleLanguage}  
                    className="justify-start p-2"  
                  >  
                    <Globe className="mr-2 h-4 w-4" /> Language  
                  </Button>  
                  <Button  
                    variant="ghost"  
                    onClick={toggleTheme}  
                    className="justify-start p-2"  
                  >  
                    <span className="mr-2 h-4 w-4">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</span>  
                    {theme === "dark" ? "Light" : "Dark"} Mode  
                  </Button>  
                  <div onClick={() => { handleConnectClick(); setIsMenuOpen(false); }}>  
                    <ConnectButton />  
                  </div>  
                </nav>  
              </motion.div>  
            )}  
          </AnimatePresence>  
        </div>  
      </header>  

      {/* Hero Section */}  
      <section className="relative overflow-hidden py-20 sm:py-32">  
        <div className="absolute inset-0">  
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>  
          {/* Floating particles with parallax */}  
          <motion.div   
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full"  
            animate={{ y: [-10, 10, -10] }}  
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}  
            style={{ transform: `translateY(${mouse.y * 0.01}px)` }}  
          />  
          <motion.div   
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full"  
            animate={{ y: [-10, 10, -10] }}  
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -2 }}  
            style={{ transform: `translateX(${mouse.x * 0.01}px)` }}  
          />  
          <motion.div   
            className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-secondary rounded-full"  
            animate={{ y: [-10, 10, -10] }}  
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -4 }}  
          />  
        </div>  

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">  
          <motion.h1   
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"  
            initial={{ opacity: 0, scale: 0.9 }}  
            animate={{ opacity: 1, scale: 1 }}  
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}  
          >  
            <AnimatedText text="Duel & Earn" className="block" />  
            <AnimatedText text="Onchain Rewards" className="block mt-4" />  
          </motion.h1>  

          <motion.p   
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"  
            initial={{ opacity: 0, y: 20 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.8, delay: 0.3 }}  
          >  
            Play epic duels, win NFTs, and earn cUSD instantly on Celo.   
            The ultimate onchain gaming experience for Africa.  
          </motion.p>  

          {/* Daily Challenge Countdown */}  
          <motion.div   
            className="mb-8 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border inline-block"  
            initial={{ opacity: 0, scale: 0.9 }}  
            animate={{ opacity: 1, scale: 1 }}  
            whileHover={{ scale: 1.02 }}  
            transition={{ duration: 0.5, delay: 0.5 }}  
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
            transition={{ duration: 0.8, delay: 0.7 }}  
          >  
            <Magnetic strength={0.05}>  
              <div onClick={handleConnectClick}>  
                <ConnectButton />  
              </div>  
            </Magnetic>  
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
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">  
              <AnimatedText text="Epic Duels Await" />  
            </h2>  
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">  
              Choose your battle, defeat AI opponents, and claim instant NFT rewards  
            </p>  
          </motion.div>  

          {/* Basic Games - Staggered appearance */}  
          <motion.div  
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"  
            initial={{ opacity: 0 }}  
            whileInView={{ opacity: 1 }}  
            transition={{ duration: 0.8, staggerChildren: 0.1 }}  
            viewport={{ once: true }}  
          >  
            {basicGames.map((game, index) => renderGameCard(game, index))}  
          </motion.div>  

          {/* Advanced Games - Auto appear with particle-like entrance */}  
          <AnimatePresence>  
            {showAdvanced && (  
              <motion.div  
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"  
                initial={{ opacity: 0, scale: 0.8, rotate: 180 }}  
                animate={{ opacity: 1, scale: 1, rotate: 0 }}  
                exit={{ opacity: 0, scale: 0.8 }}  
                transition={{ duration: 1, ease: "backOut", staggerChildren: 0.15 }}  
              >  
                {advancedGames.map((game, index) => renderGameCard(game, index + 5))}  
              </motion.div>  
            )}  
          </AnimatePresence>  
        </div>  
      </section>  

      {/* Demo Video Section */}  
      <section id="video" className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">  
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">  
          <motion.div  
            initial={{ opacity: 0, y: 20 }}  
            whileInView={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.8 }}  
            viewport={{ once: true }}  
          >  
            <h2 className="text-4xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">  
              <AnimatedText text="See RockChain in Action" />  
            </h2>  
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">  
              Watch how easy it is to duel and earn NFTs/cUSD in just a few taps  
            </p>  

            <div className="relative max-w-3xl mx-auto">  
              <motion.div  
                className="aspect-video overflow-hidden shadow-2xl rounded-xl"  
                whileHover={{ scale: 1.02, rotateY: 5 }}  
                transition={{ type: "spring" }}  
              >  
                <Card className="h-full">  
                  <iframe  
                    width="100%"  
                    height="100%"  
                    src="https://www.youtube.com/embed/MxrMYXrJI70"  
                    title="RockChain Demo"  
                    frameBorder="0"  
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  
                    referrerPolicy="strict-origin-when-cross-origin"  
                    allowFullScreen  
                    className="w-full h-full"  
                  ></iframe>  
                </Card>  
              </motion.div>  
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
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">  
              <AnimatedText text="Real-time Platform Insights" />  
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
                  className="stat-card rounded-xl p-6 text-center relative overflow-hidden cursor-pointer"  
                  initial={{ opacity: 0, y: 20 }}  
                  whileInView={{ opacity: 1, y: 0 }}  
                  whileHover={{ y: -5, rotateX: 5 }}  
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}  
                  viewport={{ once: true }}  
                  data-testid={`stat-${index}`}  
                >  
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}></div>  
                  <Magnetic strength={0.03}>  
                    <div className={`relative w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 z-10`}>  
                      <Icon className="text-white text-xl" />  
                    </div>  
                  </Magnetic>  
                  <motion.div  
                    className="text-3xl font-black text-foreground mb-2 relative z-10"  
                    initial={{ scale: 0 }}  
                    whileInView={{ scale: 1 }}  
                    transition={{ delay: index * 0.2 }}  
                  >  
                    {stat.value}  
                  </motion.div>  
                  <div className="text-sm text-muted-foreground mb-1 relative z-10">{stat.label}</div>  
                  <div className="text-xs text-accent relative z-10">{stat.change}</div>  
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
            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">  
              <AnimatedText text="Trusted by Players Across Africa" />  
            </h2>  
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">  
              Real experiences from users dueling and earning on Celo  
            </p>  
          </motion.div>  

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">  
            {testimonials.map((testimonial, index) => (  
              <motion.div   
                key={testimonial.name}  
                className={`stat-card rounded-xl p-6 relative overflow-hidden ${testimonial.special ? 'border-2 border-accent/30' : ''}`}  
                initial={{ opacity: 0, y: 20 }}  
                whileInView={{ opacity: 1, y: 0 }}  
                whileHover={{ scale: 1.02, rotate: 1 }}  
                transition={{ duration: 0.5, delay: index * 0.1 }}  
                viewport={{ once: true }}  
                data-testid={`testimonial-${index}`}  
              >  
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-5`}></div>  
                <div className="relative flex items-center mb-4 z-10">  
                  <div className={`relative w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center mr-4 z-10`}>  
                    <span className="text-white font-bold">{testimonial.avatar}</span>  
                  </div>  
                  <div>  
                    <div className="font-semibold">{testimonial.name}</div>  
                    <div className={`text-sm ${testimonial.special ? 'text-accent' : 'text-muted-foreground'}`}>  
                      {testimonial.location}  
                    </div>  
                  </div>  
                </div>  
                <p className="text-muted-foreground leading-relaxed mb-4 relative z-10">  
                  "{testimonial.text}"  
                </p>  
                <div className="flex text-accent relative z-10">  
                  {[...Array(5)].map((_, i) => (  
                    <motion.span key={i} whileHover={{ scale: 1.2 }}>⭐</motion.span>  
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
                <Magnetic strength={0.05}>  
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg hover:bg-primary transition-colors" data-testid="link-twitter">  
                    <Twitter className="text-sm" />  
                  </Button>  
                </Magnetic>  
                <Magnetic strength={0.05}>  
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg hover:bg-primary transition-colors" data-testid="link-discord">  
                    <MessageCircle className="text-sm" />  
                  </Button>  
                </Magnetic>  
                <Magnetic strength={0.05}>  
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-lg hover:bg-primary transition-colors" data-testid="link-telegram">  
                    <Send className="text-sm" />  
                  </Button>  
                </Magnetic>  
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