"use client";

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function AiGuideChat({ entityName, idSuffix = 'primary' }) {
  const bottomRef = useRef(null);
  const [localInput, setLocalInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    id: `chat-${entityName}-${idSuffix}`,
    api: '/api/chat',
    initialMessages: [
      {
        id: 'system-1',
        role: 'system',
        content: `You are AstroAide, a supportive and encouraging AI. The user is currently looking at the ${entityName} page. Answer their questions only about ${entityName} and its related space theories. Ensure that you simplify difficult astrophysics jargon so that beginners can easily understand it.`,
      },
      {
        id: 'assistant-1',
        role: 'assistant',
        content: `Hello there! I'm AstroAide. You're currently exploring the mysteries of the ${entityName}. How can I help make this fascinating phenomenon easier to understand?`,
      }
    ]
  });

  const displayMessages = messages.filter(m => m.role !== 'system');

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!mounted) {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-2rem)] sticky top-4 bg-[#050214]/80 backdrop-blur-3xl border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-500/30 bg-[#0a041a] z-10 shrink-0">
          <div>
            <h3 className="font-bold text-white tracking-wide text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Space Guide AI
            </h3>
            <p className="text-[10px] text-indigo-400 font-mono tracking-widest mt-1 uppercase">Initializing Uplink...</p>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center bg-[#0a041a]/30">
           <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-2rem)] sticky top-4 bg-[#050214]/80 backdrop-blur-3xl border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-500/30 bg-[#0a041a] z-10 shrink-0 shadow-lg">
        <div>
          <h3 className="font-bold text-white tracking-wide text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Space Guide AI
          </h3>
          <p className="text-[10px] text-indigo-400 font-mono tracking-widest mt-1 uppercase">Local Connection Secured</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-gradient-to-b from-transparent to-[#0a041a]/30">
        {displayMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600/60 text-white rounded-tr-sm border border-indigo-500/50 shadow-md' 
                  : 'bg-cyan-950/30 text-cyan-50 rounded-tl-sm border border-cyan-500/30 shadow-md backdrop-blur-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in">
            <div className="bg-cyan-950/30 rounded-2xl rounded-tl-sm border border-cyan-500/30 px-5 py-5 flex items-center gap-2 shadow-md backdrop-blur-sm">
              <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest mr-2">Computing</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-[#0a041a]/90 backdrop-blur-md border-t border-indigo-500/30 shrink-0">
        <form onSubmit={(e) => { handleSubmit(e); setLocalInput(''); }} className="flex relative items-center">
          <input
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              if (handleInputChange) {
                handleInputChange(e);
              }
            }}
            placeholder={`Ask about ${entityName}...`}
            className="w-full bg-[#030014] border border-indigo-500/40 rounded-full py-4 pl-6 pr-16 text-sm text-white placeholder:text-indigo-400/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !localInput.trim()}
            className="absolute right-2 top-2 bottom-2 w-11 h-11 text-white bg-indigo-500/80 rounded-full flex items-center justify-center hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:hover:bg-indigo-500/80"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 211, 238, 0.6); }
      `}} />
    </div>
  );
}
