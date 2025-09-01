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
import { addDivviReferral } from "@/utils/divvi";

type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;
type GameResult = 'win' | 'lose' | null;

export default function DiceRoll() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const [playerChoice, setPlayerChoice] = useState<DiceNumber | null>(null);
  const [diceResult, setDiceResult] = useState<DiceNumber | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { address } = useWallet();

  const diceOptions: { value: DiceNumber; emoji: string }[] = [
    { value: 1, emoji: "⚀" },
    { value: 2, emoji: "⚁" },
    { value: 3, emoji: "⚂" },
    { value: 4, emoji: "⚃" },
    { value: 5, emoji: "⚄" },
    { value: 6, emoji: "⚅" },
  ];

  const getDiceEmoji = (num: DiceNumber | null) => {
    if (!num) return "🎲";
    return diceOptions.find(d => d.value === num)?.emoji || "🎲";
  };

  const handleChoice = async (choice: DiceNumber) => {
    if (isRolling) return;

    setPlayerChoice(choice);
    setIsRolling(true);
    setShowResult(false);
    playSound('click');

    // Simulate dice rolling animation
    await new Promise(resolve => setTimeout(resolve, 2500));

    const rollResult = (Math.floor(Math.random() * 6) + 1) as DiceNumber;
    setDiceResult(rollResult);
    setIsRolling(false);

    // Determine winner
    const gameResult = choice === rollResult ? 'win' : 'lose';
    setResult(gameResult);

    // Show result after animation
    setTimeout(() => {
      setShowResult(true);

      if (gameResult === 'win') {
        dispatch({ type: 'WIN_GAME', payload: { gameType: 'dice' } });
        playSound('win');

        // Track referral for NFT mint transaction
        if (address && window.ethereum) {
          try {
            const txData = { 
              to: '0x0000000000000000000000000000000000000000', // Mock NFT contract address
              data: '0x40c10f19', // mint function selector
              value: 0n 
            };
            addDivviReferral(txData, address).catch(error => 
              console.error('Divvi referral tracking failed:', error)
            );
          } catch (error) {
            console.error('Divvi referral tracking failed:', error);
          }
        }

        toast({
          title: "Lucky Roll! 🎲",
          description: "You earned 10 points and an NFT!",
        });
      } else {
        toast({
          title: "Close, but not quite!",
          description: "Try another prediction!",
          variant: "destructive",
        });
      }
    }, 500);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setDiceResult(null);
    setResult(null);
    setIsRolling(false);
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
              <h1 className="text-3xl font-black">Dice Roll</h1>
              <p className="text-muted-foreground">Predict the outcome!</p>
            </div>
          </div>

          <Button 
            onClick={resetGame}
            variant="outline"
            size="sm"
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Roll
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
                    {result === 'win' ? "🎉 Perfect Guess!" : "😔 Wrong Number!"}
                  </Badge>
                ) : isRolling ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🎲 Rolling...
                  </Badge>
                ) : playerChoice ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    You predicted: {playerChoice}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Choose your number!
                  </Badge>
                )}
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
                    rotateY: [0, 360, 720, 1080],
                    scale: [1, 1.1, 1, 1.1, 1]
                  } : {}}
                  transition={{ 
                    duration: 2.5, 
                    ease: "easeOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-6xl shadow-2xl border-4 border-white/20">
                    {isRolling ? "🎲" : getDiceEmoji(diceResult)}
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
                    Result: {diceResult}
                  </div>
                  <div className="text-muted-foreground">
                    You predicted: {playerChoice}
                  </div>
                </motion.div>
              )}

              {/* Choice Buttons */}
              {!showResult && (
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  {diceOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleChoice(option.value)}
                        disabled={isRolling}
                        variant="outline"
                        className="w-full h-20 text-lg flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-primary/10 to-accent/10"
                        data-testid={`button-${option.value}`}
                      >
                        <span className="text-3xl">{option.emoji}</span>
                        <span>{option.value}</span>
                      </Button>
                    </motion.div>
                  ))}
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
                <p>• Choose a number from 1 to 6</p>
                <p>• Watch the dice roll animation</p>
                <p>• If your prediction matches the result, you win!</p>
                <p>• Win to earn 10 points and an NFT!</p>
                <p>• 1 in 6 chance - test your luck!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}