import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Star, 
  Trash2, 
  Reply, 
  Sparkles, 
  Video, 
  Calendar, 
  Search, 
  Plus, 
  Paperclip, 
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { EmailMessage } from '../types';

interface GoogleMailViewProps {
  emails: EmailMessage[];
  onSendEmail: (newEmail: Omit<EmailMessage, 'id' | 'date'>) => void;
  onLaunchMeetingWithAttendee: (name: string, email: string, title: string) => void;
  onOpenAiChat: () => void;
}

export const GoogleMailView: React.FC<GoogleMailViewProps> = ({
  emails,
  onSendEmail,
  onLaunchMeetingWithAttendee,
  onOpenAiChat
}) => {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'starred'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0] || null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchMail, setSearchMail] = useState('');

  // Compose State
  const [toEmail, setToEmail] = useState('');
  const [toName, setToName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAiEmail, setIsGeneratingAiEmail] = useState(false);

  const filteredEmails = emails.filter(e => {
    if (selectedFolder === 'starred' && !e.isStarred) return false;
    if (selectedFolder === 'sent' && e.folder !== 'sent') return false;
    if (selectedFolder === 'inbox' && e.folder !== 'inbox') return false;
    if (searchMail && !e.subject.toLowerCase().includes(searchMail.toLowerCase()) && !e.from.name.toLowerCase().includes(searchMail.toLowerCase())) return false;
    return true;
  });

  const handleGenerateAiEmail = async () => {
    if (!subject && !aiPrompt) return;
    setIsGeneratingAiEmail(true);
    try {
      const res = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'compose_email',
          payload: {
            recipientName: toName || 'Enterprise Partner',
            recipientEmail: toEmail,
            company: 'Prospective Client',
            objective: subject || aiPrompt,
            keyPoints: aiPrompt || 'Follow up on previous proposal, outline next milestones, propose Google Meet call.',
            tone: 'Professional, consultative & persuasive'
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        setBody(data.result);
      }
    } catch (err) {
      console.error('Failed to generate AI email', err);
    } finally {
      setIsGeneratingAiEmail(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail || !subject) return;

    onSendEmail({
      threadId: `th-${Date.now()}`,
      from: { name: 'Alex Rivera', email: 'alex.r@omnicrm.enterprise' },
      to: { name: toName || toEmail, email: toEmail },
      subject,
      snippet: body.slice(0, 80) + '...',
      body,
      isRead: true,
      isStarred: false,
      folder: 'sent',
      labels: ['Sent from OmniCRM']
    });

    setIsComposing(false);
    setToEmail('');
    setToName('');
    setSubject('');
    setBody('');
    setAiPrompt('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden space-y-4">
      {/* Top Banner with Google Workspace Badge */}
      <div className="flex items-center justify-between shrink-0 bg-white p-3.5 px-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <span>Google Mail (Gmail Workspace)</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Connected: alex.r@omnicrm.enterprise
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Native synchronization with enterprise contacts, deals, and automated Gemini email drafting.
            </div>
          </div>
        </div>

        <button
          id="gmail-compose-btn"
          onClick={() => setIsComposing(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Email</span>
        </button>
      </div>

      {/* Main Mail Client Layout: Left Folders & List, Right Detail */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex shadow-xs min-h-0">
        {/* Column 1: Folder Navigation */}
        <div className="w-48 border-r border-slate-200 p-3 space-y-1 bg-slate-50/70 shrink-0">
          <button
            onClick={() => setSelectedFolder('inbox')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFolder === 'inbox' ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
              {emails.filter(e => e.folder === 'inbox' && !e.isRead).length}
            </span>
          </button>

          <button
            onClick={() => setSelectedFolder('starred')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFolder === 'starred' ? 'bg-amber-50 text-amber-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Starred</span>
          </button>

          <button
            onClick={() => setSelectedFolder('sent')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFolder === 'sent' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent</span>
          </button>
        </div>

        {/* Column 2: Thread List */}
        <div className="w-80 border-r border-slate-200 flex flex-col shrink-0">
          {/* Search inside mail */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mail..."
                value={searchMail}
                onChange={(e) => setSearchMail(e.target.value)}
                className="w-full pl-7 pr-3 py-1 bg-slate-100 border-none rounded-lg text-xs focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-3 cursor-pointer transition-all ${
                    isSelected ? 'bg-red-50/60 border-l-3 border-red-500' : 'hover:bg-slate-50'
                  } ${!email.isRead ? 'font-semibold' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {email.from.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {email.date.split(' ')[1] || email.date}
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 truncate mt-0.5">{email.subject}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{email.snippet}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Email Reading & Smart Reply Pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-200 bg-white flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedEmail.subject}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-slate-600">
                    <span className="font-semibold text-slate-900">{selectedEmail.from.name}</span>
                    <span>&lt;{selectedEmail.from.email}&gt;</span>
                    <span className="text-slate-400">• {selectedEmail.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onLaunchMeetingWithAttendee(selectedEmail.from.name, selectedEmail.from.email, `Follow-up: ${selectedEmail.subject}`)}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    title="Launch Google Meet with this contact"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Meet</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto bg-white text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                {selectedEmail.body}
              </div>

              {/* Bottom Smart Action Bar */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setIsComposing(true);
                      setToEmail(selectedEmail.from.email);
                      setToName(selectedEmail.from.name);
                      setSubject(`Re: ${selectedEmail.subject.replace(/^Re:\s*/, '')}`);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply with Gemini</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Gemini AI Smart Response Enabled</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium">
              Select an email from the list to read
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">New Message (Google Mail)</h3>
              </div>
              <button onClick={() => setIsComposing(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            {/* AI Assistant Quick Draft Box */}
            <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gemini AI Auto-Composer</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Describe objective (e.g. 'Draft closing proposal follow-up offering 5% discount for Friday sign-off')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiEmail}
                  disabled={isGeneratingAiEmail}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAiEmail ? 'Drafting...' : 'Generate'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="email"
                  placeholder="Recipient Email *"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <input
                type="text"
                placeholder="Subject Line *"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
              />

              <textarea
                rows={8}
                placeholder="Write your email body..."
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Gmail</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
