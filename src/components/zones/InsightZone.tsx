import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Target, Award, Clock, BookOpen, Brain, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ShsInsights } from "./shs/ShsInsights";
import { useAuth } from "@/hooks/useAuth";

interface InsightZoneProps {
  userType: "student" | "parent" | "admin";
  user?: any;
  onZoneChange?: (zone: string) => void;
}

export function InsightZone({ userType, user, onZoneChange }: InsightZoneProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const { toast } = useToast();

  const { user: authUser } = useAuth();
  const name = authUser?.name?.split(" ")[0] || authUser?.name || user?.name || "Champ";

  // Check if user is SHS student for advanced analytics
  const isShsStudent = user?.level === "shs";

  // If SHS student, use advanced insights
  if (isShsStudent && (userType === "student" || userType === "parent")) {
    return <ShsInsights userType={userType} onZoneChange={onZoneChange} />;
  }

  const studentProgress = {
    math: { score: 85, trend: "up", status: "improving", color: "bg-green-500" },
    english: { score: 72, trend: "down", status: "needs practice", color: "bg-yellow-500" },
    science: { score: 90, trend: "up", status: "excellent", color: "bg-green-500" },
    social: { score: 68, trend: "neutral", status: "on track", color: "bg-blue-500" },
  };

  const monthlyProgress = {
    math: { score: 78, trend: "up", status: "improving", color: "bg-green-500" },
    english: { score: 65, trend: "up", status: "improving", color: "bg-blue-500" },
    science: { score: 88, trend: "neutral", status: "excellent", color: "bg-green-500" },
    social: { score: 71, trend: "up", status: "on track", color: "bg-blue-500" },
  };

  const weeklyStats = {
    streak: 5,
    lessonsCompleted: 12,
    practiceSession: 8,
    timeSpent: "2h 30m",
    topSubject: "Science"
  };

  const monthlyStats = {
    streak: 18,
    lessonsCompleted: 45,
    practiceSession: 32,
    timeSpent: "12h 15m",
    topSubject: "Science"
  };

  const weeklyRecommendations = [
    { 
      type: "review", 
      subject: "English", 
      task: "Vocabulary practice", 
      icon: "📘", 
      action: "practice",
      reason: "Your vocabulary quiz scores have dropped 15% this week. Regular practice will help strengthen your word knowledge."
    },
    { 
      type: "practice", 
      subject: "Math", 
      task: "Multiplication tables", 
      icon: "🧩", 
      action: "practice",
      reason: "You've mastered addition and subtraction! Time to level up with multiplication to build stronger math foundations."
    },
    { 
      type: "bonus", 
      subject: "All", 
      task: "Keep your 5-day streak!", 
      icon: "🎉", 
      action: "motivate",
      reason: "You're on fire! Maintaining consistency like this builds excellent study habits and keeps knowledge fresh."
    },
  ];

  const monthlyRecommendations = [
    { 
      type: "review", 
      subject: "English", 
      task: "Reading comprehension", 
      icon: "📖", 
      action: "learn",
      reason: "Your reading speed is great, but comprehension needs focus. Deeper understanding will boost all your English skills."
    },
    { 
      type: "practice", 
      subject: "Social Studies", 
      task: "Ghana's regions", 
      icon: "🗺️", 
      action: "practice",
      reason: "Geography is your strongest area in Social Studies. Mastering Ghana's regions will prepare you for advanced topics."
    },
    { 
      type: "bonus", 
      subject: "All", 
      task: "Celebrate 18-day streak!", 
      icon: "🏆", 
      action: "motivate",
      reason: "18 days of consistent learning! You're developing the discipline that leads to academic excellence."
    },
  ];

  const currentProgress = selectedPeriod === "week" ? studentProgress : monthlyProgress;
  const currentStats = selectedPeriod === "week" ? weeklyStats : monthlyStats;
  const currentRecommendations = selectedPeriod === "week" ? weeklyRecommendations : monthlyRecommendations;

  const handleRecommendationAction = (recommendation: any) => {
    if (recommendation.action === "motivate") {
      toast({
        title: "Keep it up! 🎉",
        description: "You're doing amazing! Keep maintaining your streak!",
      });
    } else if (recommendation.action === "practice") {
      toast({
        title: `Starting ${recommendation.subject} practice`,
        description: `Let's work on: ${recommendation.task}`,
      });
      // Navigate to practice zone
      if (onZoneChange) {
        onZoneChange("practice");
      }
    } else if (recommendation.action === "learn") {
      toast({
        title: `Opening ${recommendation.subject} lessons`,
        description: `Time to dive into: ${recommendation.task}`,
      });
      // Navigate to learn zone
      if (onZoneChange) {
        onZoneChange("learn");
      }
    }
  };

  if (userType === "student") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Your Progress! 📊</h1>
          <p className="text-muted-foreground">See how amazing you're doing</p>
        </div>

        <JesiAssistant 
          message={`Yoo, ${name}! Seeing is believing — let's check out how you're doing! 👀🔥`}
          variant="greeting"
        />

        {/* Period Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <Button 
            variant={selectedPeriod === "week" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("week")}
          >
            This Week
          </Button>
          <Button 
            variant={selectedPeriod === "month" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("month")}
          >
            This Month
          </Button>
        </div>

        {/* Subject Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(currentProgress).map(([subject, data]) => (
            <Card 
              key={subject} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => {
                if (data.status === "needs practice" && onZoneChange) {
                  // Navigate to practice with specific subject
                  onZoneChange("practice");
                  toast({
                    title: `Starting ${subject} practice`,
                    description: "Let's work on improving your skills!",
                  });
                } else {
                  toast({
                    title: `${subject} Performance`,
                    description: `Current score: ${data.score}% - ${data.status}`,
                  });
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold capitalize text-lg">{subject}</h3>
                <div className="flex items-center gap-2">
                  {data.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
                  {data.trend === "down" && <TrendingDown className="w-5 h-5 text-red-500" />}
                  <Badge 
                    variant={data.status === "excellent" ? "default" : data.status === "improving" ? "secondary" : "outline"}
                    className={data.status === "excellent" ? "bg-green-500" : data.status === "improving" ? "bg-blue-500" : ""}
                  >
                    {data.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{data.score}%</span>
                </div>
                <Progress value={data.score} className="h-3" />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {data.status === "excellent" ? "🟢 You're doing great!" :
                     data.status === "improving" ? "📈 Keep going!" :
                     data.status === "needs practice" ? "⚠️ Let's catch up!" : "✅ On track!"}
                  </p>
                  {data.status === "needs practice" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onZoneChange) {
                          onZoneChange("practice");
                          toast({
                            title: `Starting ${subject} practice`,
                            description: "Focus on areas that need improvement!",
                          });
                        }
                      }}
                    >
                      Practice Now
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly Stats */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            {selectedPeriod === "week" ? "This Week's Highlights" : "This Month's Highlights"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak 🔥</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.lessonsCompleted}</div>
              <div className="text-sm text-muted-foreground">Lessons Done 📚</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.practiceSession}</div>
              <div className="text-sm text-muted-foreground">Practice Sessions 🎯</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.timeSpent}</div>
              <div className="text-sm text-muted-foreground">Time Spent ⏰</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentStats.topSubject}</div>
              <div className="text-sm text-muted-foreground">Top Subject 🏆</div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Jesi AI's Recommendations
          </h3>
          <div className="space-y-4">
            {currentRecommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg border border-muted/60 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1">{rec.icon}</span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-base">{rec.task}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRecommendationAction(rec)}
                        className="ml-4"
                      >
                        {rec.type === "bonus" ? "Keep Going!" : "Start"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize mb-2">{rec.type}: {rec.subject}</p>
                    <div className="bg-background/50 rounded-md p-3 border-l-4 border-primary/30">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="font-medium text-primary">Why this matters:</span> {rec.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Parent & Admin View (admin uses same view as parent for now)
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Kofi's Progress 📈</h1>
        <p className="text-muted-foreground">Here's how your child is progressing with Jesi AI this week</p>
      </div>

      {/* Weekly Summary */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Weekly Summary</h3>
          <Badge variant="secondary">Jan 15-21, 2024</Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{currentStats.lessonsCompleted}</div>
            <div className="text-sm text-muted-foreground">Lessons</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{currentStats.practiceSession}</div>
            <div className="text-sm text-muted-foreground">Practice</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{currentStats.timeSpent}</div>
            <div className="text-sm text-muted-foreground">Study Time</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{currentStats.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
        </div>
      </Card>

      {/* Subject Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
        <div className="space-y-4">
          {Object.entries(currentProgress).map(([subject, data]) => (
            <div key={subject} className="flex items-center gap-4">
              <div className="w-24 capitalize font-medium">{subject}</div>
              <div className="flex-1">
                <Progress value={data.score} className="h-3" />
              </div>
              <div className="w-16 text-right font-medium">{data.score}%</div>
              <div className="w-24">
                {data.trend === "up" && <Badge className="bg-green-500">Improving</Badge>}
                {data.trend === "down" && <Badge variant="destructive">Needs Help</Badge>}
                {data.trend === "neutral" && <Badge variant="outline">Steady</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Parent Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">How to Support Kofi This Week</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-medium">Celebrate Math improvement</p>
              <p className="text-sm text-muted-foreground">Kofi has improved by 15% in Math this week!</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-medium">Encourage 10 minutes of English daily</p>
              <p className="text-sm text-muted-foreground">Reading practice will help boost vocabulary skills</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-medium">Maintain the 5-day learning streak</p>
              <p className="text-sm text-muted-foreground">Consistency is building great learning habits!</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Download Report */}
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Weekly Progress Report</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Download a detailed report to share with teachers or keep for your records
        </p>
        <Button className="w-full md:w-auto">
          📄 Download Report
        </Button>
      </Card>
    </div>
  );
}