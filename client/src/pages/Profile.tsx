import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGameState } from "@/state/store";
import { useWallet } from "@/wallet/reown";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User, 
  Trophy, 
  Gift, 
  Zap, 
  Wallet, 
  Moon, 
  Sun, 
  Globe, 
  ExternalLink,
  Copy,
  DollarSign
} from "lucide-react";

// 🔥 Divvi SDK + Viem
import { getReferralTag, submitReferral } from "@divvi/referral-sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

export default function Profile() {
  const { state } = useGameState();
  const { address, balance, disconnect } = useWallet();
  const { theme, language, toggleTheme, toggleLanguage } = useTheme();
  const { toast } = useToast();

  // 📌 Copy Wallet Address
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  // 📌 Convert Points to cUSD (future)
  const handleConvertToCUSD = () => {
    toast({
      title: "Convert to cUSD",
      description: "This feature will be available soon! Your points will be convertible to cUSD rewards.",
    });
  };

  // 📌 Share on Farcaster (future)
  const handleShareOnFarcaster = () => {
    toast({
      title: "Share on Farcaster",
      description: "Social sharing feature coming soon! Share your gaming achievements with the community.",
    });
  };

  // 📌 Claim Referral Reward (Divvi integration)
  const handleClaimReferral = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "Wallet Missing",
          description: "Please connect a wallet first.",
          variant: "destructive",
        });
        return;
      }

      // Create wallet client
      const client = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

      const [account] = await client.getAddresses();

      // Get referral tag from Divvi
      const tag = getReferralTag();

      // Send dummy 0 CELO transaction with referral tag
      const hash = await client.sendTransaction({
        account,
        to: account,
        value: 0n,
        data: tag as `0x${string}`,
      });

      // Report transaction to Divvi
      await submitReferral({ txHash: hash, chainId: mainnet.id });

      toast({
        title: "Referral Claimed 🎉",
        description: "Your referral reward has been recorded!",
      });
    } catch (error) {
      console.error("Referral claim failed:", error);
      toast({
        title: "Error",
        description: "Failed to claim referral reward. Try again.",
        variant: "destructive",
      });
    }
  };

  // 📌 NFT display name
  const getNFTDisplayName = (nftUri: string) => {
    const gameType = nftUri.split('/')[2]?.split('-')[0];
    switch (gameType) {
      case 'rps': return 'Rock Paper Scissors Champion';
      case 'ttt': return 'Tic Tac Toe Master';
      case 'guess': return 'Number Oracle';
      case 'coin': return 'Coin Flip Prophet';
      case 'dice': return 'Dice Roll Sage';
      default: return 'Gaming NFT';
    }
  };

  // 📌 Translations
  const translations = {
    en: {
      profile: "Profile",
      wallet: "Wallet",
      settings: "Settings",
      nftCollection: "NFT Collection",
      darkMode: "Dark Mode",
      language: "Language",
      english: "English",
      swahili: "Swahili",
    },
    sw: {
      profile: "Wasifu",
      wallet: "Mkoba",
      settings: "Mipangilio",
      nftCollection: "Mkusanyiko wa NFT",
      darkMode: "Hali ya Giza",
      language: "Lugha",
      english: "Kiingereza",
      swahili: "Kiswahili",
    }
  };

  const t = translations[language];

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
              <h1 className="text-3xl font-black">{t.profile}</h1>
              <p className="text-muted-foreground">Manage your gaming profile</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Overview */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">RockChain Duelist</h2>
                  <p className="text-muted-foreground">Gaming since 2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold" data-testid="text-profile-points">{state.points}</div>
                  <div className="text-sm text-muted-foreground">Points</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Gift className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold" data-testid="text-profile-nfts">{state.nfts.length}</div>
                  <div className="text-sm text-muted-foreground">NFTs</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Zap className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold" data-testid="text-profile-streak">{state.streak}</div>
                  <div className="text-sm text-muted-foreground">Streak</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Trophy className="h-8 w-8 text-foreground mx-auto mb-2" />
                  <div className="text-2xl font-bold">#42</div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>{t.wallet}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-mono text-sm" data-testid="text-wallet-address">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                  </p>
                </div>
                <Button 
                  onClick={handleCopyAddress}
                  variant="ghost" 
                  size="sm"
                  data-testid="button-copy-address"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="font-semibold" data-testid="text-wallet-balance">
                    {balance ? `${parseFloat(balance).toFixed(4)} CELO` : "0 CELO"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleConvertToCUSD}
                  className="w-full"
                  variant="outline"
                  data-testid="button-convert-cusd"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Convert Points to cUSD
                </Button>

                <Button 
                  onClick={handleShareOnFarcaster}
                  className="w-full"
                  variant="outline"
                  data-testid="button-share-farcaster"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Share on Farcaster
                </Button>

                {/* 🔥 Divvi Claim Button */}
                <Button 
                  onClick={handleClaimReferral}
                  className="w-full"
                  variant="default"
                  data-testid="button-claim-referral"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Claim Referral Reward
                </Button>

                <Button 
                  onClick={disconnect}
                  className="w-full"
                  variant="destructive"
                  data-testid="button-disconnect-wallet"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t.settings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <p className="font-medium">{t.darkMode}</p>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={toggleTheme}
                  data-testid="switch-theme"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t.language}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" ? t.english : t.swahili}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={toggleLanguage}
                  variant="outline"
                  size="sm"
                  data-testid="button-toggle-language"
                >
                  {language === "en" ? "SW" : "EN"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* NFT Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>{t.nftCollection}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.nfts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {state.nfts.map((nft, index) => (
                    <motion.div
                      key={index}
                      className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-border p-4 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      data-testid={`nft-${index}`}
                    >
                      <div className="text-3xl mb-2">🏆</div>
                      <p className="text-xs font-semibold mb-1">
                        {getNFTDisplayName(nft)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        NFT #{index + 1}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Gift className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No NFTs Yet</p>
                  <p className="text-sm">Win games to start collecting NFTs!</p>
                  <Link href="/dashboard">
                    <Button className="mt-4" data-testid="button-start-playing">
                      Start Playing
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}