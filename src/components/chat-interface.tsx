"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/message-bubble';
import { detectJokeRequest } from '@/ai/flows/detect-joke-request';
import { tellHindiJoke } from '@/ai/flows/tell-hindi-joke-flow';
import { upliftSadUser } from '@/ai/flows/uplift-sad-user';
import { refuseDarkJoke } from '@/ai/flows/refuse-dark-joke';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Arey bhai! Kaise ho? Main hu Keeyo, tumhara funny Indian friend. 🇮🇳\nKoi mast sa joke sunna hai? Bas bolo "joke suna" aur dekho kamaal! 😂',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const intentResult = await detectJokeRequest({ message: input });
      let responseContent = "";

      switch (intentResult.intent) {
        case 'tell_joke':
          responseContent = await tellHindiJoke({});
          break;
        case 'dark_joke_request':
          const refusal = await refuseDarkJoke({});
          responseContent = refusal.message;
          break;
        case 'user_sad':
          const uplift = await upliftSadUser({ userMessage: input });
          responseContent = uplift.keeyoResponse;
          break;
        case 'user_laughed':
          responseContent = "Arey maza aa gaya na! 😂 [laughing softly] Bhai tumhari hansi dekh ke dil khush ho gaya. Phir se ek sunau kya? Bas bolo!";
          break;
        default:
          responseContent = "Arey yaar, ye kya bol rahe ho? 😂 Mujhe toh sirf jokes pasand hain. Chalo ek mast joke sunata hu... [laughing softly]";
          const fallbackJoke = await tellHindiJoke({});
          responseContent = fallbackJoke;
          break;
      }

      const keeyoMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, keeyoMessage]);
    } catch (error) {
      console.error("Keeyo error:", error);
      const errorMessage: Message = {
        id: 'error',
        role: 'assistant',
        content: "Arey yaar... lagta hai mera dimaag thoda ghum gaya hai. 🤯 Ek baar phir se try karein?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Arey bhai! Welcome back! Chalo, phir se shuru karte hain. Kya sunoge? "Joke suna" bolo!',
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Keeyo</h1>
            <p className="text-xs opacity-80 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Main online hu bhai!
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} className="text-primary-foreground hover:bg-white/10 rounded-full h-10 w-10">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages area */}
      <div className="flex-1 relative overflow-hidden bg-background">
        <ScrollArea ref={scrollRef} className="h-full px-4 py-6">
          <div className="space-y-6 max-w-xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border/50 bg-card shrink-0">
        <form onSubmit={handleSend} className="max-w-xl mx-auto flex items-center gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'joke suna'..."
            className="flex-1 rounded-full h-12 px-6 border-border focus:ring-primary shadow-sm bg-background"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="rounded-full h-12 w-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-60">
          Keeyo treats everyone with respect. Clean jokes only! 🧡
        </p>
      </div>
    </div>
  );
}