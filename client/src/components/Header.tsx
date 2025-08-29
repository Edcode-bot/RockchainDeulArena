import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useWallet } from "@/wallet/reown";
import { Moon, Sun, Globe, Menu, Dice1, LogOut, Wallet } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();
  const { address, balance, disconnect } = useWallet();

  const translations = {
    en: {
      games: "Games",
      features: "Features",
      reviews: "Reviews",
      disconnect: "Disconnect",
    },
    sw: {
      games: "Michezo",
      features: "Vipengele",
      reviews: "Maoni",
      disconnect: "Ondoa",
    }
  };

  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" data-testid="link-logo">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Dice1 className="text-white text-sm" />
              </div>
              <span className="font-bold text-xl text-foreground">RockChain</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link href="/dashboard" data-testid="link-games">
                <span className={`transition-colors ${location === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {t.games}
                </span>
              </Link>
              <Link href="/leaderboard" data-testid="link-leaderboard">
                <span className={`transition-colors ${location === "/leaderboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  Leaderboard
                </span>
              </Link>
              <Link href="/profile" data-testid="link-profile">
                <span className={`transition-colors ${location === "/profile" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  Profile
                </span>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                data-testid="button-language"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80"
              >
                <Globe className="text-sm" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                data-testid="button-theme"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80"
              >
                {theme === "dark" ? <Sun className="text-sm" /> : <Moon className="text-sm" />}
              </Button>
              
              {/* Wallet Info */}
              {address && (
                <div className="flex items-center space-x-2">
                  {balance && (
                    <div className="flex items-center space-x-1 text-sm bg-primary/20 text-primary px-3 py-1 rounded-lg">
                      <Wallet className="text-xs" />
                      <span>{parseFloat(balance).toFixed(3)} CELO</span>
                    </div>
                  )}
                  <div className="text-sm bg-muted px-3 py-1 rounded-lg" data-testid="text-address">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnect}
                    data-testid="button-disconnect"
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-red-500 hover:text-red-600"
                    title={t.disconnect}
                  >
                    <LogOut className="text-sm" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" data-testid="button-menu">
              <Menu />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
