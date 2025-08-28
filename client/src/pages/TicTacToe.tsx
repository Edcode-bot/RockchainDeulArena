import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState, playSound } from "@/state/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw } from "lucide-react";

type Cell = 'X' | 'O' | null;
type Board = Cell[];
type GameResult = 'win' | 'lose' | 'tie' | null;

export default function TicTacToe() {
  const { state, dispatch } = useGameState();
  const { toast } = useToast();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState<GameResult>(null);
  const [isThinking, setIsThinking] = useState(false);

  const checkWinner = (board: Board): 'X' | 'O' | 'tie' | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.every(cell => cell !== null) ? 'tie' : null;
  };

  const getBestMove = (board: Board): number => {
    // Simple AI that tries to win, block, or take center/corners
    const available = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    // Try to win
    for (const move of available) {
      const testBoard = [...board];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') {
        return move;
      }
    }

    // Try to block player win
    for (const move of available) {
      const testBoard = [...board];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') {
        return move;
      }
    }

    // Take center if available
    if (available.includes(4)) {
      return 4;
    }

    // Take corners
    const corners = [0, 2, 6, 8].filter(i => available.includes(i));
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleCellClick = async (index: number) => {
    if (board[index] || !isPlayerTurn || result || isThinking) return;

    playSound('click');
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleGameEnd(winner);
      return;
    }

    // AI turn
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiMove = getBestMove(newBoard);
    newBoard[aiMove] = 'O';
    setBoard(newBoard);
    setIsThinking(false);

    const finalWinner = checkWinner(newBoard);
    if (finalWinner) {
      handleGameEnd(finalWinner);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const handleGameEnd = (winner: 'X' | 'O' | 'tie') => {
    let gameResult: GameResult;
    
    if (winner === 'X') {
      gameResult = 'win';
      dispatch({ type: 'WIN_GAME', payload: { gameType: 'ttt' } });
      playSound('win');
      toast({
        title: "Victory! 🎉",
        description: "You earned 10 points and an NFT!",
      });
    } else if (winner === 'O') {
      gameResult = 'lose';
      toast({
        title: "Game Over",
        description: "AI wins! Try again!",
        variant: "destructive",
      });
    } else {
      gameResult = 'tie';
      toast({
        title: "It's a Tie!",
        description: "Well played! Try again for the win!",
      });
    }
    
    setResult(gameResult);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setResult(null);
    setIsThinking(false);
  };

  const getCellContent = (cell: Cell, index: number) => {
    if (cell === 'X') return <span className="text-primary text-2xl font-bold">X</span>;
    if (cell === 'O') return <span className="text-destructive text-2xl font-bold">O</span>;
    return null;
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
              <p className="text-muted-foreground">Beat the AI to win!</p>
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
                {result ? (
                  <Badge 
                    variant={result === 'win' ? 'default' : result === 'lose' ? 'destructive' : 'secondary'}
                    className="text-lg px-4 py-2"
                  >
                    {result === 'win' ? "🎉 You Won!" : 
                     result === 'lose' ? "😔 AI Won!" : 
                     "🤝 It's a Tie!"}
                  </Badge>
                ) : isThinking ? (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    🤔 AI is thinking...
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {isPlayerTurn ? "Your turn (X)" : "AI's turn (O)"}
                  </Badge>
                )}
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
            <CardContent className="pt-6">
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {board.map((cell, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={!isPlayerTurn || !!result || isThinking || cell !== null}
                      className="aspect-square bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center text-2xl font-bold border border-border disabled:cursor-not-allowed transition-all"
                      whileHover={cell === null && isPlayerTurn && !result && !isThinking ? { scale: 1.05 } : {}}
                      whileTap={cell === null && isPlayerTurn && !result && !isThinking ? { scale: 0.95 } : {}}
                      data-testid={`cell-${index}`}
                    >
                      {getCellContent(cell, index)}
                    </motion.button>
                  ))}
                </div>

                {result && (
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
                <p>• You are X, AI is O</p>
                <p>• Get three in a row (horizontal, vertical, or diagonal) to win</p>
                <p>• AI will try to block your moves and win</p>
                <p>• Beat the AI to earn 10 points and an NFT!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
