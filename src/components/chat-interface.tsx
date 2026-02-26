"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Sparkles, RefreshCw, Volume2, VolumeX, Terminal, Zap } from 'lucide-react';
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
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '[SYSTEM INITIALIZED]\nNamaste User. I am Keeyo, your Cyber-Hindi Comedy Core. 🤖✨\nRequesting "joke suna" for mood optimization! Phir system refresh ho jayega. 😂',
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
          responseContent = "Dopamine levels stabilized! 😂 [laughing softly] System optimization complete. Ek aur dose chahiye?";
          break;
        default:
          responseContent = "Decoding failure... 😂 [laughing softly] Let's fallback to primary humor protocol.";
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
        content: "CRITICAL SYSTEM ERROR: Humour drive disconnected. 🤯 Rebooting process...",
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
      content: 'System hard reset complete. 🔄 Humor protocols online. "Joke suna" command expected.',
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
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      {/* Holographic Overlays */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm animate-pulse" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 shrink-0 z-10 backdrop-blur-xl bg-black/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl keeyo-gradient flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.3)] transform transition-transform hover:scale-105">
              <Cpu className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-background shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tighter text-white neon-glow">KEEYO v2.0</h1>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/70">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              HUMOR_PROTOCOL_ACTIVE
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="rounded-xl h-11 w-11 hover:bg-white/5 text-muted-foreground hover:text-primary transition-all">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={clearChat} className="rounded-xl h-11 w-11 hover:bg-white/5 text-muted-foreground hover:text-accent transition-all">
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 relative overflow-hidden">
        <ScrollArea ref={scrollRef} className="h-full px-6 py-8">
          <div className="space-y-10 max-w-2xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in duration-700">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Terminal className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-primary/60 uppercase">Processing...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="p-8 border-t border-white/5 bg-black/20 backdrop-blur-3xl shrink-0">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 group">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Execute command: 'joke suna'..."
              className="flex-1 rounded-xl h-16 px-6 border-white/10 focus:ring-1 focus:ring-primary/40 shadow-inner bg-white/5 text-white placeholder:text-muted-foreground/40 transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="rounded-xl h-16 w-16 shrink-0 keeyo-gradient text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale"
          >
            <Send className="w-7 h-7" />
          </Button>
        </form>
        <div className="flex justify-center mt-6 gap-3 overflow-x-auto no-scrollbar py-1">
          {['Joke suna', 'Kuch achha sunao', 'Mood kharab hai'].map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => { setInput(hint); }}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-primary hover:bg-primary/10 px-4 py-2 rounded-lg border border-white/5 transition-all whitespace-nowrap backdrop-blur-sm"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}