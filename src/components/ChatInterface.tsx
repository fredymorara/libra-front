'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  readonly isEmbedded?: boolean;
}

export default function ChatInterface({ isEmbedded = false }: ChatInterfaceProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string, role: string, content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent<Element>) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const urlParams = new URLSearchParams(globalThis.location.search);
      const urlToken = urlParams.get('token');
      const token = urlToken || localStorage.getItem('token');
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/rag/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      const botMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
      setMessages(prev => [...prev, botMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          botMessage.content += chunk;
          setMessages(prev => [...prev.slice(0, -1), { ...botMessage }]);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'Network connection failed.');
      } else {
        setErrorMsg('Network connection failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full w-full bg-canvas relative overflow-hidden font-sans ${isEmbedded ? '' : 'rounded-2xl border border-stone-200 shadow-xl'}`}>
      
      {/* Header */}
      {!isEmbedded && (
        <div className="shrink-0 h-[60px] bg-canvas-muted border-b border-stone-200 flex items-center px-6 justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 rounded-md bg-library-800 items-center justify-center text-white shadow-sm">
              <Bot size={16} />
            </div>
            <span className="font-semibold text-ink text-sm">Libra</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-ink-muted">Active</span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar relative">
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rust-700/10 text-rust-700 rounded-xl text-sm border border-rust-700/20 mx-auto max-w-2xl">
            <strong className="font-semibold flex items-center gap-2">
              <AlertCircle size={16} /> Connection Error:
            </strong> 
            <p className="mt-1">{errorMsg}</p>
          </motion.div>
        )}
        
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-5 px-4"
          >
            <div className="h-14 w-14 rounded-xl bg-canvas-muted shadow-sm flex items-center justify-center text-ink border border-stone-200">
              <Bot size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-ink tracking-tight">How can I help you?</h3>
              <p className="text-sm text-ink-muted max-w-sm leading-relaxed">
                Query the archive naturally. I can find specific items, summarize papers, or connect concepts across the catalog.
              </p>
            </div>
          </motion.div>
        )}

        <div className="max-w-3xl mx-auto space-y-8 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex gap-4 group ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-md shrink-0 flex items-center justify-center shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-white text-stone-400 border border-stone-200' 
                    : 'bg-library-800 text-white'
                }`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`rounded-xl px-5 py-3 text-[15px] leading-relaxed shadow-sm max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-ink text-white rounded-tr-sm font-medium'
                    : 'bg-white border border-stone-200 text-ink rounded-tl-sm'
                }`}>
                  {m.content ? (
                    m.role === 'assistant' ? (
                      <div className="prose prose-sm prose-stone max-w-none prose-p:leading-relaxed prose-pre:bg-stone-100 prose-pre:text-stone-800 prose-a:text-library-600 prose-a:no-underline hover:prose-a:underline">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 h-6 opacity-70">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                        className="w-1.5 h-1.5 bg-library-800 rounded-full" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-library-800 rounded-full" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-library-800 rounded-full" 
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messageEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-canvas-muted border-t border-stone-200 p-4 z-10">
        <form 
          onSubmit={sendMessage} 
          className="max-w-3xl mx-auto relative flex items-end bg-white border border-stone-200 shadow-sm rounded-xl focus-within:border-library-500 focus-within:ring-2 focus-within:ring-library-500/20 transition-all p-1.5 gap-2"
        >
          <textarea
            className="flex-1 bg-transparent px-3 py-2 text-[15px] text-ink focus:outline-none placeholder:text-stone-400 disabled:opacity-50 resize-none min-h-[40px] max-h-32 custom-scrollbar"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1}
            placeholder="Ask a question..."
            disabled={isLoading}
            autoFocus={!isEmbedded}
          />
          <div className="shrink-0 flex items-center justify-center p-0.5">
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 flex items-center justify-center rounded-lg bg-library-800 text-white hover:bg-library-900 disabled:bg-stone-100 disabled:text-stone-400 transition-colors shadow-sm disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} className={input.trim() ? 'translate-x-px' : ''} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
