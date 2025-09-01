
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Target, TrendingUp, TrendingDown } from "lucide-react";
import { placeBetTransaction, mintNFTTransaction } from "@/utils/divvi";

export default function GuessNumber() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState<string[]>([]);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isProcessingTx, setIsProcessingTx] = useState(false);

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

    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to play",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingTx(true);
    playSound('click');

    try {
      // Place bet transaction (gameType: 3 for GuessNumber, prediction: guessed number)
      toast({
        title: "Placing bet...",
        description: "Confirm the transaction in your wallet",
      });

      const betTxHash = await placeBetTransaction(address, 3, guessNumber, '0.01');
      
      toast({
        title: "Bet placed! 🎲",
        description: `Transaction: ${betTxHash.slice(0, 10)}...`,
      });

      setIsRevealing(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (guessNumber === targetNumber) {
        setGameResult('win');
        dispatch({ type: 'WIN_GAME', payload: { gameType: 'guess' } });
        playSound('win');
        
        try {
          // Mint NFT transaction
          toast({
            title: "Minting NFT...",
            description: "Confirm the NFT mint transaction",
          });

          const mintTxHash = await mintNFTTransaction(address);
          
          toast({
            title: "Perfect Guess! 🎉",
            description: `You found ${targetNumber} in ${newAttempts} attempts! NFT minted! Tx: ${mintTxHash.slice(0, 10)}...`,
          });
        } catch (error: any) {
          console.error('NFT mint failed:', error);
          toast({
            title: "Win recorded, NFT mint failed",
            description: error.message || "NFT minting transaction failed",
            variant: "destructive",
          });
        }
      } else if (newAttempts >= maxAttempts) {
        setGameResult('lose');
        const newHint = `Game Over! The number was ${targetNumber}`;
        setHints(prev => [...prev, newHint]);
        toast({
          title: "Game Over!",
          description: `The number was ${targetNumber}. Try again!`,
          variant: "destructive",
        });
      } else {
        const newHint = guessNumber < targetNumber 
          ? `${guessNumber} is too low! 📈` 
          : `${guessNumber} is too high! 📉`;
        setHints(prev => [...prev, newHint]);
        
        toast({
          title: guessNumber < targetNumber ? "Too Low!" : "Too High!",
          description: `${maxAttempts - newAttempts} attempts remaining`,
        });
      }

      setGuess("");
      setIsRevealing(false);
      setIsProcessingTx(false);

    } catch (error: any) {
      console.error('Bet transaction failed:', error);
      setIsProcessingTx(false);
      setIsRevealing(false);
      
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to place bet on blockchain",
        variant: "destructive",
      });
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setHints([]);
    setGameResult(null);
    setIsRevealing(false);
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
              <h1 className="text-3xl font-black">Guess the Number</h1>
              <p className="text-muted-foreground">Find the number 1-100! (0.01 cUSD bet per guess)</p>
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
            New Number
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
                {!isProcessingTx && gameResult ? (
                  <Badge 
                    variant={gameResult === 'win' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {gameResult === 'win' ? "🎉 You Won!" : "😔 Game Over!"}
                  </Badge>
                ) : !isProcessingTx && isRevealing ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🎯 Checking your guess...
                  </Badge>
                ) : !isProcessingTx ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Attempts: {attempts}/{maxAttempts}
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Interface */}
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
                <span>Guess the Secret Number</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto space-y-6">
                {/* Number Range Display */}
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20">
                  <div className="text-4xl font-bold mb-2">1 - 100</div>
                  <div className="text-muted-foreground">Range</div>
                </div>

                {/* Input and Submit */}
                {!gameResult && isConnected && (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Enter your guess (1-100)"
                        className="text-center text-lg h-12"
                        disabled={isRevealing || isProcessingTx}
                        data-testid="input-guess"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !isRevealing && !isProcessingTx) {
                            handleGuess();
                          }
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Button
                        onClick={handleGuess}
                        disabled={!guess || isRevealing || isProcessingTx}
                        className="w-full h-12 text-lg connect-btn"
                        data-testid="button-guess"
                      >
                        {isProcessingTx ? "Processing..." : isRevealing ? "Checking..." : "Submit Guess"}
                      </Button>
                    </motion.div>
                  </div>
                )}

                {/* Hints Display */}
                {hints.length > 0 && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="font-semibold text-center">Hints:</h3>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {hints.map((hint, index) => (
                        <motion.div
                          key={index}
                          className="p-2 bg-secondary/50 rounded text-sm text-center flex items-center justify-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {hint.includes('low') && <TrendingUp className="h-4 w-4 text-red-500" />}
                          {hint.includes('high') && <TrendingDown className="h-4 w-4 text-blue-500" />}
                          <span>{hint}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Play Again Button */}
                {gameResult && !isProcessingTx && (
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
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Connect your wallet to place bets</p>
                <p>• Guess a number between 1 and 100</p>
                <p>• Each guess costs 0.01 cUSD bet on Celo mainnet</p>
                <p>• You have {maxAttempts} attempts to find the number</p>
                <p>• Get hints if your guess is too high or too low</p>
                <p>• Find the exact number to earn 10 points and an NFT!</p>
                <p>• All transactions are real and recorded on Celo blockchain</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
