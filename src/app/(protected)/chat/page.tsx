import ChatInterface from '@/components/ChatInterface';
import { motion } from 'motion/react';

export default function ChatSandboxPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">Testing Sandbox</h1>
        <p className="text-ink-muted text-sm leading-relaxed">
          Interact with Libra directly to evaluate search quality and metadata extraction before embedding the widget.
        </p>
      </div>
      
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
        <ChatInterface isEmbedded={true} />
      </div>
    </div>
  );
}
