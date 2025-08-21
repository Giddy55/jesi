import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { 
  ArrowLeft, 
  CheckCircle, 
  Play, 
  BookOpen, 
  Clock, 
  Star, 
  Target,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShsClassFlowProps {
  selectedSubject: string;
  subjects: any[];
  onBack: () => void;
  onComplete: () => void;
}

export function ShsClassFlow({ selectedSubject, subjects, onBack, onComplete }: ShsClassFlowProps) {
  const [currentStep, setCurrentStep] = useState<"overview" | "focus" | "resources" | "understanding">("overview");
  const [understanding, setUnderstanding] = useState<string>("");
  const { toast } = useToast();

  const subject = subjects.find(s => s.id === selectedSubject);
  
  if (!subject) return null;

  const handleUnderstandingSelect = (level: string) => {
    setUnderstanding(level);
    
    toast({
      title: "Thanks for the feedback! 📝",
      description: level === "got-it" ? "Great! You're ready to move forward." : 
                   level === "unsure" ? "No worries, let's practice more." :
                   "We'll get you extra help with this strand.",
    });

    // Move to next step after brief delay
    setTimeout(() => {
      setCurrentStep("resources");
    }, 1500);
  };

  if (currentStep === "overview") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{subject.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{subject.name}</h2>
              <p className="text-sm text-muted-foreground">{subject.teacher}</p>
            </div>
          </div>
        </div>

        <JesiAssistant 
          message={`Let's dive into ${subject.name}. This week's focus: ${subject.topic} 📚`}
          variant="greeting"
        />

        {/* Subject Overview Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              This Week's Strand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{subject.topic}</h3>
                <p className="text-muted-foreground">
                  {subject.difficulty} Level • Next Exam: {subject.nextExam}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="text-sm font-medium">{subject.studyTime}</div>
                  <div className="text-xs text-muted-foreground">Study Time</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">{subject.performance}%</div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">{subject.progress}%</div>
                  <div className="text-xs text-muted-foreground">Progress</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium capitalize">{subject.homeworkStatus}</div>
                  <div className="text-xs text-muted-foreground">Homework</div>
                </div>
              </div>

              <Progress value={subject.progress} className="h-3" />
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => setCurrentStep("focus")}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  Review This Week's Focus
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "focus") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("overview")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-2xl">{subject.icon}</span>
          <h2 className="text-xl font-bold">Weekly Focus</h2>
        </div>

        <JesiAssistant 
          message="This week's key strand: let's see how well you understand it! 🎯"
          variant="question"
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {subject.topic}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">Key Learning Objectives:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Understand fundamental concepts and definitions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Apply theoretical knowledge to practical problems
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Analyze complex scenarios and draw conclusions
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">How do you feel about this strand?</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-green-50 hover:border-green-500"
                    onClick={() => handleUnderstandingSelect("got-it")}
                  >
                    <ThumbsUp className="w-6 h-6 text-green-500" />
                    <span className="text-sm">I got it</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-yellow-50 hover:border-yellow-500"
                    onClick={() => handleUnderstandingSelect("unsure")}
                  >
                    <HelpCircle className="w-6 h-6 text-yellow-500" />
                    <span className="text-sm">I'm unsure</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-red-50 hover:border-red-500"
                    onClick={() => handleUnderstandingSelect("need-help")}
                  >
                    <ThumbsDown className="w-6 h-6 text-red-500" />
                    <span className="text-sm">Need help</span>
                  </Button>
                </div>
              </div>

              {/* Teacher Note Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Teacher's Note</h4>
                <p className="text-sm text-blue-800">
                  "Focus on understanding the core principles first, then practice applying them to different scenarios. 
                  Don't hesitate to ask questions during our next session!"
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Listen
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "resources") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("focus")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <span className="text-2xl">{subject.icon}</span>
          <h2 className="text-xl font-bold">Extra Resources</h2>
        </div>

        <JesiAssistant 
          message="Here are some extra resources to help you master this strand! 📚"
          variant="encouragement"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              type: "video",
              title: "Video Lesson",
              description: "Watch an in-depth explanation",
              icon: "🎥",
              color: "bg-red-500",
              duration: "15 min"
            },
            {
              type: "guide",
              title: "Revision Guide",
              description: "Step-by-step written guide",
              icon: "📝",
              color: "bg-blue-500",
              duration: "10 min"
            },
            {
              type: "activity",
              title: "Interactive Activity",
              description: "Practice with simulations",
              icon: "🎮",
              color: "bg-green-500",
              duration: "12 min"
            }
          ].map((resource, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${resource.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{resource.icon}</span>
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                <Badge variant="secondary">{resource.duration}</Badge>
                <Button className="w-full mt-4" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-primary to-accent"
          >
            Complete Session
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}