import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <a href="/dashboard" className="nav-link">
              Dashboard
            </a>
          </div>
          
          {/* Theme Toggle and Sign Out */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl bg-secondary/50 hover:bg-accent border border-border/50 transition-all duration-300 hover:scale-105"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};