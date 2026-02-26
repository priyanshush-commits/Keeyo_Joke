"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, RotateCcw, Volume2, VolumeX, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from '@/components/message-bubble';
import { detectJokeRequest } from '@/ai/flows/detect-joke-request';
import { tellHindiJoke } from '@/ai/flows/tell-hindi-joke-flow';
import { upliftSadUser } from '@/ai/flows/uplift-sad-user';
import { refuseDarkJoke } from '@/ai/flows/refuse-dark-joke';
import { generateHindiSpeech } from '@/ai/flows/tts-flow';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Prevent hydration mismatch by setting initial message on client mount
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Arey bhai! Kaise ho? Main hu Keeyo, tumhara funny Indian friend. 🇮🇳\nKoi mast sa joke sunna hai? Bas bolo "joke suna" aur dekho kamaal! 😂',
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const playAudio = (url: string) => {
    if (isMuted) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(url);
    audioRef.current.play().catch(err => console.error("Audio playback error:", err));
  };

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
          const jokeResult = await tellHindiJoke({});
          responseContent = jokeResult.joke;
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
          responseContent = fallbackJoke.joke;
          break;
      }

      let audioUrl = "";
      if (!isMuted) {
        try {
          const cleanText = responseContent.replace(/\[.*?\]/g, '').trim();
          const ttsResult = await generateHindiSpeech({ text: cleanText });
          audioUrl = ttsResult.audioDataUri;
          playAudio(audioUrl);
        } catch (ttsErr) {
          console.error("TTS generation failed:", ttsErr);
        }
      }

      const keeyoMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        audioUrl,
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
    if (audioRef.current) audioRef.current.pause();
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Arey bhai! Welcome back! Chalo, phir se shuru karte hain. Kya sunoge? "Joke suna" bolo!',
      timestamp: new Date(),
    }]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-card border-b border-border/40 shrink-0 z-10 backdrop-blur-sm bg-card/80">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl keeyo-gradient flex items-center justify-center shadow-lg shadow-orange-500/20 transform -rotate-3 transition-transform hover:rotate-0">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-card shadow-sm" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-foreground">Keeyo</h1>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Bhai hamesha online hai!
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="rounded-xl h-10 w-10 hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={clearChat} className="rounded-xl h-10 w-10 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full px-4 py-8">
          <div className="space-y-8 max-w-2xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center shrink-0 border border-border/50">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-card border border-border/60 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground ml-2 italic">Keeyo soch raha hai...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-border/40 bg-card/50 backdrop-blur-md shrink-0">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 group">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Arey bolo na, 'joke suna'..."
              className="flex-1 rounded-[1.25rem] h-14 px-6 border-border/60 focus:ring-2 focus:ring-primary/20 shadow-sm bg-background/80 transition-all group-hover:border-primary/40"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
              <Ghost className="w-5 h-5" />
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="rounded-[1.25rem] h-14 w-14 shrink-0 keeyo-gradient text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Send className="w-6 h-6" />
          </Button>
        </form>
        <div className="flex justify-center mt-4 gap-4 overflow-x-auto no-scrollbar py-1">
          {['Joke suna', 'Kuch achha sunao', 'Mood kharab hai'].map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => { setInput(hint); }}
              className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 hover:text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full border border-border/40 transition-all whitespace-nowrap"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}