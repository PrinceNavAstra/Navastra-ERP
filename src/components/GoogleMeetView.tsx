import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  BrainCircuit, 
  FileText,
  Play
} from 'lucide-react';
import { GoogleMeeting } from '../types';

interface GoogleMeetViewProps {
  meetings: GoogleMeeting[];
  onScheduleMeeting: (meeting: Omit<GoogleMeeting, 'id' | 'status'>) => void;
  onOpenAiChat: () => void;
}

export const GoogleMeetView: React.FC<GoogleMeetViewProps> = ({
  meetings,
  onScheduleMeeting,
  onOpenAiChat
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<GoogleMeeting | null>(meetings[0] || null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const [date, setDate] = useState('2026-08-26');
  const [time, setTime] = useState('11:00 AM PST');
  const [duration, setDuration] = useState(45);
  const [agenda, setAgenda] = useState('');
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false);

  // Notes scratchpad state
  const [meetingNotes, setMeetingNotes] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizingNotes, setIsSummarizingNotes] = useState(false);

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateAiAgenda = async () => {
    if (!title) return;
    setIsGeneratingAgenda(true);
    try {
      const res = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'meeting_prep',
          payload: {
            title,
            clientName: attendees || 'Enterprise Client Stakeholders',
            company: 'Enterprise Account',
            attendees: attendees.split(',').map(s => s.trim()),
            dealNotes: 'Enterprise CRM evaluation and cloud platform architecture'
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        setAgenda(data.result);
      }
    } catch (err) {
      console.error('Failed to generate AI agenda', err);
    } finally {
      setIsGeneratingAgenda(false);
    }
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const randomRoom = `omni-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    
    onScheduleMeeting({
      title,
      hostName: 'Alex Rivera',
      hostEmail: 'alex.r@omnicrm.enterprise',
      attendees: attendees.split(',').map(a => a.trim()).filter(Boolean),
      scheduledDate: date,
      scheduledTime: time,
      durationMinutes: Number(duration),
      meetUrl: `https://meet.google.com/${randomRoom}`,
      meetingCode: randomRoom,
      agenda: agenda || 'Enterprise strategy alignment',
      aiTalkingPoints: [
        'Demonstrate ROI telemetry and automated pipeline forecasting.',
        'Review custom integration architecture.',
        'Propose Q3 closing terms and executive sign-off timeline.'
      ]
    });

    setIsScheduling(false);
    setTitle('');
    setAttendees('');
    setAgenda('');
  };

  const handleSummarizeScratchpad = async () => {
    if (!meetingNotes) return;
    setIsSummarizingNotes(true);
    try {
      const res = await fetch('/api/ai/fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick_summary',
          payload: {
            data: { notes: meetingNotes, meetingTitle: selectedMeeting?.title },
            prompt: 'Summarize the key decisions made in this Google Meet, list all action items with owners, and draft an immediate follow-up email.'
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        setAiSummary(data.result);
      }
    } catch (err) {
      console.error('Failed to summarize notes', err);
    } finally {
      setIsSummarizingNotes(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden space-y-4">
      {/* Top Banner & Quick Meeting Starter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Google Meet Enterprise Studio</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                HD Audio & Video
              </span>
            </div>
            <div className="text-xs text-slate-500">
              One-click instant Google Meet video conferences, automated Gemini agendas, and executive briefing prep.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href="https://meet.google.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Instant Google Meet</span>
          </a>

          <button
            id="meet-schedule-modal-btn"
            onClick={() => setIsScheduling(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule CRM Video Call</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Scheduled Calls, Right AI Preparation & Scratchpad */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Left Col: Scheduled Meetings List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Scheduled Google Meets ({meetings.length})</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {meetings.map((meet) => {
              const isSelected = selectedMeeting?.id === meet.id;
              return (
                <div
                  key={meet.id}
                  onClick={() => setSelectedMeeting(meet)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{meet.title}</h4>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                      {meet.scheduledTime}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
                    <span>{meet.scheduledDate}</span>
                    <span>•</span>
                    <span>{meet.durationMinutes} mins</span>
                  </div>

                  <div className="text-[11px] text-slate-600 mt-2 truncate">
                    Attendees: {meet.attendees.join(', ')}
                  </div>

                  {/* Actions inside card */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={meet.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Call</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleCopy(meet.meetUrl, meet.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCode === meet.id ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Meeting Dossier, AI Talking Points & Live Notepad */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          {selectedMeeting ? (
            <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-5">
              {/* Header */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedMeeting.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Host: {selectedMeeting.hostName} ({selectedMeeting.hostEmail})
                    </p>
                  </div>
                  <a
                    href={selectedMeeting.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Google Meet Room</span>
                  </a>
                </div>
              </div>

              {/* Gemini AI Talking Points */}
              <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  <span>Gemini AI Executive Talking Points & Strategy</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {selectedMeeting.aiTalkingPoints?.map((tp, idx) => (
                    <li key={idx} className="leading-relaxed">{tp}</li>
                  ))}
                </ul>
              </div>

              {/* Agenda */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Meeting Agenda</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedMeeting.agenda}
                </div>
              </div>

              {/* Live Meeting Notes & AI Summarizer */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Call Notes & Action Items</span>
                  <button
                    onClick={handleSummarizeScratchpad}
                    disabled={isSummarizingNotes || !meetingNotes}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isSummarizingNotes ? 'Summarizing...' : 'AI Wrap-Up & Email Draft'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  placeholder="Take notes during the Google Meet call (e.g. key objections, feature requests, committed deadlines)..."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />

                {aiSummary && (
                  <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 whitespace-pre-line leading-relaxed space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Gemini Call Summary & Next Steps:</span>
                    </div>
                    <div>{aiSummary}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium">
              Select a meeting from the list to view agenda and AI preparation
            </div>
          )}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduling && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Schedule Google Meet</h3>
              </div>
              <button onClick={() => setIsScheduling(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tech Architecture Review & Final Signoff"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attendees (comma separated emails)</label>
                <input
                  type="text"
                  placeholder="sarah.j@apextech.io, cto@client.com"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM PST"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                </div>
              </div>

              {/* AI Auto-Agenda */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Agenda & Talking Points</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiAgenda}
                    disabled={isGeneratingAgenda || !title}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingAgenda ? 'Generating...' : 'AI Auto-Draft Agenda'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Outline meeting goals and agenda..."
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-sans"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduling(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Create Google Meet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
