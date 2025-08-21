import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Star } from "lucide-react";

interface JesiAssistantProps {
  message?: string;
  onClose?: () => void;
  variant?: "greeting" | "question" | "encouragement" | "tip";
}

export function JesiAssistant({ 
  message = "Hi there! I'm Jesi AI, your learning buddy! 🌟", 
  onClose,
  variant = "greeting" 
}: JesiAssistantProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getJesiColor = () => {
    switch (variant) {
      case "encouragement": return "bg-blur border-accent";
      case "question": return "bg-blur border-primary";
      case "tip": return "bg-blur border-warning";
      default: return "bg-blur border-primary/30";
    }
  };

  return (
    <Card className={`relative ${getJesiColor()} border-2 animate-bounce-in`} style={{ boxShadow: '5px 5px 0px rgba(0, 0, 0, 0.3)' }}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FF7900] to-[#FFA14D] rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-lg text-[#FF7900]">Jesi AI ✨</h4>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            <p className="text-base text-gray-700 leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const moods = [
    { emoji: "🤩", label: "Great!", value: "great", style: "mood-great" },
    { emoji: "🙂", label: "Good", value: "good", style: "mood-good" },
    { emoji: "😐", label: "Okay", value: "okay", style: "mood-okay" },
    { emoji: "😕", label: "Confusing", value: "confusing", style: "mood-confusing" },
    { emoji: "😩", label: "Tough", value: "tough", style: "mood-tough" },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {moods.map((mood) => (
        <Button
          key={mood.value}
          variant="outline"
          className={`flex flex-col gap-2 p-4 h-auto hover:scale-110 transition-all ${mood.style} border-2 hover-lift`}
          onClick={() => onMoodSelect(mood.value)}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="text-sm font-medium">{mood.label}</span>
        </Button>
      ))}
    </div>
  );
}

interface RatingSelectorProps {
  onRatingSelect: (rating: number) => void;
}

export function RatingSelector({ onRatingSelect }: RatingSelectorProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <Button
          key={rating}
          variant="ghost"
          className="p-2 hover:scale-125 transition-all"
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => onRatingSelect(rating)}
        >
          <Star 
            className={`w-8 h-8 ${
              rating <= hoveredRating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        </Button>
      ))}
    </div>
  );
}

interface PracticeStyleSelectorProps {
  onStyleSelect: (style: string) => void;
}

export function PracticeStyleSelector({ onStyleSelect }: PracticeStyleSelectorProps) {
  const styles = [
    { 
      id: "game", 
      name: "Game Mode", 
      icon: "🎮", 
      description: "Fun, time-based challenges",
      color: "bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300"
    },
    { 
      id: "quiz", 
      name: "Quick Quiz", 
      icon: "🧩", 
      description: "5-10 MCQs, straight to the point",
      color: "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300"
    },
    { 
      id: "smart", 
      name: "Smart Practice", 
      icon: "💡", 
      description: "Adaptive questions based on weaknesses",
      color: "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300"
    },
    { 
      id: "exam", 
      name: "Exam Prep", 
      icon: "📝", 
      description: "Past questions, simulate test conditions",
      color: "bg-gradient-to-br from-green-100 to-green-200 border-green-300"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {styles.map((style) => (
        <Card
          key={style.id}
          className={`cursor-pointer hover:shadow-lg transition-all hover-lift ${style.color} border-2 fun-shadow`}
          onClick={() => onStyleSelect(style.id)}
        >
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">{style.icon}</div>
            <h3 className="font-bold text-lg mb-2">{style.name}</h3>
            <p className="text-sm text-gray-600">{style.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
