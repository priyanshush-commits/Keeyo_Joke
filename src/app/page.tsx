import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 md:p-6 bg-background relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-2xl h-[95vh] flex flex-col bg-card/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-none md:rounded-[2.5rem] overflow-hidden border-white/10 border z-10">
        <ChatInterface />
      </div>
    </main>
  );
}