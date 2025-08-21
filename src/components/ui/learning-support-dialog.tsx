import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageCircle, BookOpen, Lightbulb, Target, ArrowRight } from "lucide-react";

interface LearningSupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mood: "confusing" | "tough";
  selectedSubject?: string;
  onSupportSelected: (supportType: string, details: string) => void;
}

export function LearningSupportDialog({ 
  isOpen, 
  onClose, 
  mood, 
  selectedSubject,
  onSupportSelected 
}: LearningSupportDialogProps) {
  const [selectedSupport, setSelectedSupport] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [currentStep, setCurrentStep] = useState<"selection" | "details" | "confirmation">("selection");
  
  console.log("LearningSupportDialog props:", { isOpen, mood, selectedSubject });

  const supportOptions = [
    {
      id: "concept-unclear",
      title: "The concept is unclear",
      description: "I need a simpler explanation",
      icon: Brain,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      badge: "Understanding"
    },
    {
      id: "need-examples",
      title: "I need more examples",
      description: "Show me practical examples",
      icon: Lightbulb,
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      badge: "Examples"
    },
    {
      id: "pace-too-fast",
      title: "The pace is too fast",
      description: "I need to slow down",
      icon: Target,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      badge: "Pacing"
    },
    {
      id: "need-practice",
      title: "I need more practice",
      description: "Let me try more exercises",
      icon: BookOpen,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      badge: "Practice"
    },
    {
      id: "different-approach",
      title: "Try a different approach",
      description: "This method doesn't work for me",
      icon: MessageCircle,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      badge: "Method"
    }
  ];

  const handleSupportSelect = (supportId: string) => {
    setSelectedSupport(supportId);
    setCurrentStep("details");
  };

  const handleSubmit = () => {
    const selectedOption = supportOptions.find(opt => opt.id === selectedSupport);
    onSupportSelected(selectedSupport, additionalDetails);
    setCurrentStep("confirmation");
    
    // Auto close after showing confirmation
    setTimeout(() => {
      onClose();
      setCurrentStep("selection");
      setSelectedSupport("");
      setAdditionalDetails("");
    }, 2000);
  };

  const getJesiMessage = () => {
    if (mood === "confusing") {
      return "I see you're finding something confusing! 🤔 That's totally normal - everyone learns differently. Let me help you figure out the best way to support your learning.";
    }
    return "I notice you're finding things tough! 💪 That shows you're challenging yourself, which is great! Let's find the right support to help you succeed.";
  };

  const getSelectedOption = () => supportOptions.find(opt => opt.id === selectedSupport);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Let's Get You the Right Support!
          </DialogTitle>
        </DialogHeader>

        {currentStep === "selection" && (
          <div className="space-y-6">
            {/* Jesi's supportive message */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Jesi AI</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getJesiMessage()}
                  </p>
                </div>
              </div>
            </div>

            {selectedSubject && (
              <div className="text-center">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Subject: {selectedSubject}
                </Badge>
              </div>
            )}

            {/* Support options */}
            <div className="grid gap-3">
              <h3 className="font-semibold text-lg text-center mb-2">
                What kind of support would help you most?
              </h3>
              
              {supportOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all duration-200 border-2 ${option.color} hover:shadow-md`}
                    onClick={() => handleSupportSelect(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{option.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {option.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="outline" className="text-sm px-3 py-1 mb-4">
                {getSelectedOption()?.badge}
              </Badge>
              <h3 className="font-semibold text-lg mb-2">
                {getSelectedOption()?.title}
              </h3>
              <p className="text-muted-foreground">
                {getSelectedOption()?.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tell us more (optional):
                </label>
                <Textarea
                  placeholder="What specifically is challenging? Any particular topics or concepts?"
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("selection")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Get Support
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "confirmation" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Perfect! I've got it! 🎯</h3>
              <p className="text-muted-foreground">
                I'm preparing personalized support for you. Your learning experience will be adjusted to help with <strong>{getSelectedOption()?.title.toLowerCase()}</strong>.
              </p>
            </div>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Personalizing your experience...
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}