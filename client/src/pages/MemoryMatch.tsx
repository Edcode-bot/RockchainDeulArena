import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Brain, Timer } from "lucide-react";
import { handleGameResult, playSound } from "@/utils/gameApi";

interface CardItem {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎵', '🎸', '🎤'];

const createCards = (): CardItem[] => {
  const cards: CardItem[] = [];
  symbols.forEach((symbol, index) => {
    cards.push(
      { id: index * 2, symbol, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
    );
  });
  return shuffleArray(cards);
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function MemoryMatch() {
  const { dispatch } = useGameState();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  
  const [cards, setCards] = useState<CardItem[]>(createCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameFinished) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameFinished]);

  useEffect(() => {
    if (matchedPairs === 8) {
      finishGame();
    }
  }, [matchedPairs]);

  const startGame = () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to play",
        variant: "destructive",
      });
      return;
    }
    
    setGameStarted(true);
    setTimeElapsed(0);
    playSound('click');
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameFinished || isProcessingTx) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (flippedCards.length === 2) return;
    
    playSound('click');
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    setFlippedCards(prev => [...prev, cardId]);
    
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = cards.find(c => c.id === cardId);
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstCard.id || c.id === secondCard.id) 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          playSound('win');
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === firstCard.id || c.id === secondCard.id) 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const finishGame = async () => {
    setGameFinished(true);
    setIsProcessingTx(true);

    try {
      // Calculate performance bonus
      const timeBonus = timeElapsed < 60 ? 2 : timeElapsed < 90 ? 1 : 0;
      const moveBonus = moves < 20 ? 2 : moves < 25 ? 1 : 0;
      const isWin = timeElapsed < 120 && moves < 30;

      const result = await handleGameResult('memory', isWin ? 'win' : 'lose', address!);
      
      if (isWin) {
        dispatch({ type: 'WIN_GAME', payload: { gameType: 'memory' } });
        toast({
          title: "Memory Master! 🧠",
          description: `Completed in ${timeElapsed}s with ${moves} moves! Earned ${result.points} points${result.nftUri ? ' and an NFT!' : '!'}`,
        });
      } else {
        toast({
          title: "Good Try! 🎯",
          description: `Completed in ${timeElapsed}s with ${moves} moves. Try to beat 120s and 30 moves for victory!`,
        });
      }
    } catch (error) {
      console.error('Game result error:', error);
    }

    setIsProcessingTx(false);
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setGameStarted(false);
    setGameFinished(false);
    setMatchedPairs(0);
    setMoves(0);
    setTimeElapsed(0);
    setIsProcessingTx(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <h1 className="text-3xl font-black">Memory Match</h1>
              <p className="text-muted-foreground">Match all pairs and test your memory!</p>
            </div>
          </div>
          
          <Button 
            onClick={resetGame}
            variant="outline"
            size="sm"
            disabled={isProcessingTx}
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </motion.div>

        {/* Game Stats */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Timer className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
                  <p className="text-sm text-muted-foreground">Time</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{moves}</p>
                  <p className="text-sm text-muted-foreground">Moves</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-2xl font-bold">{matchedPairs}/8</p>
                  <p className="text-sm text-muted-foreground">Pairs</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Game Board */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Memory Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    className={`aspect-square rounded-lg border-2 text-4xl font-bold transition-all duration-300 ${
                      card.isMatched
                        ? 'bg-green-100 border-green-300 text-green-600'
                        : card.isFlipped
                        ? 'bg-blue-100 border-blue-300 text-blue-600'
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => handleCardClick(card.id)}
                    disabled={!gameStarted || card.isMatched || isProcessingTx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`card-${card.id}`}
                  >
                    {card.isFlipped || card.isMatched ? card.symbol : '❓'}
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Controls */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {!gameStarted && (
                  <Button
                    onClick={startGame}
                    disabled={!isConnected || isProcessingTx}
                    className="text-lg px-8 py-4"
                    data-testid="button-start"
                  >
                    Start Game
                  </Button>
                )}
                {gameStarted && !gameFinished && (
                  <Badge variant="default" className="text-lg px-4 py-2">
                    Find all pairs to win!
                  </Badge>
                )}
                {gameFinished && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Game Complete! 🎉
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Rules */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p>• Connect wallet and start the memory challenge</p>
                  <p>• Flip cards to reveal symbols underneath</p>
                  <p>• Match pairs of identical symbols</p>
                </div>
                <div>
                  <p>• Complete under 120s and 30 moves to win</p>
                  <p>• Win to earn 10 points and an NFT!</p>
                  <p>• Points only - no blockchain transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}