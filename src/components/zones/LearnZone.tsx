import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, MessageCircle, ArrowRight, Search, Clock, CheckCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LearnZoneProps {
  onZoneChange?: (zone: string) => void;
}

export function LearnZone({ onZoneChange }: LearnZoneProps) {
  const [currentStep, setCurrentStep] = useState<"welcome" | "subjects" | "topics" | "content" | "questions" | "chat">("welcome");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [chatQuestion, setChatQuestion] = useState<string>("");
  const [isReading, setIsReading] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'jesi', content: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const name = user?.name?.split(" ")[0] || user?.name || "Champ";

  const subjects = [
    { id: "math", name: "Mathematics", icon: "📊", color: "bg-blue-500", description: "Numbers, patterns & problem solving" },
    { id: "science", name: "Science", icon: "🔬", color: "bg-purple-500", description: "Explore the natural world" },
    { id: "english", name: "English", icon: "📚", color: "bg-green-500", description: "Reading, writing & communication" },
    { id: "history", name: "History", icon: "🏛️", color: "bg-orange-500", description: "Stories from the past" },
  ];

  const mathTopics = [
    { id: "fractions", name: "Fractions", difficulty: "Easy", duration: "5 min", icon: "🍕" },
    { id: "decimals", name: "Decimals", difficulty: "Medium", duration: "7 min", icon: "💯" },
    { id: "geometry", name: "Geometry", difficulty: "Medium", duration: "8 min", icon: "📐" },
    { id: "algebra", name: "Basic Algebra", difficulty: "Hard", duration: "10 min", icon: "🔢" },
  ];

  const commonQuestions = [
    "What's the main idea?",
    "Can you explain this differently?",
    "Give me an example",
    "Why is this important?",
  ];

  const readingSections = [
    { id: "intro", title: "Introduction", completed: false },
    { id: "parts", title: "Understanding the Parts", completed: false },
    { id: "examples", title: "Real-World Examples", completed: false },
    { id: "practice", title: "Practice Time", completed: false },
  ];

  // Calculate progress based on completed sections
  useEffect(() => {
    const totalSections = readingSections.length;
    const completedCount = completedSections.size;
    const progress = (completedCount / totalSections) * 100;
    setReadingProgress(progress);
  }, [completedSections]);

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const handleChatQuestion = async (question: string) => {
    if (!question.trim() || isLoading) return;
    
    const newMessages = [
      ...chatMessages,
      { type: 'user' as const, content: question }
    ];
    
    setChatMessages(newMessages);
    setChatQuestion("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: `You are Jesi AI, a friendly learning assistant. The student is currently learning about ${selectedTopic || 'fractions'} in ${selectedSubject || 'mathematics'}. Provide helpful, age-appropriate explanations. Keep responses concise but encouraging.`
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      const aiResponse = data.response || "That's a great question! Let me help you understand that better. 🌟";
      
      setChatMessages(prev => [...prev, { type: 'jesi', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Educational fallback responses based on common topics
      const fallbackResponses = {
        fraction: "Fractions are like pieces of a whole! If you have a pizza cut into 8 slices and eat 3, you've eaten 3/8 of the pizza. What specifically about fractions would you like to know more about? 🍕",
        why: "Great 'why' question! Understanding the reason behind things helps you learn better. In math, everything connects to real life in some way. What specific concept are you curious about? 🤔",
        how: "Excellent 'how' question! Let me break this down step by step for you. The best way to learn math is to practice with small steps first. What would you like me to explain? 📝",
        help: "I'm here to help you succeed! Learning can be challenging sometimes, but that's totally normal. Every expert was once a beginner. What's the specific topic you're working on? 💪",
        default: "That's a really thoughtful question! I love when students ask questions - it shows you're thinking deeply about what you're learning. Can you tell me more about what part you'd like to understand better? ✨"
      };
      
      let response = fallbackResponses.default;
      if (question.toLowerCase().includes('fraction')) response = fallbackResponses.fraction;
      else if (question.toLowerCase().includes('why')) response = fallbackResponses.why;
      else if (question.toLowerCase().includes('how')) response = fallbackResponses.how;
      else if (question.toLowerCase().includes('help')) response = fallbackResponses.help;
      
      setChatMessages(prev => [...prev, { type: 'jesi', content: response }]);
      
      toast({
        title: "Offline Mode",
        description: "Using basic responses. Connect to internet for full AI features.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === "welcome") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to LearnZone! 📚</h1>
          <p className="text-muted-foreground">Explore strands that spark your curiosity</p>
        </div>

        <JesiAssistant 
          message={`Yoo, ${name}! 👊 Welcome to your Learning Zone. Ready to crush some goals today?`}
          variant="greeting"
        />

        <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Your Learning Journey</h3>
            <p className="text-muted-foreground">Pick what interests you and dive deep into knowledge</p>
          </div>
          <Button 
            size="lg"
            onClick={() => setCurrentStep("subjects")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Let's Go! 🎯
          </Button>
        </Card>
      </div>
    );
  }

  if (currentStep === "subjects") {
    return (
      <div className="space-y-6">
        <JesiAssistant 
          message="Nice pick! Now let's choose a subject that excites you today 🌟"
          variant="question"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => {
                setSelectedSubject(subject.id);
                setCurrentStep("topics");
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${subject.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">{subject.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === "topics") {
    const subject = subjects.find(s => s.id === selectedSubject);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("subjects")}>
            ← Back
          </Button>
          <div className={`w-10 h-10 ${subject?.color} rounded-lg flex items-center justify-center text-white`}>
            {subject?.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold">{subject?.name}</h2>
            <p className="text-muted-foreground">Choose a strand to explore</p>
          </div>
        </div>

        <JesiAssistant 
          message="Awesome choice! Now let's zoom into a strand and level up! 🎯"
          variant="encouragement"
        />

        <div className="grid gap-4">
          {mathTopics.map((topic) => (
            <Card 
              key={topic.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
              onClick={() => {
                setSelectedTopic(topic.id);
                setCurrentStep("content");
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center text-xl">
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{topic.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant={topic.difficulty === "Easy" ? "secondary" : topic.difficulty === "Medium" ? "default" : "destructive"}>
                      {topic.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {topic.duration}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === "content") {
    const topic = mathTopics.find(t => t.id === selectedTopic);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" onClick={() => setCurrentStep("topics")}>
            ← Back
          </Button>
          <div>
            <h2 className="text-xl font-bold">{topic?.name}</h2>
            <p className="text-muted-foreground">Learn at your own pace</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Reading Material</h3>
              <Badge variant="secondary">Interactive</Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Reading Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(readingProgress)}%</span>
              </div>
              <Progress value={readingProgress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{completedSections.size} of {readingSections.length} sections</span>
                <span>{readingProgress === 100 ? "Complete! 🎉" : "Keep reading..."}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Understand the basics of {topic?.name} with visual examples and simple explanations.
            </p>
            
            {/* Introduction Section */}
            <div className="bg-muted/50 p-4 rounded-lg mb-4 relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">What are Fractions? 🍕</h4>
                {completedSections.has("intro") && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                A fraction represents a part of a whole. Think of a pizza cut into 8 slices. 
                If you eat 3 slices, you've eaten 3/8 of the pizza!
              </p>
              {!completedSections.has("intro") && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => markSectionComplete("intro")}
                >
                  Mark as Read
                </Button>
              )}
            </div>
            
            {/* Reading Sections - Expand inline */}
            {isReading && (
              <div className="space-y-4 mb-4 animate-fade-in">
                {/* Understanding Parts Section */}
                <div className="bg-muted/50 p-4 rounded-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Understanding the Parts 📐</h4>
                    {completedSections.has("parts") && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Every fraction has two main parts:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• <strong>Numerator</strong> (top number) - tells us how many parts we have</li>
                    <li>• <strong>Denominator</strong> (bottom number) - tells us how many parts the whole is divided into</li>
                  </ul>
                  {!completedSections.has("parts") && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => markSectionComplete("parts")}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
                
                {/* Examples Section */}
                <div className="bg-muted/50 p-4 rounded-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Real-World Examples 🌟</h4>
                    {completedSections.has("examples") && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>🍰 Cake Example:</strong> If you cut a cake into 4 equal pieces and eat 1 piece, you've eaten 1/4 of the cake.</p>
                    <p><strong>⏰ Time Example:</strong> 30 minutes is 30/60 of an hour, which equals 1/2 hour.</p>
                    <p><strong>💰 Money Example:</strong> A quarter (25 cents) is 25/100 of a dollar, which equals 1/4 dollar.</p>
                  </div>
                  {!completedSections.has("examples") && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => markSectionComplete("examples")}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
                
                {/* Practice Section */}
                <div className="bg-muted/50 p-4 rounded-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Practice Time! 🎯</h4>
                    {completedSections.has("practice") && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Try to identify fractions around you today. Look at clock faces, pizza slices, or even your phone's battery percentage. 
                    Fractions are everywhere once you start noticing them!
                  </p>
                  {!completedSections.has("practice") && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => markSectionComplete("practice")}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button 
                className="flex-1"
                onClick={() => setIsReading(!isReading)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {isReading ? "Show Less" : "Read More"}
              </Button>
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Listen
              </Button>
            </div>
            
            {/* Progress Celebration */}
            {readingProgress === 100 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h4 className="font-semibold text-green-800 mb-1">Great Job!</h4>
                <p className="text-sm text-green-600">You've completed this reading section!</p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Play className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold">Watch & Learn</h3>
              <Badge variant="outline">3 min video</Badge>
            </div>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Interactive Fractions Explained</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Ask Jesi AI</h3>
            </div>
            <p className="text-muted-foreground mb-4">Got questions? I'm here to help!</p>
            <Button 
              onClick={() => setCurrentStep("chat")}
              variant="outline" 
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Jesi AI
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-dashed border-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
              <p className="text-muted-foreground mb-4">Test your knowledge with fun exercises!</p>
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={() => onZoneChange?.("practice")}
              >
                Let's Practice! 💪
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" onClick={() => setCurrentStep("content")}>
          ← Back
        </Button>
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Chat with Jesi AI 💬
          </h2>
          <p className="text-muted-foreground">Your personal AI tutor is here to help!</p>
        </div>
      </div>

      {/* Enhanced Chat Interface */}
      <div className="space-y-6">
        {/* Welcome Message - Only show if no conversation yet */}
        {chatMessages.length === 0 && (
          <Card className="bg-secondary/30 border-accent">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-primary mb-2">Jesi AI ✨</h4>
                  <p className="text-foreground leading-relaxed">
                    Hi {name}! 👋 I'm here to help you learn about <strong>{selectedTopic || 'your chosen topic'}</strong> in <strong>{selectedSubject || 'Mathematics'}</strong>. 
                    Ask me anything - I can explain concepts, give examples, or help with problems you're stuck on!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Chat Messages - Enhanced Design */}
        {chatMessages.length > 0 && (
          <Card className="border-2 border-accent">
            <div className="p-6 max-h-[500px] overflow-y-auto space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.type === 'user' ? (
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-accent-foreground text-sm font-bold">{name?.charAt(0) || 'U'}</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex-1 max-w-[80%] ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-accent text-accent-foreground rounded-br-lg' 
                        : 'bg-card border border-border rounded-bl-lg'
                    }`}>
                      <p className={`text-sm leading-relaxed ${msg.type === 'user' ? 'text-accent-foreground' : 'text-card-foreground'}`}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-card border border-border p-4 rounded-2xl rounded-bl-lg shadow-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Jesi is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Quick Questions - Enhanced */}
        <Card className="border-2 border-secondary">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground text-lg">💡</span>
              </div>
              <h3 className="font-bold text-lg text-secondary-foreground">Quick Questions</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left justify-start h-auto p-4 border-secondary hover:bg-secondary/50 hover:border-accent transition-all"
                  onClick={() => handleChatQuestion(question)}
                  disabled={isLoading}
                >
                  <span className="text-accent-foreground mr-2">❓</span>
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Custom Question Input - Enhanced */}
        <Card className="border-2 border-accent bg-accent/20">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-lg">💬</span>
              </div>
              <h3 className="font-bold text-lg text-accent-foreground">Ask Your Own Question</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  placeholder={`Ask me anything about ${selectedTopic || 'this topic'}...`}
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatQuestion(chatQuestion)}
                  className="flex-1 border-accent focus:border-primary focus:ring-ring"
                  disabled={isLoading}
                />
                <Button 
                  onClick={() => handleChatQuestion(chatQuestion)}
                  disabled={isLoading || !chatQuestion.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Ask Jesi
                </Button>
              </div>
              <p className="text-sm text-accent-foreground">
                💡 Try asking: "Can you give me a real-world example?" or "What's the easiest way to remember this?"
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}