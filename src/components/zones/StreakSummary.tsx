import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SemiCircleProgress } from "@/components/ui/semi-circle-progress";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";


interface StreakSummaryProps {
  dailyProgress: number; // 0-100 (kept for future use)
  currentStreak: number;
  coins?: number;
}

export function StreakSummary({ dailyProgress, currentStreak, coins = 0 }: StreakSummaryProps) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date().getDay();
  // Fill based on selected day position in the week (e.g., Monday ≈ ~17-20%)
  const percent = (today / (days.length - 1)) * 100;

  const [displayedCoins, setDisplayedCoins] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setFinished(false);
    setDisplayedCoins(0);
    const duration = 1000;
    const start = performance.now();
    let raf = 0 as number;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayedCoins(Math.floor(eased * coins));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplayedCoins(coins);
        setFinished(true);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [coins]);

  useEffect(() => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.85 } });
  }, []);

  return (
    <Card className="fun-shadow glow-effect overflow-hidden animate-enter">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Today's Progress</h2>
            <p className="text-muted-foreground text-sm">Keep going to reach your daily goal</p>
          </div>

          <div className="relative mx-auto max-w-md">
            <SemiCircleProgress value={percent} ariaLabel="Day-of-week progress" />
            <div className="absolute inset-0 top-6 flex flex-col items-center justify-start gap-1">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight" aria-label={`${currentStreak} days current streak`}>
                {currentStreak} days
              </div>
              <div className="text-sm text-muted-foreground">streak so far</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2 animate-fade-in">
            {days.map((d, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full grid place-items-center text-sm border focus-visible-ring",
                  idx === today
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border"
                )}
                role="button"
                tabIndex={0}
                aria-label={`Day ${d}${idx === today ? " (today)" : ""}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-1" aria-live="polite">
            <span>coins</span>
            <span role="img" aria-label="coin" className="text-base">🪙</span>
            <span className={cn("tabular-nums font-semibold text-foreground", finished ? "animate-scale-in" : "")}>{displayedCoins}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StreakSummary;
