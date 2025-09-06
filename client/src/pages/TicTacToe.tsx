
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Grid3x3 } from "lucide-react";
import { handleGameResult, playSound as playGameSound } from "@/utils/gameApi";

type Cell = 'X' | 'O' | null;
type Board = Cell[];

const initialBoard: Board = Array(9).fill(null);

const checkWinner = (board: Board): 'X' | 'O' | 'draw' | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.every(cell => cell !== null) ? 'draw' : null;
};

const getBestMove = (board: Board): number => {
  // Simple AI: try to win, then block, then random
  const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  
  // Try to win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'O';
    if (checkWinner(testBoard) === 'O') return move;
  }
  
  // Try to block
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'X';
    if (checkWinner(testBoard) === 'X') return move;
  }
  
  // Random move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

export default function TicTacToe() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const [board, setBoard] = useState<Board>(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  const handleCellClick = async (index: number) => {
    if (board[index] || !isPlayerTurn || gameResult || !isConnected || !address || isProcessingTx) {
      if (!isConnected) {
        toast({
          title: "Wallet not connected",
          description: "Please connect your wallet to play",
          variant: "destructive",
        });
      }
      return;
    }

    setIsProcessingTx(true);
    playGameSound('click');

    try {
      // Make player move
      const newBoard = [...board];
      newBoard[index] = 'X';
      setBoard(newBoard);
      setIsPlayerTurn(false);

      // Check for win/draw after player move
      const result = checkWinner(newBoard);
      if (result) {
        if (result === 'X') {
          setGameResult('win');
          dispatch({ type: 'WIN_GAME', payload: { gameType: 'tictactoe' } });
          playSound('win');
          
          // Handle game result
          const gameResult = await handleGameResult('tictactoe', 'win', address);
          
          toast({
            title: "Victory! 🎉",
            description: `You earned ${gameResult.points} points${gameResult.nftUri ? ' and an NFT!' : '!'}`,
          });
        } else {
          setGameResult('draw');
          await handleGameResult('tictactoe', 'draw', address);
          toast({
            title: "It's a Draw!",
            description: "Good game! Try again for the win!",
          });
        }
        setIsProcessingTx(false);
        return;
      }

      // Computer turn
      setIsComputerThinking(true);
      setTimeout(async () => {
        const computerMove = getBestMove(newBoard);
        const computerBoard = [...newBoard];
        computerBoard[computerMove] = 'O';
        setBoard(computerBoard);
        setIsComputerThinking(false);

        // Check for win/draw after computer move
        const computerResult = checkWinner(computerBoard);
        if (computerResult) {
          if (computerResult === 'O') {
            setGameResult('lose');
            await handleGameResult('tictactoe', 'lose', address);
            toast({
              title: "Computer Wins!",
              description: "Better luck next time!",
              variant: "destructive",
            });
          } else {
            setGameResult('draw');
            await handleGameResult('tictactoe', 'draw', address);
            toast({
              title: "It's a Draw!",
              description: "Good game! Try again for the win!",
            });
          }
        } else {
          setIsPlayerTurn(true);
        }
        setIsProcessingTx(false);
      }, 1000);

    } catch (error: any) {
      console.error('Game failed:', error);
      setIsProcessingTx(false);
      
      toast({
        title: "Game failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setGameResult(null);
    setIsComputerThinking(false);
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
              <h1 className="text-3xl font-black">Tic Tac Toe</h1>
              <p className="text-muted-foreground">Beat the AI and earn points!</p>
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
                {!isProcessingTx && gameResult ? (
                  <Badge 
                    variant={gameResult === 'win' ? 'default' : gameResult === 'draw' ? 'secondary' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {gameResult === 'win' ? "🎉 You Won!" : gameResult === 'draw' ? "🤝 Draw!" : "😔 You Lost!"}
                  </Badge>
                ) : !isProcessingTx && isComputerThinking ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🤖 Computer is thinking...
                  </Badge>
                ) : !isProcessingTx && isPlayerTurn ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Your turn! (X)
                  </Badge>
                ) : !isProcessingTx ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Computer's turn (O)
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <Grid3x3 className="h-6 w-6" />
                <span>Game Board</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div className="grid grid-cols-3 gap-2 aspect-square">
                  {board.map((cell, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={!isConnected || !isPlayerTurn || !!cell || !!gameResult || isProcessingTx}
                      className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 rounded-lg flex items-center justify-center text-4xl font-bold hover:border-primary/40 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      whileHover={!cell && isPlayerTurn && isConnected ? { scale: 1.05 } : {}}
                      whileTap={!cell && isPlayerTurn && isConnected ? { scale: 0.95 } : {}}
                      data-testid={`cell-${index}`}
                    >
                      {cell && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3 }}
                          className={cell === 'X' ? 'text-primary' : 'text-destructive'}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Player vs Computer Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">X</div>
                    <div className="text-sm text-muted-foreground">You</div>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">O</div>
                    <div className="text-sm text-muted-foreground">Computer</div>
                  </div>
                </div>

                {/* Play Again Button */}
                {gameResult && !isProcessingTx && (
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
                <p>• Connect your wallet to play</p>
                <p>• Click any empty cell to place your X</p>
                <p>• Get 3 X's in a row, column, or diagonal to win</p>
                <p>• Beat the AI to earn 10 points and an NFT URI!</p>
                <p>• Instant play - no blockchain transactions required</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
