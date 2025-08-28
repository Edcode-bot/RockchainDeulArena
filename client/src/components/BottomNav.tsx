import { Link, useLocation } from "wouter";
import { Home, Gamepad2, Trophy, User } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home", testId: "nav-home" },
    { href: "/rps", icon: Gamepad2, label: "Games", testId: "nav-games" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard", testId: "nav-leaderboard" },
    { href: "/profile", icon: User, label: "Profile", testId: "nav-profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href} data-testid={item.testId}>
              <div className={`flex flex-col items-center p-3 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}>
                <Icon className="text-lg mb-1" />
                <span className="text-xs">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
