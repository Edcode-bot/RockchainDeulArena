import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RotateCcw, Spade } from "lucide-react";
import { handleGameResult } from "@/utils/gameApi";
import { sendDivviTransaction } from "@/utils/divvi";
import { parseEther } from "viem";

interface Card {
  suit: '♠️' | '♥️' | '♦️' | '♣️';
  value: number;
  face: string;
}

const createDeck = (): Card[] => {
  const suits = ['♠️', '♥️', '♦️', '♣️'] as const;
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  return suits.flatMap(suit =>
    values.map((value, index) => ({ suit, value, face: faces[index] }))
  );
};

const getCardValue = (card: Card, aceHigh: boolean = false): number => {
  if (card.value === 1) return aceHigh ? 11 : 1;
  if (card.value > 10) return 10;
  return card.value;
};

const calculateTotal = (cards: Card[]): number => {
  let total = 0;
  let aces = 0;
  
  for (const card of cards) {
    if (card.value === 1) {
      aces++;
      total += 11;
    } else if (card.value > 10) {
      total += 10;
    } else {
      total += card.value;
    }
  }
  
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  
  return total;
};

export default function Blackjack() {
  const { dispatch } = useGameState();
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [gamePhase, setGamePhase] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [isProcessingTx, setIsProcessingTx] = useState(false);
  const [isBetting, setIsBetting] = useState(false);

  const shuffleDeck = (cards: Card[]): Card[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCard = (): Card => {
    if (deck.length === 0) {
      const newDeck = shuffleDeck(createDeck());
      setDeck(newDeck.slice(1));
      return newDeck[0];
    }
    const card = deck[0];
    setDeck(prev => prev.slice(1));
    return card;
  };

  const startGame = async () => {
    if (!isConnected || !address || isProcessingTx || isBetting) {
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
    setIsBetting(true);

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

      // Deal initial cards
      const shuffledDeck = shuffleDeck(createDeck());
      setDeck(shuffledDeck.slice(4));
      
      const newPlayerCards = [shuffledDeck[0], shuffledDeck[2]];
      const newDealerCards = [shuffledDeck[1], shuffledDeck[3]];
      
      setPlayerCards(newPlayerCards);
      setDealerCards(newDealerCards);
      setGamePhase('playing');

      const playerTotal = calculateTotal(newPlayerCards);
      if (playerTotal === 21) {
        await finishGame('win', betAmount, txHash);
      }

    } catch (error: any) {
      console.error('Bet transaction failed:', error);
      setIsProcessingTx(false);
      setIsBetting(false);
      
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to place bet on blockchain",
        variant: "destructive",
      });
    }
  };

  const hit = () => {
    if (gamePhase !== 'playing') return;
    
    const newCard = dealCard();
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    
    const total = calculateTotal(newPlayerCards);
    if (total > 21) {
      finishGame('lose');
    }
  };

  const stand = () => {
    if (gamePhase !== 'playing') return;
    setGamePhase('dealer');
    
    // Dealer plays
    let newDealerCards = [...dealerCards];
    let dealerTotal = calculateTotal(newDealerCards);
    
    while (dealerTotal < 17) {
      const newCard = dealCard();
      newDealerCards.push(newCard);
      dealerTotal = calculateTotal(newDealerCards);
    }
    
    setDealerCards(newDealerCards);
    
    const playerTotal = calculateTotal(playerCards);
    let result: 'win' | 'lose' | 'draw';
    
    if (dealerTotal > 21) {
      result = 'win';
    } else if (playerTotal > dealerTotal) {
      result = 'win';
    } else if (playerTotal < dealerTotal) {
      result = 'lose';
    } else {
      result = 'draw';
    }
    
    setTimeout(() => finishGame(result), 1000);
  };

  const finishGame = async (result: 'win' | 'lose' | 'draw', betAmount?: string, txHash?: string) => {
    setGameResult(result);
    setGamePhase('finished');

    try {
      const gameResult = await handleGameResult('blackjack', result, address!, betAmount, txHash);
      
      if (result === 'win') {
        dispatch({ type: 'WIN_GAME', payload: { gameType: 'blackjack' } });
        toast({
          title: "Blackjack! 🎉",
          description: `You won! Earned ${gameResult.points} points${gameResult.nftUri ? ' and an NFT!' : '!'}${betAmount ? ` | Bet: ${betAmount} ETH` : ''}`,
        });
      } else if (result === 'draw') {
        toast({
          title: "Push! 🤝",
          description: `It's a tie!${betAmount ? ` | Bet: ${betAmount} ETH` : ''}`,
        });
      } else {
        toast({
          title: "House Wins 😔",
          description: `Better luck next time!${betAmount ? ` | Bet: ${betAmount} ETH` : ''}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Game result error:', error);
    }

    setIsProcessingTx(false);
  };

  const resetGame = () => {
    setPlayerCards([]);
    setDealerCards([]);
    setGamePhase('betting');
    setGameResult(null);
    setIsProcessingTx(false);
    setIsBetting(false);
    setDeck(createDeck());
  };

  const playerTotal = calculateTotal(playerCards);
  const dealerTotal = calculateTotal(dealerCards);

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
              <h1 className="text-3xl font-black">Blackjack Lite</h1>
              <p className="text-muted-foreground">Beat the dealer! (0.01 ETH bet via Divvi)</p>
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
                {gamePhase === 'betting' && (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Ready to Deal!
                  </Badge>
                )}
                {gamePhase === 'playing' && (
                  <Badge variant="default" className="text-lg px-4 py-2">
                    Your Total: {playerTotal}
                  </Badge>
                )}
                {gamePhase === 'dealer' && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Dealer Playing...
                  </Badge>
                )}
                {gamePhase === 'finished' && gameResult && (
                  <Badge 
                    variant={gameResult === 'win' ? 'default' : gameResult === 'draw' ? 'secondary' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {gameResult === 'win' ? "🎉 You Won!" : gameResult === 'draw' ? "🤝 Push!" : "😔 House Wins!"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Table */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <Spade className="mr-2" />
                Blackjack Table
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Dealer Cards */}
              <div className="text-center">
                <h3 className="font-bold mb-4">Dealer {gamePhase !== 'betting' && gamePhase !== 'playing' ? `(${dealerTotal})` : ''}</h3>
                <div className="flex justify-center space-x-2 mb-4">
                  {dealerCards.map((card, index) => (
                    <div key={index} className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-black font-bold">
                      {index === 1 && gamePhase === 'playing' ? (
                        <div className="text-4xl">🂠</div>
                      ) : (
                        <>
                          <div className="text-2xl">{card.suit}</div>
                          <div className="text-sm">{card.face}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Player Cards */}
              <div className="text-center">
                <h3 className="font-bold mb-4">You {gamePhase !== 'betting' ? `(${playerTotal})` : ''}</h3>
                <div className="flex justify-center space-x-2">
                  {playerCards.map((card, index) => (
                    <div key={index} className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center text-black font-bold">
                      <div className="text-2xl">{card.suit}</div>
                      <div className="text-sm">{card.face}</div>
                    </div>
                  ))}
                </div>
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
              <div className="flex justify-center space-x-4">
                {gamePhase === 'betting' && (
                  <Button
                    onClick={startGame}
                    disabled={!isConnected || isProcessingTx || isBetting}
                    className="text-lg px-8 py-4"
                    data-testid="button-deal"
                  >
                    {isProcessingTx ? "Processing..." : "Deal Cards"}
                  </Button>
                )}
                {gamePhase === 'playing' && (
                  <>
                    <Button
                      onClick={hit}
                      disabled={isProcessingTx}
                      className="text-lg px-8 py-4"
                      data-testid="button-hit"
                    >
                      Hit
                    </Button>
                    <Button
                      onClick={stand}
                      disabled={isProcessingTx}
                      variant="outline"
                      className="text-lg px-8 py-4"
                      data-testid="button-stand"
                    >
                      Stand
                    </Button>
                  </>
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
                  <p>• Connect wallet and place 0.01 ETH bet via Divvi</p>
                  <p>• Get as close to 21 as possible without going over</p>
                  <p>• Face cards worth 10, Aces worth 1 or 11</p>
                </div>
                <div>
                  <p>• Hit to draw cards, Stand when satisfied</p>
                  <p>• Beat the dealer to earn 10 points and NFT!</p>
                  <p>• All transactions tracked with referral rewards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}