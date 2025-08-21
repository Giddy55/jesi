import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface ReadingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string[];
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

interface LearningProgressDialogProps {
  open: boolean;
  onClose: (response: string) => void;
}

function LearningProgressDialog({ open, onClose }: LearningProgressDialogProps) {
  const options = [
    { id: "understand", label: "I understand", emoji: "😊", color: "bg-green-100 text-green-800 hover:bg-green-200" },
    { id: "trying", label: "I'm trying", emoji: "🤔", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
    { id: "confused", label: "I don't get it", emoji: "😕", color: "bg-red-100 text-red-800 hover:bg-red-200" }
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">How's your learning going? 🎓</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-center text-muted-foreground">
            Let me know how you're feeling about this content
          </p>
          <div className="space-y-2">
            {options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={`w-full h-auto p-4 justify-start ${option.color}`}
                onClick={() => onClose(option.label)}
              >
                <span className="text-2xl mr-3">{option.emoji}</span>
                <span className="font-medium">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ReadingDialog({ open, onOpenChange, title, content, onComplete, onProgress }: ReadingDialogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentPage(0);
      setReadingProgress(0);
    }
  }, [open]);

  useEffect(() => {
    const progress = ((currentPage + 1) / content.length) * 100;
    setReadingProgress(progress);

    // Show progress dialog at 25%, 50%, and 75% completion
    if (progress === 25 || progress === 50 || progress === 75) {
      setShowProgressDialog(true);
    }

    // Notify parent component of progress change
    onProgress?.(progress);
  }, [currentPage, content.length]);

  const handleNext = () => {
    if (currentPage < content.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Completed reading
      onComplete();
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProgressResponse = (response: string) => {
    setShowProgressDialog(false);
    // You could store this response or use it for analytics
    console.log(`Student progress at ${readingProgress}%: ${response}`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reading Progress</span>
                <span>{Math.round(readingProgress)}%</span>
              </div>
              <Progress value={readingProgress} className="h-2" />
            </div>

            {/* Content */}
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  {content[currentPage] && (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {content[currentPage]}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {content.length}
              </span>
              
              <Button onClick={handleNext}>
                {currentPage === content.length - 1 ? (
                  "Complete"
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <LearningProgressDialog 
        open={showProgressDialog}
        onClose={handleProgressResponse}
      />
    </>
  );
}