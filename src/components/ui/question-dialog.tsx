import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "short-answer" | "true-false";
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
}

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: Question[];
  onComplete: (results: QuestionResult[]) => void;
  title: string;
}

interface QuestionResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

export function QuestionDialog({ 
  open, 
  onOpenChange, 
  questions, 
  onComplete, 
  title 
}: QuestionDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswer = userAnswers[currentQuestion?.id];

  useEffect(() => {
    if (open) {
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowExplanation(false);
      setQuestionResults([]);
    }
  }, [open]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const checkAnswer = () => {
    if (!currentQuestion || !hasAnswer) return;

    const userAnswer = userAnswers[currentQuestion.id];
    let isCorrect = false;

    if (currentQuestion.type === "multiple-choice") {
      isCorrect = userAnswer === currentQuestion.options?.[currentQuestion.correctAnswer as number];
    } else if (currentQuestion.type === "true-false") {
      isCorrect = userAnswer.toLowerCase() === currentQuestion.correctAnswer?.toString().toLowerCase();
    } else {
      // For short answer, we'll consider it correct for demo purposes
      isCorrect = userAnswer.trim().length > 0;
    }

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      userAnswer,
      isCorrect
    };

    setQuestionResults(prev => [...prev, result]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(questionResults);
      onOpenChange(false);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const userAnswer = userAnswers[currentQuestion.id];

    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <Button
                key={index}
                variant={userAnswer === option ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(option)}
                disabled={showExplanation}
              >
                <span className="mr-3 font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>
        );

      case "true-false":
        return (
          <div className="space-y-3">
            {["True", "False"].map((option) => (
              <Button
                key={option}
                variant={userAnswer === option ? "default" : "outline"}
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => handleAnswer(option)}
                disabled={showExplanation}
              >
                {option}
              </Button>
            ))}
          </div>
        );

      case "short-answer":
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Type your answer here..."
              value={userAnswer || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              disabled={showExplanation}
              className="min-h-[100px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentQuestion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question Progress</span>
              <span>
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Q{currentQuestionIndex + 1}
                </Badge>
                <div className="flex-1">
                  <h3 className="text-lg font-medium leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                </div>
              </div>

              {renderQuestion()}

              {/* Explanation */}
              {showExplanation && currentQuestion.explanation && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-sm">Explanation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {showExplanation ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Answer submitted!
                </span>
              ) : (
                "Select your answer above"
              )}
            </div>

            <div className="flex gap-3">
              {!showExplanation && hasAnswer && (
                <Button onClick={checkAnswer}>
                  Submit Answer
                </Button>
              )}
              
              {showExplanation && (
                <Button onClick={handleNext}>
                  {isLastQuestion ? (
                    "Complete"
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}