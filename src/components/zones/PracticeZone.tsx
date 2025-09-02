import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GamepadIcon, Target, Brain, FileText, Clock, Star, Trophy, RotateCcw, ChevronRight } from "lucide-react";
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

  const [currentStep, setCurrentStep] = useState<"welcome" | "setup" | "practice" | "results">("welcome");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStrand, setSelectedStrand] = useState<string>("");
  const [selectedSubstrand, setSelectedSubstrand] = useState<string>("");
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
      color: "bg-primary", 
      description: "Quick review with digital flashcards",
      duration: "5-10 min",
      features: ["Spaced repetition", "Progress tracking", "Custom sets"]
    },
    { 
      id: "quiz", 
      name: "Quiz Practice", 
      icon: Brain, 
      color: "bg-secondary", 
      description: "Interactive quizzes with instant feedback",
      duration: "10-15 min",
      features: ["Multiple choice", "True/false", "Short answers"]
    },
    { 
      id: "short-exam", 
      name: "Short Mock Exam", 
      icon: Clock, 
      color: "bg-primary", 
      description: "Quick 15-minute practice tests",
      duration: "15 min",
      features: ["Timed questions", "Exam format", "Performance analysis"]
    },
    { 
      id: "full-exam", 
      name: "Full Mock Exam", 
      icon: FileText, 
      color: "bg-accent", 
      description: "Complete exam simulation experience",
      duration: "45-60 min",
      features: ["Full length", "Real exam conditions", "Detailed report"]
    },
  ];

  const subjects = [
    { id: "math", name: "Mathematics", color: "bg-primary", icon: "📊" },
    { id: "english", name: "English", color: "bg-secondary", icon: "📚" },
    { id: "science", name: "Science", color: "bg-accent", icon: "🔬" },
    { id: "social", name: "Social Studies", color: "bg-muted", icon: "🌍" },
  ];

  const strands = {
    math: [
      { id: "numbers", name: "Numbers & Operations", color: "bg-primary" },
      { id: "algebra", name: "Algebra", color: "bg-primary" },
      { id: "geometry", name: "Geometry", color: "bg-primary" },
      { id: "statistics", name: "Statistics", color: "bg-primary" }
    ],
    english: [
      { id: "reading", name: "Reading Comprehension", color: "bg-secondary" },
      { id: "writing", name: "Writing", color: "bg-secondary" },
      { id: "grammar", name: "Grammar", color: "bg-secondary" },
      { id: "vocabulary", name: "Vocabulary", color: "bg-secondary" }
    ],
    science: [
      { id: "biology", name: "Biology", color: "bg-accent" },
      { id: "chemistry", name: "Chemistry", color: "bg-accent" },
      { id: "physics", name: "Physics", color: "bg-accent" },
      { id: "earth", name: "Earth Science", color: "bg-accent" }
    ],
    social: [
      { id: "history", name: "History", color: "bg-muted" },
      { id: "geography", name: "Geography", color: "bg-muted" },
      { id: "civics", name: "Civics", color: "bg-muted" },
      { id: "economics", name: "Economics", color: "bg-muted" }
    ]
  };

  const substrands = {
    numbers: [
      { id: "fractions", name: "Fractions" },
      { id: "decimals", name: "Decimals" },
      { id: "percentages", name: "Percentages" },
      { id: "integers", name: "Integers" }
    ],
    algebra: [
      { id: "equations", name: "Linear Equations" },
      { id: "expressions", name: "Algebraic Expressions" },
      { id: "inequalities", name: "Inequalities" },
      { id: "functions", name: "Functions" }
    ],
    reading: [
      { id: "comprehension", name: "Reading Comprehension" },
      { id: "inference", name: "Making Inferences" },
      { id: "main-idea", name: "Main Idea" },
      { id: "vocabulary-context", name: "Vocabulary in Context" }
    ],
    biology: [
      { id: "plants", name: "Plant Biology" },
      { id: "animals", name: "Animal Biology" },
      { id: "cells", name: "Cell Structure" },
      { id: "genetics", name: "Genetics" }
    ]
  };

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

        <Card className="p-8 text-center bg-secondary">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
            <p className="text-muted-foreground">Pick how you want to practice today!</p>
          </div>
          <Button 
            size="lg"
            onClick={() => setCurrentStep("setup")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Let's Practice! 🎯
          </Button>
        </Card>
      </div>
    );
  }

  if (currentStep === "setup") {
    const canStartPractice = selectedStyle && selectedSubject && selectedStrand && selectedSubstrand;
    const selectedStyleData = practiceStyles.find(s => s.id === selectedStyle);
    const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
    const availableStrands = selectedSubject ? strands[selectedSubject] || [] : [];
    const availableSubstrands = selectedStrand ? substrands[selectedStrand] || [] : [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("welcome")}>
            ← Back
          </Button>
          <div>
            <h2 className="text-xl font-bold">Setup Your Practice</h2>
            <p className="text-muted-foreground">Choose your practice preferences</p>
          </div>
        </div>

        <JesiAssistant 
          message={`Ready to practice, ${firstName}? Just pick your preferences and let's get started! 🚀`}
          variant="encouragement"
        />

        <Card className="p-6">
          <div className="space-y-6">
            {/* Practice Style Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Practice Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose how you want to practice" />
                </SelectTrigger>
                <SelectContent>
                  {practiceStyles.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${style.color} rounded-md flex items-center justify-center text-white`}>
                          <style.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{style.name}</div>
                          <div className="text-xs text-muted-foreground">{style.duration}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStyleData && (
                <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
                  {selectedStyleData.description}
                </div>
              )}
            </div>

            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={(value) => {
                setSelectedSubject(value);
                setSelectedStrand("");
                setSelectedSubstrand("");
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${subject.color} rounded-md flex items-center justify-center text-white text-sm`}>
                          {subject.icon}
                        </div>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Strand Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Strand</label>
              <Select 
                value={selectedStrand} 
                onValueChange={(value) => {
                  setSelectedStrand(value);
                  setSelectedSubstrand("");
                }}
                disabled={!selectedSubject}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedSubject ? "Choose a strand" : "Select a subject first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableStrands.map((strand) => (
                    <SelectItem key={strand.id} value={strand.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${strand.color} rounded-md flex items-center justify-center text-white`}>
                          <Target className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{strand.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Substrand Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Substrand</label>
              <Select 
                value={selectedSubstrand} 
                onValueChange={setSelectedSubstrand}
                disabled={!selectedStrand}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedStrand ? "Choose a substrand" : "Select a strand first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubstrands.map((substrand) => (
                    <SelectItem key={substrand.id} value={substrand.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${selectedSubjectData?.color} rounded-md flex items-center justify-center text-white`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{substrand.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Practice Button */}
            <div className="pt-4">
              <Button 
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={() => setCurrentStep("practice")}
                disabled={!canStartPractice}
              >
                {canStartPractice ? "Start Practice! 🚀" : "Please complete all selections"}
              </Button>
            </div>

            {/* Selection Summary */}
            {canStartPractice && (
              <div className="bg-secondary p-4 rounded-lg">
                <h4 className="font-medium mb-2">Practice Summary:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Style: {selectedStyleData?.name}</div>
                  <div>Subject: {selectedSubjectData?.name}</div>
                  <div>Strand: {availableStrands.find(s => s.id === selectedStrand)?.name}</div>
                  <div>Substrand: {availableSubstrands.find(s => s.id === selectedSubstrand)?.name}</div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === "practice") {
    const currentQ = questions[currentQuestion - 1];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("setup")}>
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
              <div className="mt-8 pt-6 border-t bg-secondary p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    💡
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-foreground mb-2">Solution:</h4>
                    <p className="text-sm text-muted-foreground">{currentQ.solution}</p>
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

      <Card className="p-8 text-center bg-secondary">
        <div className="mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="text-4xl font-bold text-primary mb-2">{score}/{questions.length}</div>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-6 h-6 ${i < Math.ceil((score / questions.length) * 5) ? 'text-primary fill-current' : 'text-muted-foreground'}`} 
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
            onClick={() => setCurrentStep("setup")}
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