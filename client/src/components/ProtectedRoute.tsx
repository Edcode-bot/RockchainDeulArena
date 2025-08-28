import { useEffect } from "react";
import { useLocation } from "wouter";
import { useWallet } from "@/wallet/reown";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected } = useWallet();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isConnected) {
      setLocation("/");
    }
  }, [isConnected, setLocation]);

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
}
