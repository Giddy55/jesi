import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  Clock, 
  Target, 
  Award, 
  BookOpen,
  Brain,
  BarChart3,
  PieChart
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";

interface ShsInsightsProps {
  userType: "student" | "parent" | "admin";
  onZoneChange?: (zone: string) => void;
}

export function ShsInsights({ userType, onZoneChange }: ShsInsightsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [selectedView, setSelectedView] = useState<"performance" | "trends" | "comparison">("performance");

  // SHS Performance Data
  const weeklyData = [
    { day: "Mon", math: 85, physics: 90, chemistry: 78, biology: 92, english: 75 },
    { day: "Tue", math: 88, physics: 87, chemistry: 82, biology: 94, english: 78 },
    { day: "Wed", math: 90, physics: 92, chemistry: 85, biology: 89, english: 76 },
    { day: "Thu", math: 92, physics: 88, chemistry: 88, biology: 95, english: 74 },
    { day: "Fri", math: 89, physics: 93, chemistry: 86, biology: 91, english: 79 }
  ];

  const subjectPerformance = {
    "Core Mathematics": { current: 92, previous: 88, trend: "up", color: "hsl(var(--chart-1))" },
    "Physics": { current: 90, previous: 87, trend: "up", color: "hsl(var(--chart-2))" },
    "Chemistry": { current: 86, previous: 90, trend: "down", color: "hsl(var(--chart-3))" },
    "Biology": { current: 94, previous: 91, trend: "up", color: "hsl(var(--chart-4))" },
    "English Language": { current: 76, previous: 82, trend: "down", color: "hsl(var(--chart-5))" },
    "Elective Mathematics": { current: 88, previous: 85, trend: "up", color: "hsl(var(--primary))" }
  };

  const weeklyStats = {
    learningStreak: 4,
    lessonsCompleted: 10,
    topSubject: "Biology",
    smartPracticeSessions: 5,
    totalStudyTime: "8.5 hrs",
    averageScore: 89
  };

  const chartConfig = {
    math: { label: "Mathematics", color: "hsl(var(--chart-1))" },
    physics: { label: "Physics", color: "hsl(var(--chart-2))" },
    chemistry: { label: "Chemistry", color: "hsl(var(--chart-3))" },
    biology: { label: "Biology", color: "hsl(var(--chart-4))" },
    english: { label: "English", color: "hsl(var(--chart-5))" }
  };

  if (userType === "student") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">How You're Doing 📊</h1>
        <p className="text-muted-foreground">See how you're growing in your studies</p>
        </div>

        {/* Period and View Selector */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("week")}
            >
              This Week
            </Button>
            <Button 
              variant={selectedPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={selectedView === "performance" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView("performance")}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              My Work
            </Button>
            <Button 
              variant={selectedView === "trends" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView("trends")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trends
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.learningStreak}</div>
            <div className="text-sm text-muted-foreground">Days Active</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.lessonsCompleted}</div>
            <div className="text-sm text-muted-foreground">Lessons</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.topSubject}</div>
            <div className="text-sm text-muted-foreground">Top Subject</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.smartPracticeSessions}</div>
            <div className="text-sm text-muted-foreground">Practice</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.totalStudyTime}</div>
            <div className="text-sm text-muted-foreground">Study Time</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{weeklyStats.averageScore}%</div>
            <div className="text-sm text-muted-foreground">Avg Score</div>
          </Card>
        </div>

        {/* Performance Chart */}
        {selectedView === "performance" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                How You Did Each Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="math" fill="var(--color-math)" />
                    <Bar dataKey="physics" fill="var(--color-physics)" />
                    <Bar dataKey="chemistry" fill="var(--color-chemistry)" />
                    <Bar dataKey="biology" fill="var(--color-biology)" />
                    <Bar dataKey="english" fill="var(--color-english)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Trends Chart */}
        {selectedView === "trends" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Progress Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="math" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="physics" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="chemistry" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="biology" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="english" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Subject Deep Dive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              How You're Doing in Each Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(subjectPerformance).map(([subject, data]) => (
                <div key={subject} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="w-32 font-medium">{subject}</div>
                  <div className="flex-1">
                    <Progress value={data.current} className="h-3" />
                  </div>
                  <div className="w-16 text-right font-medium">{data.current}%</div>
                  <div className="w-20 text-right">
                    {data.trend === "up" ? (
                      <Badge className="bg-green-500 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{data.current - data.previous}%
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        -{data.previous - data.current}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              What to Work on Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-2xl">🔁</span>
                <div className="flex-1">
                  <p className="font-medium">Study Chemistry Again</p>
                  <p className="text-sm text-muted-foreground">You scored 4% lower this week - let's practice more</p>
                </div>
                <Button size="sm" onClick={() => onZoneChange && onZoneChange("learn")}>
                  Start Review
                </Button>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">🧠</span>
                <div className="flex-1">
                  <p className="font-medium">Practice Math Graphs</p>
                  <p className="text-sm text-muted-foreground">Get better at math by practicing more</p>
                </div>
                <Button size="sm" onClick={() => onZoneChange && onZoneChange("practice")}>
                  Practice Now
                </Button>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="font-medium">Keep Your 4-Day Streak</p>
                  <p className="text-sm text-muted-foreground">You're building excellent study habits!</p>
                </div>
                <Button size="sm" onClick={() => onZoneChange && onZoneChange("streak")}>
                  View Streak
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parent/Admin View
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Weekly Analytics Report 📈</h1>
        <p className="text-muted-foreground">Comprehensive overview of academic performance</p>
      </div>

      {/* Parent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-green-50">
          <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-xl font-bold">{weeklyStats.lessonsCompleted}</div>
          <div className="text-sm text-muted-foreground">Lessons Completed</div>
          <Badge className="mt-2 bg-green-500">✅ On Track</Badge>
        </Card>
        
        <Card className="p-4 text-center bg-blue-50">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold">{weeklyStats.smartPracticeSessions}</div>
          <div className="text-sm text-muted-foreground">Practice Sessions</div>
          <Badge className="mt-2 bg-blue-500">📊 Good Progress</Badge>
        </Card>
        
        <Card className="p-4 text-center bg-orange-50">
          <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <div className="text-xl font-bold">{weeklyStats.totalStudyTime}</div>
          <div className="text-sm text-muted-foreground">Study Time</div>
          <Badge className="mt-2 bg-orange-500">⏳ In Progress</Badge>
        </Card>
        
        <Card className="p-4 text-center bg-purple-50">
          <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-xl font-bold">{weeklyStats.learningStreak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
          <Badge className="mt-2 bg-purple-500">🔥 Excellent</Badge>
        </Card>
      </div>

      {/* Subject Performance for Parents */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance & Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(subjectPerformance).map(([subject, data]) => (
              <div key={subject} className="flex items-center gap-4">
                <div className="w-32 font-medium">{subject}</div>
                <div className="flex-1">
                  <Progress value={data.current} className="h-3" />
                </div>
                <div className="w-16 text-right font-medium">{data.current}%</div>
                <div className="w-32">
                  {data.trend === "up" && <Badge className="bg-green-500">✅ Improving</Badge>}
                  {data.trend === "down" && <Badge variant="destructive">⚠️ Needs Support</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parent Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>How to Support This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-medium">Celebrate Biology excellence</p>
                <p className="text-sm text-muted-foreground">Outstanding 94% performance - acknowledge their hard work</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-medium">Encourage English revision</p>
                <p className="text-sm text-muted-foreground">Help set aside 15 minutes daily for literature review</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">🧪</span>
              <div>
                <p className="font-medium">Support Chemistry study plan</p>
                <p className="text-sm text-muted-foreground">Consider creating a quiet study space for organic chemistry</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Report */}
      <Card className="text-center">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Comprehensive Progress Report</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Download detailed analytics including performance indicators, trends, and recommendations
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="w-auto">
              <Download className="w-4 h-4 mr-2" />
              Weekly Report (PDF)
            </Button>
            <Button variant="outline" className="w-auto">
              <PieChart className="w-4 h-4 mr-2" />
              Monthly Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}