import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";


interface StreakSummaryProps {
  dailyProgress: number; // 0-100 (kept for future use)
  currentStreak: number;
  coins?: number;
}

export function StreakSummary({ dailyProgress, currentStreak, coins = 0 }: StreakSummaryProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  // Calculate progress through the week (Sunday = 0, Saturday = 6)
  const percent = ((today + 1) / 7) * 100;

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

  const motivationalMessages = [
    "You're doing amazing! Keep it up! 🌟",
    "Every step forward is progress! 💪",
    "Consistency is the key to success! 🔑",
    "You're building great habits! 🏆",
    "Small steps lead to big achievements! ✨",
    "Your dedication is inspiring! 🚀",
    "Progress, not perfection! 🌱"
  ];

  const todayMessage = motivationalMessages[today] || motivationalMessages[0];

  return (
    <div className="space-y-4">
      <Card className="fun-shadow glow-effect overflow-hidden animate-enter">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Weekly Progress</h2>
              <p className="text-muted-foreground text-sm">Your journey from Sunday to Saturday</p>
            </div>

            <div className="relative mx-auto max-w-sm">
              <CircularProgress value={percent} size={180} ariaLabel="Week progress from Sunday to Saturday" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight" aria-label={`${currentStreak} days current streak`}>
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">day streak</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2 pt-2 animate-fade-in">
              {days.map((d, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center text-xs font-medium border transition-all duration-200",
                    idx === today
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-110"
                      : idx < today
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-muted/50 text-muted-foreground border-border"
                  )}
                  role="button"
                  tabIndex={0}
                  aria-label={`${d}${idx === today ? " (today)" : ""}`}
                >
                  {d.slice(0, 1)}
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

      {/* Motivation Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{todayMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StreakSummary;
