import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MysteryBox } from "@/components/ui/mystery-box";
import { 
  Flame, 
  Trophy, 
  Star, 
  Gift, 
  Calendar, 
  Target, 
  Zap, 
  Crown,
  Coins,
  CheckCircle,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { StreakSummary } from "./StreakSummary";

interface StreakZoneProps {
  totalCoins?: number;
  onCoinsUpdate?: (newTotal: number) => void;
}

interface StreakActivity {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  completed: boolean;
  streak: number;
  maxStreak: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: "badge" | "coin_multiplier" | "mystery_box" | "avatar";
  unlocked: boolean;
  owned: boolean;
}

export function StreakZone({ totalCoins = 0, onCoinsUpdate }: StreakZoneProps = {}) {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [showRewardBox, setShowRewardBox] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const { toast } = useToast();

  // Celebrate today's progress on page load
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.8 }
    });
  }, []);

  const [activities, setActivities] = useState<StreakActivity[]>([
    {
      id: "lesson",
      name: "Complete Daily Lesson",
      description: "Finish at least one lesson today",
      icon: CheckCircle,
      points: 50,
      completed: true,
      streak: 7,
      maxStreak: 12
    },
    {
      id: "homework",
      name: "Submit Homework",
      description: "Turn in today's assignments",
      icon: Target,
      points: 75,
      completed: true,
      streak: 5,
      maxStreak: 8
    },
    {
      id: "reading",
      name: "Read for 15 Minutes",
      description: "Spend time reading any subject",
      icon: Star,
      points: 30,
      completed: true,
      streak: 3,
      maxStreak: 15
    },
    {
      id: "quiz",
      name: "Take Practice Quiz",
      description: "Complete any practice quiz",
      icon: Zap,
      points: 40,
      completed: true,
      streak: 0,
      maxStreak: 6
    }
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "coin_boost",
      name: "2x Coin Multiplier",
      description: "Double coins for next 3 activities",
      cost: 100,
      icon: "💰",
      type: "coin_multiplier",
      unlocked: true,
      owned: false
    },
    {
      id: "streak_saver",
      name: "Streak Protector",
      description: "Protect your streak for one missed day",
      cost: 150,
      icon: "🛡️",
      type: "badge",
      unlocked: true,
      owned: false
    },
    {
      id: "super_box",
      name: "Super Mystery Box",
      description: "Contains rare rewards and bonus coins",
      cost: 200,
      icon: "🎁",
      type: "mystery_box",
      unlocked: currentStreak >= 5,
      owned: false
    },
    {
      id: "crown_avatar",
      name: "Golden Crown",
      description: "Show off your achievement with a crown",
      cost: 300,
      icon: "👑",
      type: "avatar",
      unlocked: currentStreak >= 10,
      owned: false
    }
  ]);

  const triggerStreakConfetti = () => {
    // Fire confetti multiple times for streak celebration
    const count = 3;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
        spread: 70
      });
    }

    // Create a burst effect
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const completeActivity = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId && !activity.completed) {
          const newStreak = activity.streak + 1;
          const newActivity = {
            ...activity,
            completed: true,
            streak: newStreak,
            maxStreak: Math.max(newStreak, activity.maxStreak)
          };

          // Award coins
          onCoinsUpdate?.(totalCoins + activity.points);
          
          // Show celebration
          toast({
            title: `${activity.name} Complete! 🎉`,
            description: `+${activity.points} coins earned! Streak: ${newStreak}`,
          });

          // Trigger confetti for milestone streaks
          if (newStreak % 5 === 0) {
            triggerStreakConfetti();
            toast({
              title: `${newStreak} Day Streak! 🔥`,
              description: "Amazing dedication! You've earned bonus rewards!",
            });
          }

          return newActivity;
        }
        return activity;
      })
    );
  };

  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || !reward.unlocked || reward.owned || totalCoins < reward.cost) {
      return;
    }

    onCoinsUpdate?.(totalCoins - reward.cost);
    setRewards(prev => 
      prev.map(r => 
        r.id === rewardId ? { ...r, owned: true } : r
      )
    );

    if (reward.type === "mystery_box") {
      setSelectedReward(rewardId);
      setShowRewardBox(true);
    } else {
      toast({
        title: `${reward.name} Purchased! ✨`,
        description: reward.description,
      });
    }
  };

  const handleMysteryBoxOpen = (coins: number) => {
    onCoinsUpdate?.(totalCoins + coins);
    toast({
      title: `Super Mystery Box opened! 🎊`,
      description: `You earned ${coins} bonus coins!`,
    });
    
    setTimeout(() => {
      setShowRewardBox(false);
      setSelectedReward(null);
    }, 3000);
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: "Legendary", color: "text-purple-600", bg: "bg-purple-100" };
    if (streak >= 20) return { level: "Expert", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (streak >= 10) return { level: "Advanced", color: "text-blue-600", bg: "bg-blue-100" };
    if (streak >= 5) return { level: "Rising Star", color: "text-green-600", bg: "bg-green-100" };
    return { level: "Beginner", color: "text-gray-600", bg: "bg-gray-100" };
  };

  const streakLevel = getStreakLevel(currentStreak);
  const completedToday = activities.filter(a => a.completed).length;
  const totalActivities = activities.length;
  const dailyProgress = (completedToday / totalActivities) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
          <Flame className="w-10 h-10 text-orange-500" />
          Streak Zone
          <Flame className="w-10 h-10 text-orange-500" />
        </h1>
        <p className="text-muted-foreground">Keep your learning streak alive and earn amazing rewards!</p>
      </div>

      {/* Overview styled like reference */}
      <StreakSummary dailyProgress={dailyProgress} currentStreak={currentStreak} coins={totalCoins} />

      {/* Daily Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Daily Activities</span>
              <span>{completedToday}/{totalActivities} completed</span>
            </div>
            <Progress value={dailyProgress} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {activities.map((activity) => (
                <Card key={activity.id} className={cn(
                  "transition-all duration-300 hover-lift",
                  activity.completed ? "border-green-200 bg-green-50" : "border-border"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        activity.completed ? "bg-green-500" : "bg-muted"
                      )}>
                        <activity.icon className={cn(
                          "w-5 h-5",
                          activity.completed ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {activity.points} coins
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              🔥 {activity.streak} days
                            </Badge>
                          </div>
                          
                          {/* Complete button removed per UX request */}
                          
                          {activity.completed && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Streak Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Weekly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Kofi Asante", streak: 7, points: 425, isMe: true },
              { rank: 2, name: "Ama Osei", streak: 6, points: 380, isMe: false },
              { rank: 3, name: "Kwame Nkrumah", streak: 5, points: 350, isMe: false },
              { rank: 4, name: "Akosua Mensah", streak: 4, points: 320, isMe: false },
              { rank: 5, name: "Yaw Asante", streak: 3, points: 280, isMe: false }
            ].map((player) => (
              <div key={player.rank} className={cn(
                "flex items-center gap-4 p-3 rounded-lg",
                player.isMe ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  player.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                  player.rank === 2 ? "bg-gray-100 text-gray-800" :
                  player.rank === 3 ? "bg-orange-100 text-orange-800" :
                  "bg-muted text-muted-foreground"
                )}>
                  {player.rank === 1 && <Crown className="w-4 h-4" />}
                  {player.rank !== 1 && player.rank}
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm text-muted-foreground">
                    🔥 {player.streak} days • {player.points} points
                  </div>
                </div>
                
                {player.isMe && (
                  <Badge className="bg-primary text-primary-foreground">You!</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mystery Box Modal */}
      {showRewardBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <MysteryBox onOpen={handleMysteryBoxOpen} />
          </div>
        </div>
      )}
    </div>
  );
}