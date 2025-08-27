import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageCircle, BookOpen, Lightbulb, Target, ArrowRight, Heart, Gamepad2, GraduationCap } from "lucide-react";

interface LearningSupportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mood: "confusing" | "tough";
  selectedSubject?: string;
  onSupportSelected: (supportType: string, details: string) => void;
  onNavigateToPractice?: () => void;
  onOpenChatbot?: () => void;
  onNavigateToClass?: () => void;
}

export function LearningSupportDialog({ 
  isOpen, 
  onClose, 
  mood, 
  selectedSubject,
  onSupportSelected,
  onNavigateToPractice,
  onOpenChatbot,
  onNavigateToClass
}: LearningSupportDialogProps) {
  const [currentStep, setCurrentStep] = useState<"selection" | "encouragement" | "chatOptions">("selection");
  
  const supportOptions = [
    {
      id: "need-practice",
      title: "I need to practice more",
      description: "Take me to the practice zone",
      icon: Gamepad2,
      color: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:from-purple-100 hover:to-purple-200",
      action: () => {
        onNavigateToPractice?.();
        onClose();
      }
    },
    {
      id: "didnt-understand",
      title: "I didn't understand",
      description: "Let me chat with Jesi for help",
      icon: MessageCircle,
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:from-blue-100 hover:to-blue-200",
      action: () => {
        onOpenChatbot?.();
        onClose();
      }
    },
    {
      id: "feeling-down",
      title: "I'm feeling down",
      description: "I need some encouragement",
      icon: Heart,
      color: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 hover:from-pink-100 hover:to-pink-200",
      action: () => setCurrentStep("encouragement")
    },
    {
      id: "other-help",
      title: "Something else",
      description: "I need different kind of help",
      icon: Brain,
      color: "bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:from-green-100 hover:to-green-200",
      action: () => setCurrentStep("chatOptions")
    }
  ];

  const getJesiMessage = () => {
    if (mood === "confusing") {
      return "Don't worry! 🤗 Learning can be confusing sometimes. That's how our brain grows! What would help you most right now?";
    }
    return "Hey there! 💪 I see you're facing some challenges. That's totally normal and shows you're pushing yourself to learn! How can I support you?";
  };

  const encouragementMessages = [
    "You're doing amazing! 🌟 Every challenge you face is making you stronger and smarter.",
    "Remember, even the greatest minds struggled with new concepts. You're on the right path! 🚀",
    "Your persistence is inspiring! Learning isn't always easy, but you're proving you can do it. 💪",
    "Take a deep breath. You've overcome challenges before, and you'll overcome this one too! 🌈"
  ];

  const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-primary mb-1">Jesi AI ✨</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {getJesiMessage()}
                  </p>
                </div>
              </div>
            </div>

            {selectedSubject && (
              <div className="text-center">
                <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30">
                  📚 Subject: {selectedSubject}
                </Badge>
              </div>
            )}

            {/* Support options */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-center mb-4 text-foreground">
                How can I help you? 💫
              </h3>
              
              <div className="grid gap-4">
                {supportOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Card 
                      key={option.id}
                      className={`cursor-pointer transition-all duration-300 border-2 ${option.color} hover:shadow-lg hover:scale-[1.02] transform`}
                      onClick={option.action}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1 text-foreground">{option.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-primary/60" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentStep === "encouragement" && (
          <div className="space-y-6">
            {/* Encouraging message from Jesi */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-pink-700 mb-2">Words of Encouragement 💝</h4>
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {randomEncouragement}
                  </p>
                  <div className="bg-white/60 rounded-lg p-3 border border-pink-200">
                    <p className="text-sm text-pink-600 font-medium">
                      ✨ Remember: Every expert was once a beginner. You're doing great by not giving up!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center text-foreground">
                What would you like to do next?
              </h3>
              
              <div className="grid gap-3">
                <Button 
                  onClick={() => {
                    onOpenChatbot?.();
                    onClose();
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
                >
                  💬 Chat More with Jesi
                </Button>
                
                <Button 
                  onClick={() => {
                    onNavigateToClass?.();
                    onClose();
                  }}
                  variant="outline"
                  className="w-full py-4 border-2 border-primary hover:bg-primary/5"
                >
                  📚 Enter Class & Start Learning
                </Button>
                
                <Button 
                  onClick={() => setCurrentStep("selection")}
                  variant="ghost"
                  className="w-full text-muted-foreground"
                >
                  ← Back to Options
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "chatOptions" && (
          <div className="space-y-6">
            {/* Jesi's message for other help */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700 mb-1">Jesi AI Ready to Help! 🚀</p>
                  <p className="text-sm text-green-600 leading-relaxed">
                    I'm here to help with anything you need! Let's chat and figure out the best way to support your learning journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-bold text-lg text-foreground">
                Let's have a conversation! 🗣️
              </h3>
              
              <Button 
                onClick={() => {
                  onOpenChatbot?.();
                  onClose();
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-lg"
              >
                🤖 Start Chatting with Jesi
              </Button>
              
              <Button 
                onClick={() => setCurrentStep("selection")}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                ← Back to Options
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}