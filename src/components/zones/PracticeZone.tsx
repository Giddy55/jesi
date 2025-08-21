import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { Badge } from "@/components/ui/badge";
import { GamepadIcon, Target, Brain, FileText, Clock, Star, Trophy, RotateCcw } from "lucide-react";
import { ShsPractice } from "./shs/ShsPractice";
import { useAuth } from "@/hooks/useAuth";

interface PracticeZoneProps {
  user?: any;
}

export function PracticeZone({ user }: PracticeZoneProps) {
  // Check if user is SHS student for advanced practice
  const isShsStudent = user?.level === "shs";

  // If SHS student, use advanced practice
  if (isShsStudent) {
    return <ShsPractice />;
  }

  const [currentStep, setCurrentStep] = useState<"welcome" | "styles" | "subjects" | "practice" | "results">("welcome");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const { user: authUser } = useAuth();
  const displayName = authUser?.name || user?.name || "Champ";
  const firstName = displayName.split(" ")[0];

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

  const subjects = [
    { id: "math", name: "Mathematics", topic: "Fractions", color: "bg-blue-500", icon: "📊" },
    { id: "english", name: "English", topic: "Reading Comprehension", color: "bg-green-500", icon: "📚" },
    { id: "science", name: "Science", topic: "Plant Biology", color: "bg-purple-500", icon: "🔬" },
  ];

  const questions = [
    {
      id: 1,
      question: "What is 3/4 + 1/4?",
      options: ["1/2", "4/8", "1", "4/4"],
      correct: 2,
      solution: "When adding fractions with the same denominator, add the numerators and keep the denominator: 3/4 + 1/4 = (3+1)/4 = 4/4 = 1"
    },
    {
      id: 2,
      question: "Which fraction is larger: 1/2 or 3/8?",
      options: ["1/2", "3/8", "They are equal", "Cannot determine"],
      correct: 0,
      solution: "Convert to same denominator: 1/2 = 4/8. Since 4/8 > 3/8, then 1/2 > 3/8"
    }
  ];

  if (currentStep === "welcome") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Practice Zone! 🧪</h1>
          <p className="text-muted-foreground">Sharpen your skills with focused practice</p>
        </div>

        <JesiAssistant 
          message={`Yoo, ${firstName}! Learning sticks when you practice. Let's sharpen those skills 💪`}
          variant="greeting"
        />

        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
            <p className="text-muted-foreground">Pick how you want to practice today!</p>
          </div>
          <Button 
            size="lg"
            onClick={() => setCurrentStep("styles")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
          >
            Let's Practice! 🎯
          </Button>
        </Card>
      </div>
    );
  }

  if (currentStep === "styles") {
    return (
      <div className="space-y-6">
        <JesiAssistant 
          message={`Ready to practice, ${firstName}? Pick your style! 🚀`}
          variant="encouragement"
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
            <p className="text-muted-foreground">Choose a subject to practice</p>
          </div>
        </div>

        <JesiAssistant 
          message="Great choice! Now pick a subject you want to master 🎯"
          variant="encouragement"
        />

        <div className="grid gap-4">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="p-6 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
              onClick={() => {
                setSelectedSubject(subject.id);
                setCurrentStep("practice");
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">Strand: {subject.topic}</p>
                </div>
                <Badge variant="secondary">Ready</Badge>
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
            ← Back
          </Button>
          <Badge variant="outline">Question {currentQuestion} of {questions.length}</Badge>
        </div>

        <JesiAssistant 
          message="You're nailing it! Take your time and think it through 🔥"
          variant="encouragement"
        />

        <Card className="p-6 min-h-[700px]">
          <div className="mb-6">
            <Progress value={(currentQuestion / questions.length) * 100} className="mb-4" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress: {currentQuestion}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{currentQ.question}</h3>
            
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start hover:bg-primary hover:text-white transition-colors"
                  onClick={() => {
                    setSelectedAnswer(index);
                  }}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
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
                    <p className="text-sm text-blue-700">{currentQ.solution}</p>
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
        <h1 className="text-3xl font-bold text-primary mb-2">Amazing Work! 🎉</h1>
        <p className="text-muted-foreground">Here's how you did</p>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="text-4xl font-bold text-primary mb-2">{score}/{questions.length}</div>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-6 h-6 ${i < Math.ceil((score / questions.length) * 5) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {score === questions.length ? "Perfect Score!" : score >= questions.length * 0.7 ? "Great Job!" : "Keep Practicing!"}
          </h3>
          <p className="text-muted-foreground">
            {score === questions.length 
              ? "You're a fraction master! 🏆" 
              : "You're getting better every day! 📈"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="outline"
            onClick={() => {
              setCurrentQuestion(1);
              setScore(0);
              setCurrentStep("practice");
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => setCurrentStep("subjects")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Target className="w-4 h-4 mr-2" />
            New Practice
          </Button>
        </div>
      </Card>

      <JesiAssistant 
        message={score === questions.length
          ? "Wow! Perfect score! You're really mastering fractions! 🌟" 
          : "Great effort! Every practice session makes you stronger! 💪"}
        variant="encouragement"
      />
    </div>
  );
}