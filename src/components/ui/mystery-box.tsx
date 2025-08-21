import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface MysteryBoxProps {
  onOpen: (coins: number) => void;
  className?: string;
}

export function MysteryBox({ onOpen, className }: MysteryBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    
    setTimeout(() => {
      const coins = Math.floor(Math.random() * 50) + 10; // 10-60 coins
      setIsOpened(true);
      onOpen(coins);
      
      setTimeout(() => {
        setIsOpening(false);
      }, 2000);
    }, 1000);
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-8 text-center">
        <div className="relative">
          {!isOpened ? (
            <div className={cn(
              "transition-all duration-1000",
              isOpening && "animate-bounce scale-110"
            )}>
              <Gift className="w-24 h-24 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-bold mb-2">Mystery Box! 🎁</h3>
              <p className="text-muted-foreground mb-4">
                You've earned a surprise reward!
              </p>
              <Button
                onClick={handleOpen}
                disabled={isOpening}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isOpening ? "Opening..." : "Open Box"}
              </Button>
            </div>
          ) : (
            <div className="animate-scale-in">
              <div className="relative">
                <Coins className="w-24 h-24 mx-auto mb-4 text-yellow-500 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <Coins className="w-24 h-24 mx-auto text-yellow-300 opacity-75" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-yellow-600">Congratulations! 🎉</h3>
              <p className="text-muted-foreground">
                You earned coins for completing your homework!
              </p>
            </div>
          )}
        </div>
        
        {isOpening && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
}