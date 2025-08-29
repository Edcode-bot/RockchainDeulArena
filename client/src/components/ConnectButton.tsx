
import { Button } from "@/components/ui/button";
import { useWallet } from "@/wallet/reown";
import { Wallet } from "lucide-react";

export function ConnectButton() {
  const { openModal } = useWallet();

  return (
    <Button
      onClick={openModal}
      data-testid="button-connect"
      className="connect-btn px-8 py-4 rounded-xl font-bold text-lg text-primary-foreground"
    >
      <Wallet className="mr-2" />
      Connect Wallet & Start Dueling
    </Button>
  );
}
