import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BrainCircuit, 
  User, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  ChevronDown, 
  Copy, 
  Check, 
  Zap,
  TrendingUp,
  Receipt,
  Mail
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, RolePersona } from '../types';

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  crmContext?: any;
}

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  crmContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello Alex! I am your **OmniCRM & ERP AI Copilot** powered by Gemini. 

I have real-time access to your deals pipeline, accounts receivable, Google Mail, Google Meet schedules, and Google Maps territory data. 

How can I assist your enterprise revenue operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.5-flash'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<RolePersona>('assistant');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts: { label: string; text: string; persona: RolePersona }[] = [
    { label: 'Pipeline Win Tactics', text: 'Analyze our active enterprise deals and provide 3 immediate tactics to accelerate the Apex Tech and Hyperion deals before Friday.', persona: 'cro' },
    { label: 'Draft Follow-Up Email', text: 'Draft an executive closing email to Sarah Jenkins at Apex Tech confirming our 3-year price lock in exchange for signature this week.', persona: 'copywriter' },
    { label: 'Audit Overdue Invoices', text: 'Analyze our accounts receivable status, highlight the overdue Vanguard Logistics invoice, and recommend a collection protocol.', persona: 'auditor' },
    { label: 'Google Meet Prep', text: 'Prepare an executive talking points brief for today\'s Google Meet with Hyperion Manufacturing comparing our TCO to SAP.', persona: 'assistant' }
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
        content: data.reply || 'I processed the query, but no response was returned.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.modelUsed || selectedModel
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Failed to send chat message:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Error: Unable to connect to Gemini API. ${err.message || 'Please check your connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: `Chat history cleared. How can I assist you with your CRM deals, Google Workspace, or ERP billing?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-900 text-white shadow-2xl z-50 flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center shadow-sm">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center space-x-2">
              <span>OmniCRM AI Copilot</span>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Gemini Active
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Multi-Model Enterprise Intelligence</div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={clearChat}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close Drawer"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Persona & Model Selection Bar */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 grid grid-cols-2 gap-2 text-xs shrink-0">
        {/* Persona Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">AI Advisor Role</label>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value as RolePersona)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="assistant">🤖 General CRM Copilot</option>
            <option value="cro">📈 Chief Revenue Officer (CRO)</option>
            <option value="copywriter">✍️ Executive Copywriter</option>
            <option value="auditor">📊 ERP Financial Auditor</option>
          </select>
        </div>

        {/* Model Selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Gemini Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="gemini-3.5-flash">⚡ gemini-3.5-flash (General)</option>
            <option value="gemini-3.1-pro-preview">🧠 gemini-3.1-pro-preview (High Thinking)</option>
            <option value="gemini-3.1-flash-lite">🚀 gemini-3.1-flash-lite (Fast)</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isModel
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-xs'
                    : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {/* Message Body using React-Markdown */}
                <div className="markdown-body prose prose-invert prose-xs max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>

                {/* Footer with Timestamp & Copy */}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/50 text-[10px] text-slate-400">
                  <span>{msg.timestamp} {msg.model ? `• ${msg.model}` : ''}</span>
                  {isModel && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="hover:text-white flex items-center space-x-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isModel && (
                <div className="w-7 h-7 rounded-lg bg-indigo-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2 text-indigo-400 text-xs p-2 bg-slate-800/60 rounded-xl w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Gemini is analyzing enterprise context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex space-x-1.5 min-w-max">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPersona(p.persona);
                handleSendMessage(p.text);
              }}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 hover:border-indigo-500 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-medium transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Composer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder={`Ask ${selectedPersona.toUpperCase()} Advisor...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
