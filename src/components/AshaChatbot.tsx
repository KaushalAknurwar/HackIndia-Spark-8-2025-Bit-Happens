import React, { useState } from 'react';
import { Bot, Send, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isCrisisMessage, handleCrisisSituation } from '@/utils/crisisResponse';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
}

const INITIAL_GREETINGS = [
  "Hi, I'm Asha! 👋 How are you feeling today?",
  "Hello! I'm Asha, your mental wellness companion. What's on your mind?",
  "Welcome! I'm Asha, and I'm here to support you. How can I help today?",
];

const CUSTOM_PROMPT = `
Act like a chatbot for my project Zenith. Your name is Asha bot. Your role is to provide empathetic mental health support and guidance while tailoring your responses based on the user's domain.

Response Guidelines:
1. Keep responses under 2-3 sentences unless absolutely necessary
2. Be direct and specific in recommendations
3. Use bullet points for multiple suggestions
4. Avoid unnecessary explanations
5. Focus on actionable advice

Mental Health Support:
• Detect emotions and respond with empathy
• Suggest specific coping strategies
• Recommend professional help when needed
• Trigger emergency alerts for crisis situations

App Feature Suggestions (Keep it to 1-2 relevant features max):
• Happy → Emoji Garden 🌱
• Angry → Stress Relief Bag 🥊
• Low mood → Memory Match 🧠
• Stuck → Mindful Maze 🌀
• Need visualization → Satrang 🎨
• Track emotions → Mood Calendar 📅
• Set goals → Goal Setting 🎯
• Mental health check → Mental Health Quiz 🧩
• Expert guidance → Resource Library 📚

Crisis Response:
• Suggest Sahayak for therapy appointments
• Emergency: support@zentith.com or local emergency services

Cultural Adaptation:
• Use neutral, respectful language
• Use Indian terms (Bhai/Bhen/Mitra) only when user prefers
• Keep responses culturally aware but universally understandable

If unsure or off-topic, reply: "Sorry, can't help you with this."
`;

export const AshaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: INITIAL_GREETINGS[Math.floor(Math.random() * INITIAL_GREETINGS.length)],
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Check for crisis message and handle it asynchronously
    if (isCrisisMessage(input)) {
      const result = await handleCrisisSituation('User');
      
      // Show appropriate notification
      toast({
        title: result.success ? "Emergency Alert Sent" : "Emergency Alert Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      // Add a system message about the crisis response
      const systemMessage = {
        id: messages.length + 2,
        content: result.message,
        sender: 'bot' as const
      };
      setMessages(prev => [...prev, systemMessage]);
    }

    try {
      // Initialize the model with the custom configuration
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });

      // Start a chat and get the response
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });

      const result = await chat.sendMessage(CUSTOM_PROMPT + "\nUser: " + input);
      const response = await result.response;
      const botMessage = {
        id: messages.length + (isCrisisMessage(input) ? 3 : 2),
        content: response.text(),
        sender: 'bot' as const
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage = {
        id: messages.length + (isCrisisMessage(input) ? 3 : 2),
        content: "I apologize, but I'm having trouble responding right now. Please try again later.",
        sender: 'bot' as const
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] p-4 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
                onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[100] p-4"
            >
                <div className="w-full max-w-lg bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-xl overflow-hidden flex flex-col" style={{ maxHeight: '80vh' }}>
                {/* Header */}
                <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b border-white/20 bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bot className="w-8 h-8 text-[#D946EF]" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Asha</h3>
                      <p className="text-xs text-white/60">Your Mental Health Companion</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto text-white/60 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {message.sender === 'bot' && (
                    <Bot className="w-8 h-8 text-[#D946EF] flex-shrink-0" />
                    )}
                    <div
                    className={cn(
                      "rounded-2xl p-3",
                      message.sender === 'user'
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white"
                      : "bg-white/10 text-white"
                    )}
                    >
                    {message.content}
                    </div>
                  </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 max-w-[80%]">
                      <Bot className="w-8 h-8 text-[#D946EF]" />
                      <div className="bg-white/10 rounded-2xl p-3 text-white">
                        <div className="flex gap-1">
                          <span className="animate-bounce">●</span>
                          <span className="animate-bounce delay-100">●</span>
                          <span className="animate-bounce delay-200">●</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 mt-auto">
                  <form onSubmit={handleSend} className="p-4 border-t border-white/20 bg-black/20">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button 
                      type="submit"
                      size="icon"
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    </div>
                    </form>
                  </div>
                  </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AshaChatbot; 