import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 md:p-6 bg-[#fdf8f4]">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-card shadow-2xl rounded-none md:rounded-[2rem] overflow-hidden border-border/40 border">
        <ChatInterface />
      </div>
    </main>
  );
}