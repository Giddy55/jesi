import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JesiAssistant, MoodSelector, RatingSelector } from "@/components/jesi/JesiAssistant";
import { Badge } from "@/components/ui/badge";
import { MysteryBox } from "@/components/ui/mystery-box";
import { ReadingDialog } from "@/components/ui/reading-dialog";
import { ExtraResourcesDialog } from "@/components/ui/extra-resources-dialog";
import { LearningSupportDialog } from "@/components/ui/learning-support-dialog";
import { BookOpen, Play, CheckCircle, Star, Clock, Target, ArrowLeft, ArrowRight, Volume2, RotateCcw, Download, AlertTriangle, Coins, GraduationCap, Flame, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

type UserType = "student" | "parent" | "admin";

interface ClassZoneProps {
  userType?: UserType;
  user?: any;
  onZoneChange?: (zone: string) => void;
}

export function ClassZone({ userType = "student", user, onZoneChange }: ClassZoneProps) {
  // Check if user is SHS student
  const isShsStudent = user?.level === "shs";
  
  const [currentStep, setCurrentStep] = useState<"welcome" | "subjects" | "lesson" | "questions" | "homework" | "homework-review" | "results" | "mystery-box">("welcome");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [dayRating, setDayRating] = useState<number>(0);
  const [homeworkScore, setHomeworkScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<"all" | "class" | "teacher" | "date">("all");
  const [totalCoins, setTotalCoins] = useState<number>(150); // Starting coins
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [isReading, setIsReading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [showUnderstandingCheck, setShowUnderstandingCheck] = useState(false);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState<"quiz" | "video" | "game" | null>(null);
  const [hasShownMidpointQuestions, setHasShownMidpointQuestions] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: number}>({});
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportMood, setSupportMood] = useState<"confusing" | "tough">("confusing");
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // SHS-specific advanced subjects with more sophisticated content
  const shsSubjects = [
    { 
      id: "core-math", 
      name: "Core Mathematics", 
      icon: "📊", 
      color: "subject-math",
      progress: 85, 
      topic: "Calculus & Differentiation",
      difficulty: "Advanced",
      lastRevised: "Today",
      homeworkStatus: "pending",
      teacher: "Dr. Mensah",
      nextExam: "Dec 15, 2024",
      studyTime: "2.5 hrs",
      performance: 92
    },
    { 
      id: "elective-math", 
      name: "Elective Mathematics", 
      icon: "📈", 
      color: "subject-math",
      progress: 78, 
      topic: "Integration & Applications",
      difficulty: "Expert",
      lastRevised: "Yesterday",
      homeworkStatus: "completed",
      teacher: "Prof. Asante",
      nextExam: "Dec 20, 2024",
      studyTime: "3.0 hrs",
      performance: 88
    },
    { 
      id: "physics", 
      name: "Physics", 
      icon: "⚛️", 
      color: "subject-science",
      progress: 82, 
      topic: "Quantum Mechanics Intro",
      difficulty: "Advanced",
      lastRevised: "2 days ago",
      homeworkStatus: "pending",
      teacher: "Dr. Adjei",
      nextExam: "Dec 18, 2024",
      studyTime: "2.8 hrs",
      performance: 90
    },
    { 
      id: "chemistry", 
      name: "Chemistry", 
      icon: "🧪", 
      color: "subject-science",
      progress: 75, 
      topic: "Organic Chemistry",
      difficulty: "Advanced",
      lastRevised: "Yesterday",
      homeworkStatus: "completed",
      teacher: "Dr. Osei",
      nextExam: "Dec 22, 2024",
      studyTime: "2.2 hrs",
      performance: 86
    },
    { 
      id: "biology", 
      name: "Biology", 
      icon: "🧬", 
      color: "subject-science",
      progress: 88, 
      topic: "Genetics & Evolution",
      difficulty: "Advanced",
      lastRevised: "Today",
      homeworkStatus: "pending",
      teacher: "Prof. Akoto",
      nextExam: "Dec 16, 2024",
      studyTime: "2.0 hrs",
      performance: 94
    },
    { 
      id: "english", 
      name: "English Language", 
      icon: "📚", 
      color: "subject-english",
      progress: 80, 
      topic: "Advanced Literature Analysis",
      difficulty: "Intermediate",
      lastRevised: "Yesterday",
      homeworkStatus: "completed",
      teacher: "Mrs. Boateng",
      nextExam: "Dec 14, 2024",
      studyTime: "1.8 hrs",
      performance: 89
    }
  ];

  // Use basic subjects for non-SHS students  
  const basicSubjects = [
    { 
      id: "math", 
      name: "Mathematics", 
      icon: "📊", 
      color: "subject-math",
      progress: 75, 
      topic: "Surds",
      lastRevised: "Today",
      homeworkStatus: "pending",
      teacher: "Ms. Akosua"
    },
    { 
      id: "english", 
      name: "English", 
      icon: "📚", 
      color: "subject-english",
      progress: 60, 
      topic: "Comprehension",
      lastRevised: "Yesterday", 
      homeworkStatus: "completed",
      teacher: "Mr. Kwame"
    },
    { 
      id: "science", 
      name: "Science", 
      icon: "🔬", 
      color: "subject-science",
      progress: 80, 
      topic: "Digestive System",
      lastRevised: "2 days ago",
      homeworkStatus: "missed",
      teacher: "Dr. Ama"
    },
    { 
      id: "social", 
      name: "Social Studies", 
      icon: "🌍", 
      color: "subject-social",
      progress: 45, 
      topic: "Ghana's History",
      lastRevised: "3 days ago",
      homeworkStatus: "pending",
      teacher: "Mr. Kofi"
    },
  ];

  // Determine which subjects to use based on student level
  const subjects = isShsStudent ? shsSubjects : basicSubjects;

  const homeworkQuestions = [
    {
      question: "What is √16?",
      options: ["2", "4", "8", "16"],
      correct: 1,
      explanation: "√16 = 4 because 4 × 4 = 16"
    },
    {
      question: "Simplify √72",
      options: ["6√2", "8√3", "9√2", "12√6"],
      correct: 0,
      explanation: "√72 = √(36 × 2) = 6√2"
    },
    {
      question: "What is √25 + √9?",
      options: ["8", "9", "10", "11"],
      correct: 0,
      explanation: "√25 + √9 = 5 + 3 = 8"
    }
  ];

  // Admin dashboard data
  const adminStats = {
    totalUsers: 1247,
    activeToday: 892,
    subjectsRevised: 3420,
    avgCompletionRate: 78,
    byClass: [
      { class: "Primary 6A", users: 32, completion: 85 },
      { class: "Primary 6B", users: 28, completion: 79 },
      { class: "JHS 1A", users: 35, completion: 72 },
    ],
    byTeacher: [
      { teacher: "Ms. Akosua", subject: "Math", usage: 156 },
      { teacher: "Mr. Kwame", subject: "English", usage: 143 },
      { teacher: "Dr. Ama", subject: "Science", usage: 189 },
    ]
  };

  const handleMoodSelect = (selectedMood: string) => {
    console.log("Mood selected:", selectedMood);
    console.log("Is confusing?", selectedMood === "confusing");
    console.log("Is tough?", selectedMood === "tough");
    console.log("Type of selectedMood:", typeof selectedMood);
    setMood(selectedMood);
    
    // Show support dialog for confusing or tough moods
    if (selectedMood === "confusing" || selectedMood === "tough") {
      console.log("Triggering support dialog for:", selectedMood);
      console.log("Setting showSupportDialog to true");
      setSupportMood(selectedMood as "confusing" | "tough");
      setShowSupportDialog(true);
      console.log("showSupportDialog should now be true");
    } else {
      console.log("Going to subjects for mood:", selectedMood);
      // Skip rating and go directly to subjects for all other moods
      setCurrentStep("subjects");
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentStep("lesson");
  };

  // Calculate progress based on completed sections
  useEffect(() => {
    const totalSections = 3; // Introduction, main content, practice
    const completedCount = completedSections.size;
    const progress = (completedCount / totalSections) * 100;
    setReadingProgress(progress);

    // Show understanding check at 50% progress
    if (progress >= 50 && !hasShownMidpointQuestions && isReading) {
      setHasShownMidpointQuestions(true);
      setShowUnderstandingCheck(true);
    }
  }, [completedSections, hasShownMidpointQuestions, isReading]);

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const handleLessonComplete = () => {
    setCompletedLessons([...completedLessons, selectedSubject]);
    setIsReading(false);
    setHasShownMidpointQuestions(false);
    setCompletedSections(new Set());
    toast({
      title: "Lesson Complete! 🎉",
      description: "Great job reviewing today's lesson!",
    });
  };

  const handleUnderstandingResponse = (response: string) => {
    toast({
      title: "Thanks for sharing! 😊",
      description: `You selected: ${response}`,
    });
    
    setShowUnderstandingCheck(false);
  };

  // Function to handle reading progress and trigger understanding check at 50%
  const handleReadingProgress = (progress: number) => {
    if (progress >= 50 && !hasShownMidpointQuestions) {
      setHasShownMidpointQuestions(true);
      setShowUnderstandingCheck(true);
    }
  };

  const handleResourceComplete = (resourceType: string, score?: number) => {
    const bonusCoins = score ? Math.floor(score / 10) : 5;
    setTotalCoins(prev => prev + bonusCoins);
    
    toast({
      title: `${resourceType} Complete! 🎉`,
      description: `You earned ${bonusCoins} bonus coins!`,
    });
  };

  const getSubjectLessonContent = (subjectId: string): string[] => {
    const lessonContent: Record<string, string[]> = {
      math: [
        "Understanding Surds\n\nSurds are square roots that cannot be simplified to give a whole number. For example, √2, √3, and √5 are surds because they cannot be written as exact decimals.\n\nKey points:\n• A surd is an irrational number\n• √4 = 2 is NOT a surd because it's a whole number\n• √2 ≈ 1.414... is a surd because it's irrational",
        "Simplifying Surds\n\nTo simplify surds, we look for perfect square factors:\n\n√12 = √(4 × 3) = √4 × √3 = 2√3\n\nSteps:\n1. Find the largest perfect square factor\n2. Split the square root\n3. Simplify the perfect square\n4. Write in simplest form",
        "Operations with Surds\n\nAdding and subtracting surds:\n• Only like surds can be added: 2√3 + 5√3 = 7√3\n• Unlike surds cannot be simplified: √2 + √3 stays as √2 + √3\n\nMultiplying surds:\n• √a × √b = √(a×b)\n• Example: √2 × √8 = √16 = 4"
      ],
      english: [
        "Comprehension Strategies\n\nReading comprehension is about understanding what you read. Here are key strategies:\n\n1. Preview the text - look at headings, pictures, and structure\n2. Ask questions while reading - What? Why? How?\n3. Make connections to your own experiences",
        "Finding Main Ideas\n\nThe main idea is the most important point in a paragraph or passage.\n\nTips:\n• Often found in the first or last sentence\n• Ask yourself: What is this mostly about?\n• Look for repeated words or concepts\n• Supporting details give more information about the main idea",
        "Making Inferences\n\nInferences are conclusions you draw based on evidence in the text plus your own knowledge.\n\nExample: 'Sarah grabbed her umbrella and raincoat before leaving.'\nInference: It's probably raining or going to rain.\n\nPractice looking for clues in the text!"
      ],
      science: [
        "The Digestive System Overview\n\nThe digestive system breaks down food into nutrients your body can use.\n\nMain parts:\n• Mouth - chewing and saliva\n• Stomach - acid breaks down food\n• Small intestine - nutrients absorbed\n• Large intestine - water absorbed",
        "Digestion Process\n\n1. Mechanical digestion - teeth break food into smaller pieces\n2. Chemical digestion - enzymes break down nutrients\n3. Absorption - nutrients enter bloodstream\n4. Elimination - waste products removed\n\nThe whole process takes about 24-72 hours!",
        "Staying Healthy\n\nTips for a healthy digestive system:\n• Eat plenty of fiber (fruits, vegetables)\n• Drink lots of water\n• Chew food thoroughly\n• Exercise regularly\n• Avoid too much processed food"
      ],
      social: [
        "Ghana's Early History\n\nGhana has a rich history dating back thousands of years.\n\nKey periods:\n• Ancient Ghana Empire (300-1200 AD)\n• Rise of Akan kingdoms\n• Trans-Atlantic trade period\n• Colonial period under British rule",
        "Independence Movement\n\nGhana became the first African country to gain independence in 1957.\n\nKey figures:\n• Kwame Nkrumah - first President\n• 'Big Six' - independence leaders\n• March 6, 1957 - Independence Day\n\nThe struggle for independence inspired other African nations.",
        "Modern Ghana\n\nSince independence, Ghana has:\n• Developed democratic institutions\n• Built schools and hospitals\n• Promoted cultural heritage\n• Become a leader in West Africa\n\nChallenges remain in education, healthcare, and economic development."
      ]
    };

    return lessonContent[subjectId] || ["Content coming soon..."];
  };

  const handleHomeworkAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === homeworkQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      toast({
        title: "Correct! 🌟",
        description: homeworkQuestions[currentQuestion].explanation,
      });
    } else {
      toast({
        title: "Try again! 🤔",
        description: homeworkQuestions[currentQuestion].explanation,
        variant: "destructive",
      });
    }

    if (currentQuestion < homeworkQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = Math.floor(Math.random() * 3) + 8; // Demo score 8-10
      setHomeworkScore(score);
      
      // Trigger confetti animation
      triggerConfetti();
      
      // Show completion message with confetti
      toast({
        title: "Homework Completed! 🎉",
        description: "Amazing work! You've earned a mystery box reward!",
      });
      
      // Proceed to mystery box after a brief delay
      setTimeout(() => {
        setCurrentStep("mystery-box");
      }, 2000);
    }
  };

  const handleMysteryBoxOpen = (coins: number) => {
    setEarnedCoins(coins);
    setTotalCoins(prev => prev + coins);
    
    toast({
      title: `You earned ${coins} coins! 🪙`,
      description: `Total coins: ${totalCoins + coins}`,
    });
    
    setTimeout(() => {
      setCurrentStep("results");
    }, 3000);
  };

  const handleSupportSelected = (supportType: string, details: string) => {
    console.log("Support selected:", supportType, details);
    toast({
      title: "🎯 Support Personalized!",
      description: `I've noted that you need help with: ${supportType.replace('-', ' ')}. Your learning will be adjusted accordingly.`,
    });
    setShowSupportDialog(false);
    // Skip rating and go directly to subjects for confusing/tough moods
    setCurrentStep("subjects");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "missed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Admin View
  if (userType === "admin") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Class Zone - Admin Dashboard 👨‍💼</h1>
          <p className="text-muted-foreground">Monitor revision engagement across schools</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter by:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {["all", "class", "teacher", "date"].map((filter) => (
                <Button
                  key={filter}
                  variant={filterBy === filter ? "default" : "outline"}
                  onClick={() => setFilterBy(filter as any)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="fun-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">{adminStats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="fun-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success">{adminStats.activeToday}</div>
              <div className="text-sm text-muted-foreground">Active Today</div>
            </CardContent>
          </Card>
          <Card className="fun-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-info">{adminStats.subjectsRevised}</div>
              <div className="text-sm text-muted-foreground">Subjects Revised</div>
            </CardContent>
          </Card>
          <Card className="fun-shadow">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-warning">{adminStats.avgCompletionRate}%</div>
              <div className="text-sm text-muted-foreground">Avg Completion</div>
            </CardContent>
          </Card>
        </div>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminStats.byClass.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">{item.class}</div>
                    <div className="text-sm text-muted-foreground">{item.users} students</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{item.completion}%</div>
                    <Progress value={item.completion} className="w-24 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminStats.byTeacher.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-semibold">{item.teacher}</div>
                    <div className="text-sm text-muted-foreground">{item.subject}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{item.usage} revisions</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export */}
        <Card>
          <CardContent className="p-6 text-center">
            <Button className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parent View
  if (userType === "parent") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Class Zone - Parent Dashboard 👨‍👩‍👧‍👦</h1>
          <p className="text-muted-foreground">Monitor your child's class revision progress</p>
        </div>

        <div className="grid gap-6">
          {/* Last Subject Revised */}
          <Card className="fun-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Last Subject Revised
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 subject-math rounded-lg flex items-center justify-center text-3xl bg-white/20 backdrop-blur">
                  📊
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl">Mathematics</h3>
                  <p className="text-muted-foreground">Strand: Surds</p>
                  <p className="text-sm text-success">Completed today at 2:30 PM</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Subject Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className={`p-4 rounded-lg border ${subject.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{subject.icon}</span>
                        <div>
                          <h3 className="font-semibold">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground">Strand: {subject.topic}</p>
                          <p className="text-xs text-muted-foreground">Teacher: {subject.teacher}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(subject.homeworkStatus)}>
                        {subject.homeworkStatus}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">Last revised: {subject.lastRevised}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Recommendations */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alerts & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-red-800">Science homework missed</p>
                    <p className="text-sm text-red-600">Encourage practice on Digestive System</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-green-800">Great improvement in Math!</p>
                    <p className="text-sm text-green-600">Keep up the momentum with Surds practice</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Notes Access */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Class Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subjects.slice(0, 2).map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{subject.icon}</span>
                      <div>
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-sm text-muted-foreground">{subject.topic}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Notes</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Student Views (existing code with acceptance criteria fulfilled)
  if (currentStep === "welcome") {
    return (
      <div className="space-y-6 animate-slide-up">
        {/* Advanced Header for SHS Students */}
        {isShsStudent ? (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-3xl flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Advanced Study Hub
                </h1>
                <p className="text-lg text-muted-foreground font-medium">SHS Level • College Preparatory Track</p>
              </div>
            </div>
            
            {/* SHS Performance Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">89.2%</div>
                  <div className="text-sm opacity-90">Overall GPA</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm opacity-90">Study Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">24h</div>
                  <div className="text-sm opacity-90">This Week</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm opacity-90">Upcoming Exams</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Stats for SHS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Assignments</div>
                      <div className="text-sm text-muted-foreground">5 completed this week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold">Performance</div>
                      <div className="text-sm text-muted-foreground">Top 15% in class</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Coins className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="font-semibold">Achievement Points</div>
                      <div className="text-sm text-muted-foreground">{totalCoins} points earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Welcome to Class Zone! 🎒</h1>
            <p className="text-lg text-muted-foreground">Let's revise what you learned in class today</p>
          </div>
        )}

        <JesiAssistant 
          message={`Hi ${user?.name ? user.name : 'there'}! I'm Jesi AI, your learning buddy. 🌟 How was class today?`} 
          variant="greeting"
        />

        <Card className="fun-shadow animate-bounce-in">
          <CardHeader>
            <CardTitle className="text-center">How are you feeling about today's classes?</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodSelector onMoodSelect={handleMoodSelect} />
          </CardContent>
        </Card>

        {/* Learning Support Dialog for Welcome Screen */}
        <LearningSupportDialog
          isOpen={showSupportDialog}
          onClose={() => setShowSupportDialog(false)}
          mood={supportMood}
          selectedSubject={selectedSubject}
          onSupportSelected={handleSupportSelected}
          onNavigateToPractice={() => onZoneChange?.("practice")}
          onOpenChatbot={() => {
            // Find and trigger the floating chatbot
            const chatbot = document.querySelector('[data-chatbot-trigger]');
            if (chatbot) {
              (chatbot as HTMLElement).click();
            }
          }}
          onNavigateToClass={() => {
            setCurrentStep("subjects");
            setShowSupportDialog(false);
          }}
        />
      </div>
    );
  }


  if (currentStep === "subjects") {
    return (
      <div className="space-y-6 animate-slide-up">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep("welcome")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <JesiAssistant 
          message="Great! Now let's pick a subject to revise. Which one do you want to work on?"
          variant="question"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className={`cursor-pointer hover:shadow-lg transition-all hover-lift ${subject.color} fun-shadow`}
              onClick={() => handleSubjectSelect(subject.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-3xl">
                    {subject.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl">{subject.name}</h3>
                    <p className="text-sm opacity-80">Current strand: {subject.topic}</p>
                    <Badge className={getStatusColor(subject.homeworkStatus)} variant="secondary">
                      {subject.homeworkStatus}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-bold">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === "lesson") {
    const subject = subjects.find(s => s.id === selectedSubject);
    const isCompleted = completedLessons.includes(selectedSubject);
    
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("subjects")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className={`w-12 h-12 ${subject?.color} rounded-lg flex items-center justify-center text-2xl bg-white/20 backdrop-blur`}>
            {subject?.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{subject?.name}</h2>
             <p className="text-muted-foreground">Strand: {subject?.topic}</p>
          </div>
        </div>

        <JesiAssistant 
          message={`This week, we're diving into ${subject?.topic}. How's it going so far?`}
          variant="question"
        />

        <div className="grid gap-4">
          <Card className="fun-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">Teacher's Lesson Notes</h3>
                <Badge variant="secondary">New</Badge>
                {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              
              {/* Progress Bar */}
              {isReading && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Reading Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(readingProgress)}%</span>
                  </div>
                  <Progress value={readingProgress} className="h-2" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{completedSections.size} of 3 sections</span>
                    <span>{readingProgress === 100 ? "Complete! 🎉" : "Keep reading..."}</span>
                  </div>
                </div>
              )}
              
              <p className="text-muted-foreground mb-4">
                Review the key concepts from today's lesson on {subject?.topic}
              </p>
              
              {/* Introduction Section */}
              <div className="bg-muted/50 p-4 rounded-lg mb-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Understanding {subject?.topic} 📚</h4>
                  {completedSections.has("intro") && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {subject?.id === "math" ? "Surds are square roots that cannot be simplified to give a whole number. For example, √2, √3, and √5 are surds because they cannot be written as exact decimals." :
                   subject?.id === "english" ? "Comprehension is about understanding what you read. We'll explore key strategies to help you better understand texts." :
                   subject?.id === "science" ? "The digestive system breaks down food into nutrients your body can use. Let's explore how this amazing process works." :
                   "Learn about Ghana's rich history and how it shaped our modern nation."}
                </p>
                {!completedSections.has("intro") && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => markSectionComplete("intro")}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
              
              {/* Expandable Reading Content */}
              {isReading && (
                <div className="space-y-4 mb-4 animate-fade-in">
                  {/* Main Content Section */}
                  <div className="bg-muted/50 p-4 rounded-lg relative">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Key Concepts 📐</h4>
                      {completedSections.has("main") && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      {subject?.id === "math" && (
                        <>
                          <p><strong>Simplifying Surds:</strong> Look for perfect square factors. √12 = √(4 × 3) = 2√3</p>
                          <p><strong>Operations:</strong> Only like surds can be added: 2√3 + 5√3 = 7√3</p>
                        </>
                      )}
                      {subject?.id === "english" && (
                        <>
                          <p><strong>Main Ideas:</strong> Usually found in the first or last sentence of a paragraph</p>
                          <p><strong>Context Clues:</strong> Use surrounding words to understand unfamiliar terms</p>
                        </>
                      )}
                      {subject?.id === "science" && (
                        <>
                          <p><strong>Digestion Process:</strong> Mechanical (chewing) and chemical (enzymes) breakdown</p>
                          <p><strong>Absorption:</strong> Nutrients enter bloodstream through small intestine</p>
                        </>
                      )}
                      {subject?.id === "social" && (
                        <>
                          <p><strong>Independence:</strong> Ghana gained independence on March 6, 1957</p>
                          <p><strong>Leadership:</strong> Kwame Nkrumah led the independence movement</p>
                        </>
                      )}
                    </div>
                    {!completedSections.has("main") && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => markSectionComplete("main")}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                  
                  {/* Practice Section */}
                  <div className="bg-muted/50 p-4 rounded-lg relative">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Practice Application 🎯</h4>
                      {completedSections.has("practice") && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subject?.id === "math" ? "Try simplifying √18, √32, and √75. Look for perfect square factors in each!" :
                       subject?.id === "english" ? "Practice finding the main idea in newspaper articles or your favorite books." :
                       subject?.id === "science" ? "Notice how your body feels after eating different types of food." :
                       "Think about how Ghana's independence influenced other African countries."}
                    </p>
                    {!completedSections.has("practice") && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => markSectionComplete("practice")}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => setIsReading(!isReading)}
                  disabled={isCompleted}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {isCompleted ? "Completed" : isReading ? "Show Less" : "Read Lesson"}
                </Button>
                <Button variant="outline">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </Button>
              </div>
              
              {/* Progress Celebration */}
              {readingProgress === 100 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <h4 className="font-semibold text-green-800 mb-1">Great Job!</h4>
                  <p className="text-sm text-green-600">You've completed this lesson!</p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={handleLessonComplete}
                  >
                    Mark Lesson Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="fun-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold">Practice Homework</h3>
                <Badge variant="outline">{homeworkQuestions.length} questions</Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Test your understanding with these practice questions
              </p>
              <Button 
                onClick={() => setCurrentStep("homework")}
                className="w-full"
                disabled={!isCompleted}
              >
                <Target className="w-4 h-4 mr-2" />
                {!isCompleted ? "Complete lesson first" : "Start Homework"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 fun-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold">Extra Resources</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col gap-2 hover-lift"
                  onClick={() => {
                    setSelectedResourceType("quiz");
                    setShowResourceDialog(true);
                  }}
                >
                  <span className="text-3xl">🧩</span>
                  <span className="text-sm font-medium">Interactive Quiz</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col gap-2 hover-lift"
                  onClick={() => {
                    setSelectedResourceType("video");
                    setShowResourceDialog(true);
                  }}
                >
                  <span className="text-3xl">🎥</span>
                  <span className="text-sm font-medium">Watch Video</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col gap-2 hover-lift"
                  onClick={() => {
                    setSelectedResourceType("game");
                    setShowResourceDialog(true);
                  }}
                >
                  <span className="text-3xl">🎮</span>
                  <span className="text-sm font-medium">Play Game</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Understanding Check Dialog */}
        {showUnderstandingCheck && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">How's it going so far? 🎓</h3>
                <p className="text-muted-foreground">Let me know how you're feeling about this content</p>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start bg-green-50 hover:bg-green-100 border-green-200"
                  onClick={() => handleUnderstandingResponse("👍 I understand it")}
                >
                  <span className="text-2xl mr-3">👍</span>
                  <span className="font-medium">I understand it</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                  onClick={() => handleUnderstandingResponse("🤔 I'm trying")}
                >
                  <span className="text-2xl mr-3">🤔</span>
                  <span className="font-medium">I'm trying</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start bg-red-50 hover:bg-red-100 border-red-200"
                  onClick={() => handleUnderstandingResponse("😕 I don't get it yet")}
                >
                  <span className="text-2xl mr-3">😕</span>
                  <span className="font-medium">I don't get it yet</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Extra Resources Dialog */}
        <ExtraResourcesDialog
          open={showResourceDialog}
          onOpenChange={setShowResourceDialog}
          resourceType={selectedResourceType}
          subjectName={subject?.name || ""}
          topic={subject?.topic || ""}
          onComplete={handleResourceComplete}
        />
      </div>
    );
  }

  if (currentStep === "homework") {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("lesson")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson
          </Button>
          <h2 className="text-xl font-bold">Homework Time! 📝</h2>
        </div>

        <JesiAssistant 
          message="Answer all questions first, then you can review your answers!"
          variant="encouragement"
        />

        <Card className="fun-shadow">
          <CardContent className="p-8">
            <div className="space-y-8">
              {homeworkQuestions.map((question, qIndex) => (
                <div key={qIndex} className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {qIndex + 1}. {question.question}
                  </h3>
                  
                  <div className="grid gap-3">
                    {question.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`h-auto p-4 text-left justify-start transition-colors ${
                          answeredQuestions[qIndex] === index 
                            ? "bg-primary text-white" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => {
                          const newAnswers = { ...answeredQuestions };
                          newAnswers[qIndex] = index;
                          setAnsweredQuestions(newAnswers);
                        }}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={() => {
                  // Calculate score
                  let score = 0;
                  homeworkQuestions.forEach((q, index) => {
                    if (answeredQuestions[index] === q.correct) {
                      score++;
                    }
                  });
                  setHomeworkScore(score);
                  setCurrentStep("homework-review");
                }}
                disabled={Object.keys(answeredQuestions).length < homeworkQuestions.length}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Submit Homework <Trophy className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "homework-review") {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold">Homework Review 📝</h2>
          <Badge className="bg-green-100 text-green-800">
            Score: {homeworkScore}/{homeworkQuestions.length}
          </Badge>
        </div>

        <Card className="fun-shadow">
          <CardContent className="p-8">
            <div className="space-y-8">
              {homeworkQuestions.map((question, qIndex) => {
                const userAnswer = answeredQuestions[qIndex];
                const isCorrect = userAnswer === question.correct;
                
                return (
                  <div key={qIndex} className="p-6 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      {qIndex + 1}. {question.question}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className={`p-3 rounded ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className="font-medium">
                          Your answer: {String.fromCharCode(65 + userAnswer)}. {question.options[userAnswer]}
                          {isCorrect ? " ✓" : " ✗"}
                        </p>
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="font-medium text-blue-800">
                            Correct answer: {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                          </p>
                        </div>
                      )}
                      
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                        <p className="text-sm"><strong>Solution:</strong> {question.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <Button 
                onClick={() => {
                  setShowMysteryBox(true);
                  setCurrentStep("mystery-box");
                }}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "mystery-box") {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">Surprise Challenge! 🎁</h2>
          <p className="text-lg text-muted-foreground">You've earned a special reward for completing your homework!</p>
        </div>

        <JesiAssistant 
          message="Wow! You did amazing on your homework! Here's a special mystery box just for you. Open it to see what coins you've earned! 🪙"
          variant="encouragement"
        />

        <div className="flex justify-center">
          <MysteryBox onOpen={handleMysteryBoxOpen} className="w-full max-w-md" />
        </div>

        {/* Coins Display */}
        <Card className="fun-shadow">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">Your Coin Wallet</h3>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{totalCoins} coins</div>
            <p className="text-sm text-muted-foreground">Keep learning to earn more!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "results") {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="text-center animate-confetti">
          <h2 className="text-3xl font-bold gradient-text mb-4">Homework Complete! 🎉</h2>
          <div className="text-6xl mb-4">⭐</div>
          <div className="text-2xl font-bold text-primary mb-2">
            You scored {homeworkScore}/10!
          </div>
          <p className="text-muted-foreground">That's awesome! You're leveling up! 🚀</p>
        </div>

        {/* Show earned coins if any */}
        {earnedCoins > 0 && (
          <Card className="fun-shadow border-yellow-200 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-yellow-800">Bonus Coins Earned!</h3>
              </div>
              <div className="text-2xl font-bold text-yellow-600">+{earnedCoins} coins</div>
              <div className="text-sm text-yellow-700">Total: {totalCoins} coins</div>
            </CardContent>
          </Card>
        )}

        <Card className="fun-shadow">
          <CardContent className="p-6 text-center">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-success">{homeworkScore}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{10 - (homeworkScore || 0)}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-info">{Math.floor(((homeworkScore || 0) / 10) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setCurrentQuestion(0);
                  setHomeworkScore(null);
                  setEarnedCoins(0);
                  setCurrentStep("homework");
                }}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  setEarnedCoins(0);
                  setCurrentStep("subjects");
                }}
                className="w-full"
              >
                Choose Another Subject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This should not be reached as all steps should return above
  return null;
}