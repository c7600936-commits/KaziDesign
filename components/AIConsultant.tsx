
import React, { useState, useRef, useEffect } from 'react';
import { generateWorkflowAdvice } from '../services/geminiService';
import { ChatMessage, UserRole } from '../types';

interface AIConsultantProps {
  currentStageTitle: string;
  userRole: UserRole;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ currentStageTitle, userRole }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const promptContext = userRole === UserRole.CLIENT 
      ? `As a client assistant for this interior project, help the user understand the ${currentStageTitle} phase.`
      : `As a professional design consultant, provide technical and logistical advice for the ${currentStageTitle} phase.`;

    const aiResponse = await generateWorkflowAdvice(`${currentStageTitle} (${userRole} Perspective)`, userMessage + " " + promptContext);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse || "Sorry, I'm having trouble thinking right now." }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-xl border border-slate-800">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900">
          <i className="fas fa-robot"></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Kazi AI Consultant</h3>
          <p className="text-slate-400 text-xs">
            {userRole === UserRole.CLIENT ? "Client Support" : "Professional Advisor"}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-slate-500 text-sm leading-relaxed">
              {userRole === UserRole.CLIENT 
                ? `Have questions about the ${currentStageTitle} phase? Ask me anything about how we're transforming your space!`
                : `Professional advice for ${currentStageTitle}. E.g., "Review NCA regulations for Nairobi fit-outs."`
              }
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-amber-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none p-3 border border-slate-700">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-900 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-500"
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default AIConsultant;
