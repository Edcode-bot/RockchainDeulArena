import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Coins } from "lucide-react";
import { addDivviReferral } from "@/utils/divvi";

type CoinSide = 'heads' | 'tails';
type GameResult = 'win' | 'lose' | null;

export default function CoinFlip() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const { address } = useWallet();
  const [playerChoice, setPlayerChoice] = useState<CoinSide | null>(null);
  const [coinResult, setCoinResult] = useState<CoinSide | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = async (choice: CoinSide) => {
    if (isFlipping) return;
    
    setPlayerChoice(choice);
    setIsFlipping(true);
    setShowResult(false);
    playSound('click');
    
    // Track referral for bet transaction
    if (address && window.ethereum) {
      try {
        const betTxData = { 
          to: '0x0000000000000000000000000000000000000000', // Mock betting contract address
          data: '0x12345678', // bet function selector
          value: 100000000000000000n // 0.1 CELO bet amount
        };
        await addDivviReferral(betTxData, address);
      } catch (error) {
        console.error('Divvi referral tracking for bet failed:', error);
      }
    }
    
    // Simulate coin flip animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
    setCoinResult(flipResult);
    setIsFlipping(false);
    
    // Determine winner
    const gameResult = choice === flipResult ? 'win' : 'lose';
    setResult(gameResult);
    
    // Show result after animation
    setTimeout(async () => {
      setShowResult(true);
      
      if (gameResult === 'win') {
        dispatch({ type: 'WIN_GAME', payload: { gameType: 'coin' } });
        playSound('win');
        
        // Track referral for NFT mint transaction
        if (address && window.ethereum) {
          try {
            const mintTxData = { 
              to: '0x0000000000000000000000000000000000000000', // Mock NFT contract address
              data: '0x40c10f19', // mint function selector
              value: 0n 
            };
            await addDivviReferral(mintTxData, address);
          } catch (error) {
            console.error('Divvi referral tracking for NFT mint failed:', error);
          }
        }
        
        toast({
          title: "Perfect Call! 🎉",
          description: "You earned 10 points and an NFT!",
        });
      } else {
        toast({
          title: "Better Luck Next Time!",
          description: "Try again for the win!",
          variant: "destructive",
        });
      }
    }, 500);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setCoinResult(null);
    setResult(null);
    setIsFlipping(false);
    setShowResult(false);
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
              <h1 className="text-3xl font-black">Coin Flip</h1>
              <p className="text-muted-foreground">Call heads or tails!</p>
            </div>
          </div>
          
          <Button 
            onClick={resetGame}
            variant="outline"
            size="sm"
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Flip
          </Button>
        </motion.div>

        {/* Game Status */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {showResult && result ? (
                  <Badge 
                    variant={result === 'win' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {result === 'win' ? "🎉 You Won!" : "😔 You Lost!"}
                  </Badge>
                ) : isFlipping ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🪙 Flipping...
                  </Badge>
                ) : playerChoice ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    You called: {playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Make your call!
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coin Animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Coins className="h-6 w-6" />
                <span>The Coin</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="relative w-32 h-32"
                  animate={isFlipping ? { 
                    rotateY: [0, 1800],
                    rotateX: [0, 720]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    ease: "easeOut",
                    times: [0, 1]
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-white/20">
                    {isFlipping ? "🌟" : 
                     coinResult === 'heads' ? "👑" : 
                     coinResult === 'tails' ? "⭐" : 
                     "🪙"}
                  </div>
                </motion.div>
              </div>

              {/* Result Display */}
              {showResult && coinResult && (
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-2xl font-bold mb-2" data-testid="text-coin-result">
                    Result: {coinResult.charAt(0).toUpperCase() + coinResult.slice(1)}
                  </div>
                  <div className="text-muted-foreground">
                    You called: {playerChoice ? playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1) : ''}
                  </div>
                </motion.div>
              )}

              {/* Choice Buttons */}
              {!showResult && (
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Button
                      onClick={() => handleChoice('heads')}
                      disabled={isFlipping}
                      variant="outline"
                      className="w-full h-24 text-lg flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-primary/10 to-accent/10"
                      data-testid="button-heads"
                    >
                      <span className="text-3xl">👑</span>
                      <span>Heads</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Button
                      onClick={() => handleChoice('tails')}
                      disabled={isFlipping}
                      variant="outline"
                      className="w-full h-24 text-lg flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-accent/10 to-secondary/10"
                      data-testid="button-tails"
                    >
                      <span className="text-3xl">⭐</span>
                      <span>Tails</span>
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Play Again Button */}
              {showResult && (
                <motion.div 
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Button 
                    onClick={resetGame}
                    className="connect-btn px-8 py-3"
                    data-testid="button-play-again"
                  >
                    Flip Again
                  </Button>
                </motion.div>
              )}
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
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Choose heads (👑) or tails (⭐)</p>
                <p>• Watch the coin flip animation</p>
                <p>• If your prediction matches the result, you win!</p>
                <p>• Win to earn 10 points and an NFT!</p>
                <p>• Pure chance - may the luck be with you!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
