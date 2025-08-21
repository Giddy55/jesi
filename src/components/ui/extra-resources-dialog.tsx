import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Trophy, Star, CheckCircle, X } from "lucide-react";

interface ExtraResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceType: "quiz" | "video" | "game" | null;
  subjectName: string;
  topic: string;
  onComplete: (resourceType: string, score?: number) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const sampleQuizQuestions: QuizQuestion[] = [
  {
    question: "What is the simplified form of √12?",
    options: ["2√3", "3√2", "6√2", "4√3"],
    correct: 0,
    explanation: "√12 = √(4 × 3) = 2√3"
  },
  {
    question: "Which of these is a rational number?",
    options: ["√2", "π", "0.5", "√3"],
    correct: 2,
    explanation: "0.5 can be expressed as 1/2, making it rational"
  },
  {
    question: "What is √64?",
    options: ["6", "7", "8", "9"],
    correct: 2,
    explanation: "√64 = 8 because 8 × 8 = 64"
  }
];

export function ExtraResourcesDialog({ 
  open, 
  onOpenChange, 
  resourceType, 
  subjectName, 
  topic, 
  onComplete 
}: ExtraResourcesDialogProps) {
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    score: 0,
    showResult: false,
    selectedAnswer: null as number | null,
    showExplanation: false
  });

  const [videoProgress, setVideoProgress] = useState(0);
  const [gameScore, setGameScore] = useState(0);

  const resetStates = () => {
    setQuizState({
      currentQuestion: 0,
      score: 0,
      showResult: false,
      selectedAnswer: null,
      showExplanation: false
    });
    setVideoProgress(0);
    setGameScore(0);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizState(prev => ({ ...prev, selectedAnswer: answerIndex, showExplanation: true }));
    
    setTimeout(() => {
      const isCorrect = answerIndex === sampleQuizQuestions[quizState.currentQuestion].correct;
      const newScore = isCorrect ? quizState.score + 1 : quizState.score;
      
      if (quizState.currentQuestion < sampleQuizQuestions.length - 1) {
        setQuizState({
          currentQuestion: quizState.currentQuestion + 1,
          score: newScore,
          showResult: false,
          selectedAnswer: null,
          showExplanation: false
        });
      } else {
        setQuizState(prev => ({ ...prev, score: newScore, showResult: true }));
      }
    }, 2000);
  };

  const handleResourceComplete = () => {
    let score;
    if (resourceType === "quiz") {
      score = Math.round((quizState.score / sampleQuizQuestions.length) * 100);
    } else if (resourceType === "game") {
      score = gameScore;
    }
    
    onComplete(resourceType!, score);
    onOpenChange(false);
    resetStates();
  };

  const renderQuizContent = () => {
    const question = sampleQuizQuestions[quizState.currentQuestion];
    const progress = ((quizState.currentQuestion + 1) / sampleQuizQuestions.length) * 100;

    if (quizState.showResult) {
      return (
        <div className="space-y-6 text-center">
          <div className="text-6xl">🎉</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
            <div className="text-3xl font-bold text-primary">
              {quizState.score}/{sampleQuizQuestions.length}
            </div>
            <p className="text-muted-foreground">
              You got {Math.round((quizState.score / sampleQuizQuestions.length) * 100)}% correct!
            </p>
          </div>
          <Button onClick={handleResourceComplete} className="w-full">
            <Trophy className="w-4 h-4 mr-2" />
            Collect Reward
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {quizState.currentQuestion + 1} of {sampleQuizQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-medium mb-4">{question.question}</h4>
            <div className="grid gap-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    quizState.showExplanation
                      ? index === question.correct
                        ? "default"
                        : index === quizState.selectedAnswer
                        ? "destructive"
                        : "outline"
                      : "outline"
                  }
                  className="justify-start h-auto p-4"
                  onClick={() => !quizState.showExplanation && handleQuizAnswer(index)}
                  disabled={quizState.showExplanation}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  {quizState.showExplanation && index === question.correct && (
                    <CheckCircle className="w-4 h-4 ml-auto" />
                  )}
                  {quizState.showExplanation && index === quizState.selectedAnswer && index !== question.correct && (
                    <X className="w-4 h-4 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
            {quizState.showExplanation && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVideoContent = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h4 className="text-lg font-medium">Understanding {topic}</h4>
                <p className="text-muted-foreground">Educational video content</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Video Progress</span>
                <span>{videoProgress}%</span>
              </div>
              <Progress value={videoProgress} className="h-2" />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => setVideoProgress(Math.min(100, videoProgress + 25))}
                disabled={videoProgress >= 100}
              >
                <Play className="w-4 h-4 mr-2" />
                {videoProgress === 0 ? "Start Video" : "Continue"}
              </Button>
              {videoProgress >= 100 && (
                <Button onClick={handleResourceComplete}>
                  Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderGameContent = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">{topic} Challenge Game</h4>
              <Badge variant="secondary">Score: {gameScore}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h4 className="text-lg font-medium">Interactive Learning Game</h4>
                <p className="text-muted-foreground">Practice {topic} concepts</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => setGameScore(prev => prev + 10)}
                variant="outline"
              >
                <Star className="w-4 h-4 mr-2" />
                Play Round
              </Button>
              <Button 
                onClick={() => setGameScore(prev => prev + 25)}
                variant="outline"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Bonus Challenge
              </Button>
            </div>
            
            {gameScore >= 50 && (
              <Button onClick={handleResourceComplete} className="w-full mt-4">
                Finish Game
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const getResourceTitle = () => {
    switch (resourceType) {
      case "quiz": return `Interactive Quiz - ${topic}`;
      case "video": return `Educational Video - ${topic}`;
      case "game": return `Learning Game - ${topic}`;
      default: return "Extra Resource";
    }
  };

  const getResourceContent = () => {
    switch (resourceType) {
      case "quiz": return renderQuizContent();
      case "video": return renderVideoContent();
      case "game": return renderGameContent();
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetStates();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getResourceTitle()}</DialogTitle>
        </DialogHeader>
        {getResourceContent()}
      </DialogContent>
    </Dialog>
  );
}