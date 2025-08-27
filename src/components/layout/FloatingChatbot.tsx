import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JesiAssistant } from "@/components/jesi/JesiAssistant";
import { MessageCircle, X, Send, Minimize2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'jesi', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    const newConversation = [
      ...conversation,
      { type: 'user' as const, content: userMessage },
    ];
    
    setConversation(newConversation);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Call Supabase Edge Function for AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: `You are Jesi AI, a friendly and helpful learning assistant for students. Keep responses simple, encouraging, and educational. The user's name is ${user?.name || 'friend'}.`
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      const aiResponse = data.response || "I'm here to help! Can you ask your question in a different way?";
      
      setConversation(prev => [...prev, { type: 'jesi', content: aiResponse }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback responses for better UX
      const fallbackResponses = [
        "Great question! Let me help you with that 🤓",
        "I understand what you're asking. Here's what I think... 💭", 
        "That's a smart question! Let me break it down for you 🎯",
        "Nice! I love helping with questions like this ✨",
        "You're doing awesome! Here's how I'd approach that... 🚀"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      setConversation(prev => [...prev, { type: 'jesi', content: randomResponse }]);
      
      toast({
        title: "Connection Issue",
        description: "Using offline mode. Some features may be limited.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          data-chatbot-trigger
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 focus-visible-ring"
          aria-label="Open Jesi AI chat"
        >
          <MessageCircle className="w-6 h-6" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 bg-background border shadow-2xl hover:shadow-3xl transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-96'
      }`} role="dialog" aria-label="Jesi AI Chatbot">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">J</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Jesi AI</h3>
              <p className="text-xs text-muted-foreground">Here to help! 🤖</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 p-0 focus-visible-ring"
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              <Minimize2 className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 p-0 focus-visible-ring"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 h-64 overflow-y-auto" role="log" aria-live="polite" aria-label="Chat messages">
              {conversation.length === 0 ? (
                <JesiAssistant 
                  message={`Hey ${user?.name ? user.name : 'there'}! 👋 I'm Jesi, your learning buddy. What can I help you with today?`}
                  variant="greeting"
                />
              ) : (
                conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'user' ? (
                      <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg max-w-[80%] text-sm">
                        {msg.content}
                      </div>
                    ) : (
                      <JesiAssistant 
                        message={msg.content}
                        variant="question"
                      />
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-2 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Jesi is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm focus-visible-ring"
                  disabled={isLoading}
                  aria-label="Type your message"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 focus-visible-ring"
                  disabled={isLoading || !message.trim()}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}