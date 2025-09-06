
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
import { handleGameResult, playSound as playGameSound } from "@/utils/gameApi";
import { sendDivviTransaction } from "@/utils/divvi";
import { parseEther } from "viem";

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw' | null;

const choices: Choice[] = ['rock', 'paper', 'scissors'];
const emojis: Record<Choice, string> = {
  rock: '🪨',
  paper: '📄', 
  scissors: '✂️'
};

const getWinner = (player: Choice, computer: Choice): GameResult => {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
};

export default function RPS() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [isBetting, setIsBetting] = useState(false);

  const handleChoice = async (choice: Choice) => {
    if (isRevealing || !isConnected || !address || isBetting) {
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
    setIsRevealing(true);
    setShowResult(false);
    setIsProcessingTx(true);
    setIsBetting(true);
    playGameSound('click');
    
    try {
      // Place Divvi bet transaction
      toast({
        title: "Placing bet...",
        description: "Confirm the transaction in your wallet",
      });

      const betAmount = "0.01";
      const txHash = await sendDivviTransaction({
        account: address as `0x${string}`,
        to: "0xe38a456433FfF7814e40998cf0Cbbbd2c885B513" as `0x${string}`,
        data: "0x",
        value: parseEther(betAmount),
      });

      toast({
        title: "Bet placed! 🎲",
        description: `Transaction: ${txHash.slice(0, 10)}...`,
      });

      setIsBetting(false);
      
      // Simulate computer choice animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const compChoice = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(compChoice);
      setIsRevealing(false);
      
      // Determine winner
      const gameResult = getWinner(choice, compChoice);
      setResult(gameResult);
      
      // Handle game result with bet data
      const result = await handleGameResult('rps', gameResult as 'win' | 'lose' | 'draw', address, betAmount, txHash);
      
      setTimeout(async () => {
        setShowResult(true);
        
        if (gameResult === 'win') {
          dispatch({ type: 'WIN_GAME', payload: { gameType: 'rps' } });
          playSound('win');
          
          toast({
            title: "Victory! 🎉",
            description: `You earned ${result.points} points${result.nftUri ? ' and an NFT!' : '!'} | Bet: ${betAmount} ETH`,
          });
        } else if (gameResult === 'draw') {
          toast({
            title: "It's a Draw!",
            description: `Draw! Try again! | Bet: ${betAmount} ETH`,
          });
        } else {
          toast({
            title: "You Lost!",
            description: `Better luck next time! | Bet: ${betAmount} ETH`,
            variant: "destructive",
          });
        }
        
        setIsProcessingTx(false);
      }, 1000);

    } catch (error: any) {
      console.error('Bet transaction failed:', error);
      setIsProcessingTx(false);
      setIsBetting(false);
      setIsRevealing(false);
      
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to place bet on blockchain",
        variant: "destructive",
      });
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setIsRevealing(false);
    setShowResult(false);
    setIsProcessingTx(false);
    setIsBetting(false);
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
              <h1 className="text-3xl font-black">Rock Paper Scissors</h1>
              <p className="text-muted-foreground">Beat the computer! (0.01 ETH bet via Divvi)</p>
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
                    variant={result === 'win' ? 'default' : result === 'draw' ? 'secondary' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {result === 'win' ? "🎉 You Won!" : result === 'draw' ? "🤝 Draw!" : "😔 You Lost!"}
                  </Badge>
                ) : !isProcessingTx && isRevealing ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🤖 Computer is choosing...
                  </Badge>
                ) : !isProcessingTx && playerChoice ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    You chose: {emojis[playerChoice]} {playerChoice}
                  </Badge>
                ) : !isProcessingTx ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Choose your move!
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Arena */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Battle Arena</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8 mb-8">
                {/* Player Side */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">You</h3>
                  <motion.div 
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-4xl border-2 border-primary/30"
                    animate={isRevealing ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isRevealing ? Infinity : 0 }}
                  >
                    {playerChoice ? emojis[playerChoice] : '❓'}
                  </motion.div>
                  {playerChoice && (
                    <p className="mt-2 font-medium capitalize">{playerChoice}</p>
                  )}
                </div>

                {/* VS */}
                <div className="text-center flex items-center justify-center">
                  <motion.div 
                    className="text-2xl font-bold"
                    animate={isRevealing ? { rotate: [0, 180, 360] } : {}}
                    transition={{ duration: 1, repeat: isRevealing ? Infinity : 0 }}
                  >
                    ⚔️
                  </motion.div>
                </div>

                {/* Computer Side */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Computer</h3>
                  <motion.div 
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary/20 to-destructive/20 rounded-full flex items-center justify-center text-4xl border-2 border-secondary/30"
                    animate={isRevealing ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isRevealing ? Infinity : 0 }}
                  >
                    {computerChoice ? emojis[computerChoice] : '🤖'}
                  </motion.div>
                  {computerChoice && (
                    <p className="mt-2 font-medium capitalize">{computerChoice}</p>
                  )}
                </div>
              </div>

              {/* Choice Buttons */}
              {!showResult && isConnected && (
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  {choices.map((choice, index) => (
                    <motion.div
                      key={choice}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleChoice(choice)}
                        disabled={isRevealing || isProcessingTx}
                        variant="outline"
                        className="w-full h-20 text-lg flex flex-col space-y-2 hover:scale-105 transition-transform"
                        data-testid={`button-${choice}`}
                      >
                        <span className="text-3xl">{emojis[choice]}</span>
                        <span className="capitalize">{choice}</span>
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
                <p>• Connect your wallet to play</p>
                <p>• Choose Rock (🪨), Paper (📄), or Scissors (✂️)</p>
                <p>• Rock beats Scissors, Scissors beats Paper, Paper beats Rock</p>
                <p>• Win to earn 10 points and an NFT URI!</p>
                <p>• Instant play - no blockchain transactions required</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
