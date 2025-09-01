import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { addDivviReferral } from "@/utils/divvi";

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'tie' | null;

export default function RPS() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const { address } = useWallet();
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [round, setRound] = useState(1);

  const choices: { value: Choice; emoji: string; name: string }[] = [
    { value: 'rock', emoji: '🪨', name: 'Rock' },
    { value: 'paper', emoji: '📄', name: 'Paper' },
    { value: 'scissors', emoji: '✂️', name: 'Scissors' },
  ];

  const getRandomChoice = (): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: Choice, ai: Choice): GameResult => {
    if (player === ai) return 'tie';
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    
    return winConditions[player] === ai ? 'win' : 'lose';
  };

  const handleChoice = async (choice: Choice) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setPlayerChoice(choice);
    playSound('click');
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ai = getRandomChoice();
    setAiChoice(ai);
    
    const gameResult = determineWinner(choice, ai);
    setResult(gameResult);
    
    const newScore = { ...score };
    if (gameResult === 'win') {
      newScore.player++;
    } else if (gameResult === 'lose') {
      newScore.ai++;
    }
    setScore(newScore);
    
    // Check if game is complete (best of 3)
    if (newScore.player === 2 || newScore.ai === 2) {
      const finalResult = newScore.player === 2 ? 'win' : 'lose';
      
      if (finalResult === 'win') {
        dispatch({ type: 'WIN_GAME', payload: { gameType: 'rps' } });
        playSound('win');
        
        // Track referral for NFT mint transaction
        if (address && window.ethereum) {
          try {
            const txData = { 
              to: '0x0000000000000000000000000000000000000000', // Mock NFT contract address
              data: '0x40c10f19', // mint function selector
              value: 0n 
            };
            await addDivviReferral(txData, address);
          } catch (error) {
            console.error('Divvi referral tracking failed:', error);
          }
        }
        
        toast({
          title: "Victory! 🎉",
          description: "You earned 10 points and an NFT!",
        });
      } else {
        toast({
          title: "Game Over",
          description: "Better luck next time!",
          variant: "destructive",
        });
      }
    }
    
    setIsPlaying(false);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setScore({ player: 0, ai: 0 });
    setRound(1);
    setIsPlaying(false);
  };

  const isGameComplete = score.player === 2 || score.ai === 2;

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
              <h1 className="text-3xl font-black">Rock Paper Scissors</h1>
              <p className="text-muted-foreground">Best of 3 rounds</p>
            </div>
          </div>
          
          <Button 
            onClick={resetGame}
            variant="outline"
            size="sm"
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </motion.div>

        {/* Score */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">You</p>
                  <p className="text-3xl font-bold text-primary" data-testid="text-player-score">{score.player}</p>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Round {Math.max(score.player + score.ai + (result ? 0 : 1), 1)}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">AI</p>
                  <p className="text-3xl font-bold text-destructive" data-testid="text-ai-score">{score.ai}</p>
                </div>
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
              <CardTitle className="text-center">
                {isGameComplete 
                  ? (score.player === 2 ? "🎉 You Won!" : "😔 AI Won!")
                  : isPlaying 
                    ? "AI is thinking..." 
                    : "Choose your weapon!"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Player Side */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Your Choice</h3>
                  <motion.div 
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl mb-4"
                    animate={playerChoice ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {playerChoice ? choices.find(c => c.value === playerChoice)?.emoji : "❓"}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    {playerChoice ? choices.find(c => c.value === playerChoice)?.name : "Make your choice"}
                  </p>
                </div>

                {/* AI Side */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">AI Choice</h3>
                  <motion.div 
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-destructive to-orange-500 rounded-full flex items-center justify-center text-4xl mb-4"
                    animate={isPlaying ? { rotate: 360 } : aiChoice ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: isPlaying ? 1 : 0.5, repeat: isPlaying ? Infinity : 0 }}
                  >
                    {isPlaying ? "🤔" : aiChoice ? choices.find(c => c.value === aiChoice)?.emoji : "❓"}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    {isPlaying ? "Thinking..." : aiChoice ? choices.find(c => c.value === aiChoice)?.name : "Waiting..."}
                  </p>
                </div>
              </div>

              {/* Result */}
              {result && !isGameComplete && (
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge 
                    variant={result === 'win' ? 'default' : result === 'lose' ? 'destructive' : 'secondary'}
                    className="text-lg px-4 py-2"
                  >
                    {result === 'win' ? "You Win This Round!" : 
                     result === 'lose' ? "AI Wins This Round!" : 
                     "It's a Tie!"}
                  </Badge>
                </motion.div>
              )}

              {/* Choice Buttons */}
              {!isGameComplete && (
                <div className="grid grid-cols-3 gap-4">
                  {choices.map((choice, index) => (
                    <motion.div
                      key={choice.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleChoice(choice.value)}
                        disabled={isPlaying}
                        variant="outline"
                        className="w-full h-20 text-lg flex flex-col space-y-2 hover:scale-105 transition-transform"
                        data-testid={`button-${choice.value}`}
                      >
                        <span className="text-2xl">{choice.emoji}</span>
                        <span>{choice.name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Play Again Button */}
              {isGameComplete && (
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
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
                <p>• Rock beats Scissors</p>
                <p>• Paper beats Rock</p>
                <p>• Scissors beats Paper</p>
                <p>• First to win 2 rounds wins the game</p>
                <p>• Win the game to earn 10 points and an NFT!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
