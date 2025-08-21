import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { 
  GamepadIcon, 
  Target, 
  Brain, 
  FileText, 
  Clock, 
  Star, 
  Trophy, 
  RotateCcw,
  BookOpen,
  Zap,
  CheckCircle
} from "lucide-react";

export function ShsPractice() {
  const [currentStep, setCurrentStep] = useState<"welcome" | "styles" | "subjects" | "practice" | "results">("welcome");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // SHS-specific practice styles
  const practiceStyles = [
    { 
      id: "flashcards", 
      name: "Flashcards", 
      icon: Target, 
      color: "bg-blue-500", 
      description: "Quick review with digital flashcards",
      duration: "5-10 min",
      features: ["Spaced repetition", "Progress tracking", "Custom sets"]
    },
    { 
      id: "quiz", 
      name: "Quiz Practice", 
      icon: Brain, 
      color: "bg-green-500", 
      description: "Interactive quizzes with instant feedback",
      duration: "10-15 min",
      features: ["Multiple choice", "True/false", "Short answers"]
    },
    { 
      id: "short-exam", 
      name: "Short Mock Exam", 
      icon: Clock, 
      color: "bg-orange-500", 
      description: "Quick 15-minute practice tests",
      duration: "15 min",
      features: ["Timed questions", "Exam format", "Performance analysis"]
    },
    { 
      id: "full-exam", 
      name: "Full Mock Exam", 
      icon: FileText, 
      color: "bg-purple-500", 
      description: "Complete exam simulation experience",
      duration: "45-60 min",
      features: ["Full length", "Real exam conditions", "Detailed report"]
    },
  ];

  // SHS subjects
  const subjects = [
    { 
      id: "core-math", 
      name: "Core Mathematics", 
      topic: "Calculus & Differentiation", 
      color: "bg-blue-500", 
      icon: "📊",
      difficulty: "Advanced",
      questions: 25,
      lastScore: 92
    },
    { 
      id: "physics", 
      name: "Physics", 
      topic: "Quantum Mechanics Intro", 
      color: "bg-purple-500", 
      icon: "⚛️",
      difficulty: "Expert",
      questions: 20,
      lastScore: 90
    },
    { 
      id: "chemistry", 
      name: "Chemistry", 
      topic: "Organic Chemistry", 
      color: "bg-green-500", 
      icon: "🧪",
      difficulty: "Advanced",
      questions: 22,
      lastScore: 86
    },
    { 
      id: "biology", 
      name: "Biology", 
      topic: "Genetics & Evolution", 
      color: "bg-emerald-500", 
      icon: "🧬",
      difficulty: "Intermediate",
      questions: 18,
      lastScore: 94
    },
    { 
      id: "elective-math", 
      name: "Elective Mathematics", 
      topic: "Integration & Applications", 
      color: "bg-indigo-500", 
      icon: "📈",
      difficulty: "Expert",
      questions: 30,
      lastScore: 88
    },
    { 
      id: "english", 
      name: "English Language", 
      topic: "Advanced Literature Analysis", 
      color: "bg-rose-500", 
      icon: "📚",
      difficulty: "Intermediate",
      questions: 15,
      lastScore: 76
    }
  ];

  // SHS-level sample questions
  const questions = [
    {
      id: 1,
      question: "If f(x) = 3x² + 2x - 1, find f'(x) using first principles.",
      options: ["6x + 2", "6x - 2", "3x + 2", "6x + 1"],
      correct: 0,
      explanation: "Using the definition of derivative, f'(x) = lim h→0 [f(x+h) - f(x)]/h = 6x + 2"
    },
    {
      id: 2,
      question: "What is the integral of ∫(2x + 3)dx?",
      options: ["x² + 3x + C", "2x² + 3x + C", "x² + 3x", "2x + 3x² + C"],
      correct: 0,
      explanation: "∫(2x + 3)dx = ∫2x dx + ∫3 dx = x² + 3x + C"
    }
  ];

  if (currentStep === "welcome") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Practice Time 🎯</h1>
          <p className="text-muted-foreground">Let's practice and get better. Choose how you want to learn today.</p>
        </div>

        <JesiAssistant 
          message="Let's practice and get better. Choose how you want to learn today. 💪"
          variant="greeting"
        />

        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Ready to Practice?</h3>
            <p className="text-muted-foreground">Select your preferred practice method and let's get started!</p>
          </div>
          <Button 
            size="lg"
            onClick={() => setCurrentStep("styles")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Start Practice Session 🚀
          </Button>
        </Card>
      </div>
    );
  }

  if (currentStep === "styles") {
    return (
      <div className="space-y-6">
        <JesiAssistant 
          message="Great choice! Now pick how you want to practice today 🎯"
          variant="question"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {practiceStyles.map((style) => (
            <Card 
              key={style.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-card border border-border"
            >
              <div className="space-y-4">
                {/* Icon and Title */}
                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 ${style.color} rounded-full flex items-center justify-center text-white mx-auto`}>
                    <style.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">{style.name}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {style.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Start Button */}
                <Button 
                  className="w-full h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => {
                    setSelectedStyle(style.id);
                    setCurrentStep("subjects");
                  }}
                >
                  Start {style.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === "subjects") {
    const style = practiceStyles.find(s => s.id === selectedStyle);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("styles")}>
            ← Back
          </Button>
          <div className={`w-10 h-10 ${style?.color} rounded-lg flex items-center justify-center text-white`}>
            <style.icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{style?.name}</h2>
            <p className="text-muted-foreground">Choose a subject to master</p>
          </div>
        </div>

        <JesiAssistant 
          message="Pick a subject you want to work on today. I'll give you questions that fit your level! 🧠"
          variant="encouragement"
        />

        <div className="grid gap-4">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="p-6 cursor-pointer hover:shadow-md transition-all hover:scale-[1.01] border hover:border-primary/50"
              onClick={() => {
                setSelectedSubject(subject.id);
                setCurrentStep("practice");
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${subject.color} rounded-lg flex items-center justify-center text-white text-2xl shadow-md`}>
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg">{subject.name}</h3>
                    <Badge variant="outline" className="text-xs">{subject.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Current Topic: {subject.topic}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="w-3 h-3" />
                      {subject.questions} questions
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3" />
                      Last: {subject.lastScore}%
                    </div>
                  </div>
                </div>
                <Badge 
                  className={
                    subject.lastScore >= 90 ? "bg-green-500" :
                    subject.lastScore >= 80 ? "bg-blue-500" :
                    subject.lastScore >= 70 ? "bg-yellow-500" :
                    "bg-orange-500"
                  }
                >
                  {subject.lastScore >= 90 ? "Excellent" :
                   subject.lastScore >= 80 ? "Good" :
                   subject.lastScore >= 70 ? "Fair" : "Needs Work"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === "practice") {
    const currentQ = questions[currentQuestion - 1];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("subjects")}>
            ← Back to Subjects
          </Button>
          <Badge variant="outline" className="text-sm">
            Question {currentQuestion} of {questions.length}
          </Badge>
        </div>

        <JesiAssistant 
          message="Take your time to think through this one. You've got this! 🔥"
          variant="encouragement"
        />

        <Card className="p-8 min-h-[700px]">
          <div className="mb-8">
            <Progress value={(currentQuestion / questions.length) * 100} className="mb-4 h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress: {Math.round((currentQuestion / questions.length) * 100)}%</span>
              <span>Score: {score}/{currentQuestion - 1}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
            </div>
            
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="h-auto p-6 text-left justify-start hover:bg-primary hover:text-white transition-all duration-200 text-wrap"
                  onClick={() => {
                    setSelectedAnswer(index);
                  }}
                >
                  <div className="flex items-start gap-3 text-left">
                    <span className="font-bold text-lg min-w-[2rem]">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                  </div>
                </Button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    if (selectedAnswer === currentQ.correct) {
                      setScore(score + 1);
                    }
                    setSelectedAnswer(null);
                    if (currentQuestion < questions.length) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      setCurrentStep("results");
                    }
                  }}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Next Question →
                </Button>
              </div>
            )}
            
            {/* Solution Section - Only show if answer is selected */}
            {selectedAnswer !== null && (
              <div className="mt-8 pt-6 border-t bg-blue-50 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    💡
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800 mb-2">Solution:</h4>
                    <p className="text-sm text-blue-700">{currentQ.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Outstanding Work! 🎉</h1>
        <p className="text-muted-foreground">Here's your performance summary</p>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          
          <div className="text-5xl font-bold text-primary mb-4">{score}/{questions.length}</div>
          
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-8 h-8 ${i < Math.ceil((score / questions.length) * 5) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          
          <h3 className="text-2xl font-semibold mb-3">
            {score === questions.length ? "Perfect Score! 🏆" : 
             score >= questions.length * 0.8 ? "Excellent Work! ⭐" :
             score >= questions.length * 0.6 ? "Good Progress! 📈" : "Keep Learning! 💪"}
          </h3>
          
          <p className="text-muted-foreground text-lg">
            {score === questions.length 
              ? "You've mastered this strand! Ready for more advanced challenges." 
              : score >= questions.length * 0.8
              ? "You're showing strong understanding. A few more sessions and you'll be perfect!"
              : "Every practice session makes you stronger. Keep pushing forward!"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            variant="outline"
            onClick={() => {
              setCurrentQuestion(1);
              setScore(0);
              setCurrentStep("practice");
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry Session
          </Button>
          
          <Button 
            onClick={() => setCurrentStep("subjects")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Target className="w-4 h-4 mr-2" />
            New Subject
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setCurrentStep("styles")}
          >
            <GamepadIcon className="w-4 h-4 mr-2" />
            Change Mode
          </Button>
        </div>
      </Card>

      <JesiAssistant 
        message={score === questions.length
          ? "Perfect score! 🌟 You're ready for even more challenging problems!" 
          : score >= questions.length * 0.8
          ? "Excellent performance! 💪 Your analytical skills are getting stronger!"
          : "Great effort! 📚 Each practice session builds your expertise. Keep going!"}
        variant="encouragement"
      />
    </div>
  );
}