
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Dice6 } from "lucide-react";
import { handleGameResult, playSound as playGameSound } from "@/utils/gameApi";

type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;
type GameResult = 'win' | 'lose' | null;

const diceEmojis: Record<DiceNumber, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅'
};

export default function DiceRoll() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const [playerChoice, setPlayerChoice] = useState<DiceNumber | null>(null);
  const [diceResult, setDiceResult] = useState<DiceNumber | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  const handleChoice = async (choice: DiceNumber) => {
    if (isRolling || !isConnected || !address) {
      if (!isConnected) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your wallet to play",
          variant: "destructive",
        });
      }
      return;
    }
    
    setPlayerChoice(choice);
    setIsRolling(true);
    setShowResult(false);
    setIsProcessingTx(true);
    playGameSound('click');
    
    try {
      // Simulate dice roll animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const rollResult = Math.floor(Math.random() * 6) + 1 as DiceNumber;
      setDiceResult(rollResult);
      setIsRolling(false);
      
      // Determine winner
      const gameResult = choice === rollResult ? 'win' : 'lose';
      setResult(gameResult);
      
      // Handle game result
      const result = await handleGameResult('dice', gameResult, address);
      
      // Show result after animation
      setTimeout(async () => {
        setShowResult(true);
        
        if (gameResult === 'win') {
          dispatch({ type: 'WIN_GAME', payload: { gameType: 'dice' } });
          playSound('win');
          
          toast({
            title: "Lucky Roll! 🎉",
            description: `You rolled ${rollResult}! Earned ${result.points} points${result.nftUri ? ' and an NFT!' : '!'}`,
          });
        } else {
          toast({
            title: "No Luck This Time!",
            description: `You predicted ${choice} but rolled ${rollResult}. Try again!`,
            variant: "destructive",
          });
        }
        
        setIsProcessingTx(false);
      }, 500);

    } catch (error: any) {
      console.error('Game failed:', error);
      setIsRolling(false);
      setIsProcessingTx(false);
      
      toast({
        title: "Game failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      
      resetGame();
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setDiceResult(null);
    setResult(null);
    setIsRolling(false);
    setShowResult(false);
    setIsProcessingTx(false);
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
              <h1 className="text-3xl font-black">Dice Roll</h1>
              <p className="text-muted-foreground">Predict the roll and earn points!</p>
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
            New Roll
          </Button>
        </motion.div>

        {/* Wallet Status */}
        {!isConnected && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2 border-yellow-500 text-yellow-500">
                    ⚠️ Connect Wallet to Play
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                {isProcessingTx && (
                  <Badge variant="outline" className="text-lg px-4 py-2 border-blue-500 text-blue-500">
                    🔄 Processing Transaction...
                  </Badge>
                )}
                {!isProcessingTx && showResult && result ? (
                  <Badge 
                    variant={result === 'win' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {result === 'win' ? "🎉 Perfect Prediction!" : "😔 Wrong Prediction!"}
                  </Badge>
                ) : !isProcessingTx && isRolling ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🎲 Rolling dice...
                  </Badge>
                ) : !isProcessingTx && playerChoice ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Your prediction: {diceEmojis[playerChoice]} {playerChoice}
                  </Badge>
                ) : !isProcessingTx ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Pick your lucky number!
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dice Animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Dice6 className="h-6 w-6" />
                <span>The Dice</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="relative w-32 h-32"
                  animate={isRolling ? { 
                    rotateX: [0, 360, 720, 1080],
                    rotateY: [0, 360, 720, 1080]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    ease: "easeOut",
                    times: [0, 0.33, 0.66, 1]
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-6xl text-white shadow-2xl border-4 border-white/20">
                    {isRolling ? "🎲" : 
                     diceResult ? diceEmojis[diceResult] : 
                     "🎯"}
                  </div>
                </motion.div>
              </div>

              {/* Result Display */}
              {showResult && diceResult && (
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-2xl font-bold mb-2" data-testid="text-dice-result">
                    Rolled: {diceEmojis[diceResult]} {diceResult}
                  </div>
                  <div className="text-muted-foreground">
                    Your prediction: {playerChoice ? `${diceEmojis[playerChoice]} ${playerChoice}` : ''}
                  </div>
                </motion.div>
              )}

              {/* Choice Buttons */}
              {!showResult && isConnected && (
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  {[1, 2, 3, 4, 5, 6].map((number, index) => (
                    <motion.div
                      key={number}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleChoice(number as DiceNumber)}
                        disabled={isRolling || isProcessingTx}
                        variant="outline"
                        className="w-full h-20 text-lg flex flex-col space-y-1 hover:scale-105 transition-transform bg-gradient-to-br from-red-500/10 to-red-700/10"
                        data-testid={`button-${number}`}
                      >
                        <span className="text-3xl">{diceEmojis[number as DiceNumber]}</span>
                        <span>{number}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Play Again Button */}
              {showResult && !isProcessingTx && (
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
                    Roll Again
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
                <p>• Connect your wallet to play</p>
                <p>• Choose a number from 1 to 6</p>
                <p>• Watch the dice roll animation</p>
                <p>• Predict the exact number to win and get points + NFT URI!</p>
                <p>• 1/6 chance to win - pure luck game!</p>
                <p>• Instant play - no blockchain transactions required</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
