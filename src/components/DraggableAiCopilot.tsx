import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  BrainCircuit, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Move, 
  MessageSquare,
  Zap,
  TrendingUp,
  Receipt,
  Mail,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, RolePersona } from '../types';

interface DraggableAiCopilotProps {
  crmContext?: any;
  onOpenHighThinking?: () => void;
}

export const DraggableAiCopilot: React.FC<DraggableAiCopilotProps> = ({
  crmContext,
  onOpenHighThinking
}) => {
  // Chat window state
  const [isOpen, setIsOpen] = useState(false);
  const [isTucked, setIsTucked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Position state (safely clamped within viewport margins)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 1000, y: 700 });

  // Initialize position on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({
        x: Math.max(16, window.innerWidth - 86),
        y: Math.max(70, window.innerHeight - 86)
      });
    }
  }, []);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0
  });
  const hasMovedRef = useRef<boolean>(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I am your **Navastra ERP AI Copilot** powered by Gemini. 
      
Ask me about pipeline acceleration, drafting client proposals, cross-module inventory & sales insights, or financial forecasts. How can I assist you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.5-flash'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<RolePersona>('assistant');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Adjust coordinates on window resize to stay within bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.max(16, Math.min(prev.x, window.innerWidth - 86)),
        y: Math.max(70, Math.min(prev.y, window.innerHeight - 86))
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, a, select')) {
      return;
    }
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }

    const maxX = Math.max(16, window.innerWidth - 86);
    const maxY = Math.max(70, window.innerHeight - 86);
    const newX = Math.max(16, Math.min(maxX, dragStartRef.current.posX + dx));
    const newY = Math.max(70, Math.min(maxY, dragStartRef.current.posY + dy));

    setPosition({ x: newX, y: newY });

    // If dragged right up against the right edge (within 10px of maxX), auto-tuck
    if (newX >= maxX - 5) {
      setIsTucked(true);
    } else {
      setIsTucked(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Touch drag handlers for mobile/tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input, textarea, a, select')) {
      return;
    }
    const touch = e.touches[0];
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.startX;
    const dy = touch.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }

    const maxX = Math.max(16, window.innerWidth - 86);
    const maxY = Math.max(70, window.innerHeight - 86);
    const newX = Math.max(16, Math.min(maxX, dragStartRef.current.posX + dx));
    const newY = Math.max(70, Math.min(maxY, dragStartRef.current.posY + dy));

    setPosition({ x: newX, y: newY });
    if (newX >= maxX - 5) {
      setIsTucked(true);
    } else {
      setIsTucked(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleBubbleClick = () => {
    if (!hasMovedRef.current) {
      setIsOpen(prev => !prev);
      setIsTucked(false);
    }
  };

  const quickPrompts = [
    { label: 'Pipeline Acceleration', text: 'Analyze our active enterprise deals and recommend 3 tactical steps to close Apex Tech and Hyperion this month.' },
    { label: 'Draft Client Email', text: 'Draft an executive follow-up email confirming our proposal terms with a 5% early closing concession.' },
    { label: 'Accounts Receivable', text: 'Review our pending and overdue invoices and summarize cash collection priority.' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          rolePersona: selectedPersona,
          model: selectedModel,
          contextData: crmContext
        })
      });

      const data = await res.json();
      const modelMessage: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I analyzed your request, but received an empty response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel
      };

      setMessages([...newHistory, modelMessage]);
    } catch (err: any) {
      setMessages([
        ...newHistory,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: 'Unable to reach Gemini Copilot service. Please verify your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 
        Tucked State Arrow Handle on the Right Screen Edge
        When user tucks the copilot out of screen, this small arrow protrudes on the edge.
      */}
      {isTucked && !isOpen && (
        <div 
          style={{ top: `${Math.max(100, Math.min(window.innerHeight - 80, position.y))}px` }}
          className="fixed right-0 z-50 transform -translate-y-1/2 animate-in slide-in-from-right duration-200"
        >
          <button
            onClick={() => {
              setIsTucked(false);
              setPosition(prev => ({ ...prev, x: window.innerWidth - 90 }));
            }}
            className="flex items-center space-x-1 pl-2.5 pr-1.5 py-3 bg-[#1c2237] hover:bg-[#28304c] text-white rounded-l-2xl shadow-2xl border-y border-l border-emerald-500/40 group transition-all"
            title="Open AI Copilot (Tucked to edge)"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
            <div className="flex flex-col items-center">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-extrabold text-slate-300 tracking-tighter uppercase mt-0.5 writing-mode-vertical">
                AI
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 
        Draggable Chat Bot Floating Bubble 
      */}
      {!isTucked && (
        <div
          id="navastra-ai-copilot-bubble"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            touchAction: 'none'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`fixed z-50 select-none ${
            isDragging ? 'cursor-grabbing scale-105 opacity-95' : 'cursor-grab'
          } transition-transform duration-75`}
        >
          <div className="relative group p-1">
            {/* Small Drag Handle Indicator */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#151a2d] border border-slate-700/80 text-emerald-400 rounded-full px-2 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 shadow-md pointer-events-none whitespace-nowrap">
              <Move className="w-2.5 h-2.5" />
              <span>DRAG</span>
            </div>

            {/* Quick Tuck / Minimize to Edge Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsTucked(true);
                setIsOpen(false);
              }}
              className="absolute top-0 right-0 w-5 h-5 bg-[#1e263d] hover:bg-[#2c3758] text-slate-300 rounded-full border border-slate-600/90 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all z-20 shadow-md"
              title="Tuck to right edge"
            >
              <ChevronRight className="w-3 h-3 text-slate-200" />
            </button>

            {/* Main AI Bubble Icon Button */}
            <button
              type="button"
              onClick={handleBubbleClick}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 border relative ${
                isOpen
                  ? 'bg-[#151a2d] text-white border-emerald-500 ring-4 ring-emerald-500/20'
                  : 'bg-gradient-to-br from-[#1c2237] to-[#111624] hover:from-[#242c47] hover:to-[#171c2f] text-white border-[#313c60] hover:border-emerald-400/60 hover:shadow-emerald-950/40'
              }`}
              title="Click to toggle AI Copilot · Drag to reposition"
            >
              {/* Pulsing AI Glow badge */}
              <span className="absolute 1 top-1 right-1 flex h-3 w-3 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#1c2237]"></span>
              </span>

              {isOpen ? (
                <X className="w-6 h-6 text-emerald-400" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-0.5">
                  <Bot className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-extrabold tracking-wider text-slate-300">COPILOT</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 
        Interactive Chat Window (Positioned relative to viewport or docked nicely)
      */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-6 w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-[#1c2237] px-4 py-3.5 text-white flex items-center justify-between border-b border-[#2a3453] shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs text-white truncate">AI Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    GEMINI
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Enterprise Revenue Intelligence</div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {onOpenHighThinking && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenHighThinking();
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Open High Thinking Studio"
                >
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model & Persona Selection Bar */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-500 font-semibold">Persona:</span>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value as RolePersona)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-semibold text-slate-700 focus:outline-none"
              >
                <option value="assistant">AI Copilot</option>
                <option value="cro">Executive CRO</option>
                <option value="copywriter">Deal Negotiator</option>
                <option value="auditor">ERP Auditor</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setMessages([messages[0]])}
              className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center space-x-1"
              title="Reset Chat"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      isUser
                        ? 'bg-[#1c2237] text-white rounded-br-xs'
                        : 'bg-[#f4f3ed] text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="markdown-body prose prose-xs max-w-none text-slate-800">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-500 w-36 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                <span className="text-xs font-semibold">Analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.text)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-[10px] font-semibold transition-colors shrink-0 shadow-2xs"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Copilot about deals, revenue, emails..."
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-full bg-[#1c2237] hover:bg-[#28304c] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
