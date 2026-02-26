"use client";

import React, { useState, useEffect } from 'react';
import { User, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from './chat-interface';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isKeeyo = message.role === 'assistant';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processContent = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} className="tone-marker">{part}</span>;
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className={cn(
      "flex w-full items-start gap-4 group animate-in fade-in duration-1000 slide-in-from-bottom-4",
      isKeeyo ? "flex-row" : "flex-row-reverse"
    )}>
      {/* Avatar with Futuristic Frame */}
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg border relative group-hover:scale-110 transition-transform",
        isKeeyo ? "keeyo-gradient text-white border-white/10" : "bg-white/5 text-muted-foreground border-white/10"
      )}>
        {isKeeyo ? <Cpu className="w-6 h-6" /> : <User className="w-6 h-6" />}
        {isKeeyo && <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-20 pointer-events-none" />}
      </div>

      {/* Bubble Container */}
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isKeeyo ? "items-start" : "items-end"
      )}>
        {/* Name Tag with Technical Style */}
        <span className={cn(
          "text-[9px] font-black uppercase tracking-[0.3em] mb-1.5 mx-1 opacity-50",
          isKeeyo ? "text-primary" : "text-white"
        )}>
          {isKeeyo ? "AI_NODE_KEEYO" : "USER_STREAM"}
        </span>

        {/* Bubble with Glassmorphism */}
        <div className={cn(
          "px-6 py-4 shadow-2xl text-[14px] leading-relaxed relative",
          isKeeyo ? "chat-bubble-keeyo" : "chat-bubble-user"
        )}>
          {/* Subtle Scanline Effect for Keeyo */}
          {isKeeyo && <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] rounded-[inherit] bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.5)_50%)] bg-[length:100%_4px]" />}
          
          <div className="relative z-10">
            {processContent(message.content)}
          </div>
        </div>
        
        {/* Technical Timestamp */}
        <span className="text-[9px] font-mono text-muted-foreground/40 mt-2 opacity-0 group-hover:opacity-100 transition-opacity px-1 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          {mounted ? message.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "00:00:00"}
        </span>
      </div>
    </div>
  );
}