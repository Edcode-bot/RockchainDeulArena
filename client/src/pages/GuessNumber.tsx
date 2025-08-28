import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Target } from "lucide-react";

export default function GuessNumber() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const maxAttempts = 7;

  const handleGuess = async () => {
    const guessNumber = parseInt(guess);
    
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      toast({
        title: "Invalid guess",
        description: "Please enter a number between 1 and 100",
        variant: "destructive",
      });
      return;
    }

    playSound('click');
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNumber === targetNumber) {
      // Win!
      setGameResult('win');
      setIsRevealing(true);
      dispatch({ type: 'WIN_GAME', payload: { gameType: 'guess' } });
      playSound('win');
      toast({
        title: "Perfect! 🎉",
        description: `You guessed ${targetNumber} in ${newAttempts} attempts! You earned 10 points and an NFT!`,
      });
    } else if (newAttempts >= maxAttempts) {
      // Lose
      setGameResult('lose');
      setIsRevealing(true);
      toast({
        title: "Game Over!",
        description: `The number was ${targetNumber}. Try again!`,
        variant: "destructive",
      });
    } else {
      // Continue playing
      const difference = Math.abs(guessNumber - targetNumber);
      let hint = "";
      
      if (guessNumber < targetNumber) {
        hint = `Too low! `;
      } else {
        hint = `Too high! `;
      }
      
      if (difference <= 5) {
        hint += "🔥 Very close!";
      } else if (difference <= 15) {
        hint += "🎯 Getting closer!";
      } else if (difference <= 30) {
        hint += "📍 You're in the range!";
      } else {
        hint += "🌍 Way off!";
      }

      setHints(prev => [hint, ...prev]);
    }

    setGuess("");
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setHints([]);
    setGameResult(null);
    setIsRevealing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameResult) {
      handleGuess();
    }
  };

  const getProgressColor = () => {
    const percentage = (attempts / maxAttempts) * 100;
    if (percentage < 50) return "bg-primary";
    if (percentage < 80) return "bg-accent";
    return "bg-destructive";
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
              <h1 className="text-3xl font-black">Guess the Number</h1>
              <p className="text-muted-foreground">Find the number between 1-100</p>
            </div>
          </div>
          
          <Button 
            onClick={resetGame}
            variant="outline"
            size="sm"
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Attempts</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-attempts">
                    {attempts}/{maxAttempts}
                  </p>
                </div>
                
                {gameResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge 
                      variant={gameResult === 'win' ? 'default' : 'destructive'}
                      className="text-lg px-4 py-2"
                    >
                      {gameResult === 'win' ? "🎉 You Won!" : "😔 Game Over!"}
                    </Badge>
                  </motion.div>
                )}

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Target Range</p>
                  <p className="text-lg font-bold text-accent">1 - 100</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(attempts / maxAttempts) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Area */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Target className="h-6 w-6" />
                <span>
                  {gameResult 
                    ? `The number was ${targetNumber}!`
                    : "What's your guess?"
                  }
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!gameResult ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter a number (1-100)"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyPress={handleKeyPress}
                      min="1"
                      max="100"
                      className="text-lg text-center"
                      data-testid="input-guess"
                    />
                    <Button 
                      onClick={handleGuess}
                      disabled={!guess || gameResult !== null}
                      className="px-6"
                      data-testid="button-guess"
                    >
                      Guess
                    </Button>
                  </div>
                  
                  {attempts > 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                      {maxAttempts - attempts} attempts remaining
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <motion.div 
                    className="text-6xl font-black mb-4"
                    animate={isRevealing ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.8 }}
                    data-testid="text-target-number"
                  >
                    {targetNumber}
                  </motion.div>
                  <Button 
                    onClick={resetGame}
                    className="connect-btn px-8 py-3"
                    data-testid="button-play-again"
                  >
                    Play Again
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Hints */}
        {hints.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {hints.map((hint, index) => (
                    <motion.div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg border border-border"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <p className="text-sm">
                        <span className="font-semibold">Attempt {hints.length - index}:</span> {hint}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                <p>• Guess the secret number between 1 and 100</p>
                <p>• You have {maxAttempts} attempts to find it</p>
                <p>• Get hints after each wrong guess</p>
                <p>• Guess correctly to earn 10 points and an NFT!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
