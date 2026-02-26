"use client";

import React, { useState, useEffect } from 'react';
import { User, Bot } from 'lucide-react';
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

  // Helper to process content and wrap tone markers in specific styling
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
      "flex w-full items-start gap-4 group animate-in fade-in duration-500 slide-in-from-bottom-2",
      isKeeyo ? "flex-row" : "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transform transition-all group-hover:scale-110",
        isKeeyo ? "keeyo-gradient text-white border-transparent" : "bg-muted text-muted-foreground border-border/50"
      )}>
        {isKeeyo ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Bubble Container */}
      <div className={cn(
        "flex flex-col max-w-[80%]",
        isKeeyo ? "items-start" : "items-end"
      )}>
        {/* Name Tag (Optional, but adds personality) */}
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest mb-1 mx-1 opacity-40",
          isKeeyo ? "text-primary" : "text-muted-foreground"
        )}>
          {isKeeyo ? "Keeyo" : "Tum"}
        </span>

        {/* Bubble */}
        <div className={cn(
          "px-5 py-4 shadow-sm text-[15px] leading-relaxed relative",
          isKeeyo ? "chat-bubble-keeyo" : "chat-bubble-user"
        )}>
          {processContent(message.content)}
        </div>
        
        {/* Timestamp/Meta */}
        <span className="text-[10px] font-medium text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity px-1">
          {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null}
        </span>
      </div>
    </div>
  );
}