import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import coinsIcon from "@/assets/coins-icon.png";

interface ChatMessage {
  id: string;
  type: 'user' | 'jesi';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    // Add welcome message when component mounts
    if (conversation.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'jesi',
        content: `Hey ${user?.name || 'there'}! 👋 I'm Jesi, your AI learning companion. I'm here to help you with your studies, answer questions, explain concepts, and support your learning journey. What would you like to explore today?`,
        timestamp: new Date()
      };
      setConversation([welcomeMessage]);
    }
  }, [user?.name]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, newUserMessage]);
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
          context: `You are Jesi AI, a friendly and helpful learning assistant for students. You help with homework, explain concepts, provide study tips, and motivate students. Keep responses encouraging, educational, and engaging. The user's name is ${user?.name || 'friend'}. Use emojis sparingly but effectively.`
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      const aiResponse = data.response || "I'm here to help! Can you ask your question in a different way?";
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'jesi',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Enhanced fallback responses
      const fallbackResponses = [
        "Great question! I'd love to help you understand this better. Can you tell me more about what specifically you're struggling with? 🤔",
        "That's an interesting topic! While I'm having some connection issues, I can still try to help. What aspect would you like me to focus on? 💡", 
        "You're asking smart questions! Let me think about this... What level are you studying this at? 🎯",
        "I love helping with challenging topics like this! Can you share what you already know about this subject? ✨",
        "You're doing awesome by asking questions! Even though I'm in offline mode, I'm here to support your learning journey! 🚀"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'jesi',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Connection Issue",
        description: "Using offline mode. I can still help with basic questions!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Focus back on input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Chat with Jesi AI
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Your AI Learning Companion - Always here to help!
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-full">
                <img src={coinsIcon} alt="Coins" className="w-5 h-5" />
                <span className="text-sm font-semibold">Earn coins by learning!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {conversation.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.type === 'user' ? (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[70%] ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-lg' 
                      : 'bg-white border border-gray-100 rounded-bl-lg'
                  }`}>
                    <p className={`text-sm leading-relaxed ${msg.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                      {msg.content}
                    </p>
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-lg shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Jesi is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Ask me anything about your studies..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pr-12 py-3 rounded-full border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                disabled={isLoading}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick suggestions */}
          {conversation.length <= 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Try asking:</span>
              {[
                "Explain photosynthesis",
                "Help with math homework",
                "Study tips for exams",
                "Grammar rules"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-full border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => setMessage(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}