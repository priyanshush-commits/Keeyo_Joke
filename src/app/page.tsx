import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 md:p-4 lg:p-8 bg-background">
      <div className="w-full max-w-2xl flex-1 flex flex-col h-full bg-card shadow-lg rounded-none md:rounded-2xl overflow-hidden border-border/50 border">
        <ChatInterface />
      </div>
    </main>
  );
}