import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GameStateProvider } from "@/state/store";
import { WalletProvider, useWallet } from "@/wallet/reown";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import RPS from "@/pages/RPS";
import TicTacToe from "@/pages/TicTacToe";
import GuessNumber from "@/pages/GuessNumber";
import CoinFlip from "@/pages/CoinFlip";
import DiceRoll from "@/pages/DiceRoll";
import Profile from "@/pages/Profile";
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/not-found";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

function Router() {
  const [location] = useLocation();
  const { isConnected } = useWallet();

  // If not connected, only show Landing page
  if (!isConnected) {
    return (
      <div className="min-h-screen animated-bg">
        <Landing />
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <Header />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/rps" component={RPS} />
        <Route path="/tictactoe" component={TicTacToe} />
        <Route path="/guessnumber" component={GuessNumber} />
        <Route path="/coinflip" component={CoinFlip} />
        <Route path="/diceroll" component={DiceRoll} />
        <Route path="/profile" component={Profile} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ThemeProvider>
          <GameStateProvider>
            <TooltipProvider>
              <div id="appkit-container" />
              <Toaster />
              <Router />
            </TooltipProvider>
          </GameStateProvider>
        </ThemeProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
