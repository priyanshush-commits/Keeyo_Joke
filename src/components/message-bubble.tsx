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
      "flex w-full items-start gap-3 group animate-in fade-in duration-300",
      isKeeyo ? "flex-row" : "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
        isKeeyo ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {isKeeyo ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isKeeyo ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "px-4 py-3 shadow-sm text-[15px] leading-relaxed",
          isKeeyo ? "chat-bubble-keeyo" : "chat-bubble-user"
        )}>
          {processContent(message.content)}
        </div>
        
        {/* Timestamp/Meta */}
        <span className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
          {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null}
        </span>
      </div>
    </div>
  );
}
