import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Star, 
  Target,
  BookOpen,
  Brain,
  Trophy,
  Zap
} from "lucide-react";

interface ShsWelcomeProps {
  user: any;
  onZoneChange?: (zone: string) => void;
}

export function ShsWelcome({ user, onZoneChange }: ShsWelcomeProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");

  // SHS-specific performance data
  const weeklyPerformance = {
    "core-math": { score: 92, trend: "up", status: "Strong performance this week — well done.", color: "bg-green-500" },
    "physics": { score: 90, trend: "up", status: "Excellent understanding of quantum mechanics.", color: "bg-green-500" },
    "chemistry": { score: 86, trend: "neutral", status: "Good progress in organic chemistry.", color: "bg-blue-500" },
    "biology": { score: 94, trend: "up", status: "Outstanding work in genetics.", color: "bg-green-500" },
    "english": { score: 76, trend: "down", status: "You missed a key lesson — revisit when you can.", color: "bg-orange-500" },
    "elective-math": { score: 88, trend: "up", status: "Integration concepts are clicking.", color: "bg-green-500" }
  };

  const weeklyStats = {
    streak: 4,
    lessonsCompleted: 10,
    practiceSession: 5,
    timeSpent: "8.5 hrs",
    topSubject: "Biology"
  };

  const personalizedRecommendations = [
    { 
      type: "review", 
      subject: "Chemistry", 
      task: "Review: Organic Chemistry", 
      icon: "🔁", 
      action: "learn",
      priority: "high"
    },
    { 
      type: "practice", 
      subject: "Mathematics", 
      task: "Practice: Graph Functions", 
      icon: "🧠", 
      action: "practice",
      priority: "medium"
    },
    { 
      type: "bonus", 
      subject: "All", 
      task: "3-day streak active", 
      icon: "🎯", 
      action: "motivate",
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      {/* SHS Greeting */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Hi {user?.name || 'friend'}! 👋</h1>
        <p className="text-muted-foreground">Let's see how you're doing this week</p>
      </div>

        <JesiAssistant 
        message={`Hi ${user?.name || 'friend'}! Let's see how you're doing this week. 📊`}
        variant="greeting"
      />

      {/* Weekly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(weeklyPerformance).slice(0, 3).map(([subject, data]) => (
          <Card key={subject} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold capitalize text-sm">
                  {subject.replace('-', ' ')}
                </h3>
                <div className="flex items-center gap-1">
                  {data.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {data.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                  <Badge 
                    variant={data.status.includes("Strong") ? "default" : 
                           data.status.includes("missed") ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {data.status.includes("Strong") ? "🟢" : 
                     data.status.includes("missed") ? "🟠" : "🟡"}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{data.status}</p>
              <Progress value={data.score} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{data.score}% performance</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Stats Dashboard */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.streak}</div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.lessonsCompleted}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.practiceSession}</div>
              <div className="text-sm text-muted-foreground">Practice</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.timeSpent}</div>
              <div className="text-sm text-muted-foreground">Study Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.topSubject}</div>
              <div className="text-sm text-muted-foreground">Top Subject</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            What to focus on this week:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalizedRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="text-2xl">{rec.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{rec.task}</p>
                  <p className="text-sm text-muted-foreground capitalize">{rec.subject}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    if (rec.action === "learn" && onZoneChange) onZoneChange("learn");
                    if (rec.action === "practice" && onZoneChange) onZoneChange("practice");
                  }}
                >
                  {rec.type === "bonus" ? "Keep Going!" : "Start"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => onZoneChange && onZoneChange("insights")}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-sm">View Reports</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => onZoneChange && onZoneChange("practice")}
        >
          <Target className="w-6 h-6" />
          <span className="text-sm">Practice</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => onZoneChange && onZoneChange("learn")}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-sm">Study</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => onZoneChange && onZoneChange("streak")}
        >
          <Zap className="w-6 h-6" />
          <span className="text-sm">Streak</span>
        </Button>
      </div>
    </div>
  );
}