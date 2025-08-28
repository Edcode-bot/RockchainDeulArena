import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GameStateProvider } from "@/state/store";
import { WalletProvider } from "@/wallet/reown";

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
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  const [location] = useLocation();
  const isLanding = location === "/";

  return (
    <div className="min-h-screen animated-bg">
      {!isLanding && <Header />}
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/rps">
          <ProtectedRoute>
            <RPS />
          </ProtectedRoute>
        </Route>
        <Route path="/tictactoe">
          <ProtectedRoute>
            <TicTacToe />
          </ProtectedRoute>
        </Route>
        <Route path="/guessnumber">
          <ProtectedRoute>
            <GuessNumber />
          </ProtectedRoute>
        </Route>
        <Route path="/coinflip">
          <ProtectedRoute>
            <CoinFlip />
          </ProtectedRoute>
        </Route>
        <Route path="/diceroll">
          <ProtectedRoute>
            <DiceRoll />
          </ProtectedRoute>
        </Route>
        <Route path="/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>
        <Route path="/leaderboard">
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      {!isLanding && <BottomNav />}
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
