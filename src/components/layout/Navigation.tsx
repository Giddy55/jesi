import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, GraduationCap, Target, BarChart3, User, Menu, X, Flame, LogOut, Coins } from "lucide-react";
import coinsIcon from "@/assets/coins-icon.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  activeZone: string;
  onZoneChange: (zone: string) => void;
  userType: "student" | "parent" | "admin";
  user?: any;
  onLogout?: () => void;
  totalCoins?: number;
}

export function Navigation({ activeZone, onZoneChange, userType, user, onLogout, totalCoins = 0 }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const zones = [
    { id: "class", label: "Class Zone", icon: BookOpen, color: "bg-primary" },
    { id: "learn", label: "LearnZone", icon: GraduationCap, color: "bg-accent" },
    { id: "practice", label: "Practice Zone", icon: Target, color: "bg-blue-500" },
    { id: "streak", label: "Streak Zone", icon: Flame, color: "bg-orange-500" },
    { id: "redemption", label: "Reward Store", icon: Coins, color: "bg-yellow-500" },
    { id: "insights", label: "Insight Zone", icon: BarChart3, color: "bg-green-500" },
  ];

  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between" role="banner">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <h1 className="text-lg font-bold text-primary">Jesi AI</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Coins Display - Mobile */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            <img src={coinsIcon} alt="Coins" className="w-4 h-4" />
            <span>{totalCoins}</span>
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background z-50">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
            <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-white border-b shadow-sm" id="mobile-menu" aria-label="Main navigation">
          <div className="p-4 space-y-2">
            {zones.map((zone) => (
                <Button
                key={zone.id}
                variant={activeZone === zone.id ? "default" : "ghost"}
                className="w-full justify-start gap-3 focus-visible-ring"
                onClick={() => {
                  onZoneChange(zone.id);
                  setIsMenuOpen(false);
                }}
                aria-current={activeZone === zone.id ? "page" : undefined}
                aria-label={`Go to ${zone.label}`}
              >
                <zone.icon className="w-5 h-5" aria-hidden="true" />
                {zone.label}
              </Button>
            ))}
          </div>
        </nav>
      )}

      {/* Desktop Navigation */}
      <Card className="hidden lg:block sticky top-4 w-80 h-fit">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Jesi AI</h1>
              <p className="text-sm text-muted-foreground">Learning Platform</p>
            </div>
          </div>


          <nav className="space-y-2" aria-label="Main navigation">
            {zones.map((zone) => (
              <Button
                key={zone.id}
                variant={activeZone === zone.id ? "default" : "ghost"}
                className="w-full justify-start gap-3 h-12 focus-visible-ring"
                onClick={() => onZoneChange(zone.id)}
                aria-current={activeZone === zone.id ? "page" : undefined}
                aria-label={`Go to ${zone.label}`}
              >
                <div className={`w-8 h-8 ${zone.color} rounded-lg flex items-center justify-center`}>
                  <zone.icon className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                {zone.label}
              </Button>
            ))}
          </nav>

          {/* Coins Display - Desktop */}
          <div className="pt-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src={coinsIcon} alt="Coins" className="w-6 h-6" />
                <span className="text-lg font-bold">{totalCoins}</span>
              </div>
              <p className="text-sm opacity-90">Your Coins</p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}