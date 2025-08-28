import { Button } from "@/components/ui/button";
import { useWallet } from "@/wallet/reown";
import { Wallet } from "lucide-react";

export function ConnectButton() {
  const { isConnected, address, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <Button
        onClick={disconnect}
        variant="outline"
        data-testid="button-disconnect"
        className="px-6 py-3 rounded-xl font-semibold"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button
      onClick={connect}
      data-testid="button-connect"
      className="connect-btn px-8 py-4 rounded-xl font-bold text-lg text-primary-foreground"
    >
      <Wallet className="mr-2" />
      Connect Wallet & Start Dueling
    </Button>
  );
}
