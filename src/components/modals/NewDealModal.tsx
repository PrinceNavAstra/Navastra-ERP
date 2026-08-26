import React, { useState } from 'react';
import { Kanban, Sparkles, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Deal, DealStage, Priority } from '../../types';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({
  isOpen,
  onClose,
  onCreateDeal
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [value, setValue] = useState(75000);
  const [stage, setStage] = useState<DealStage>('qualified');
  const [probability, setProbability] = useState(50);
  const [priority, setPriority] = useState<Priority>('high');
  const [expectedCloseDate, setExpectedCloseDate] = useState('2026-09-30');
  const [notes, setNotes] = useState('');
  const [isScoringAi, setIsScoringAi] = useState(false);
  const [aiScore, setAiScore] = useState<number | undefined>(75);
  const [aiAnalysis, setAiAnalysis] = useState<string | undefined>('');

  if (!isOpen) return null;

  const handleRunAiScore = async () => {
    if (!title || !company) return;
    setIsScoringAi(true);
    try {
      const res = await fetch('/api/ai/fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead_score',
          payload: {
            lead: { title, company, value, stage, notes }
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        try {
          const parsed = JSON.parse(data.result);
          setAiScore(parsed.score || 80);
          setAiAnalysis(parsed.insights || 'Strong opportunity fit.');
        } catch {
          setAiScore(85);
          setAiAnalysis('High probability deal with solid enterprise engagement.');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScoringAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;

    onCreateDeal({
      title,
      company,
      contactName: contactName || 'Primary Stakeholder',
      contactEmail: contactEmail || 'contact@client.com',
      value: Number(value),
      stage,
      probability: Number(probability),
      priority,
      expectedCloseDate,
      notes,
      tags: ['Enterprise', company],
      assignedTo: 'Alex Rivera',
      aiScore: aiScore || 80,
      aiAnalysis: aiAnalysis || 'New deal created in OmniCRM pipeline.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Create New Enterprise Deal</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Omnichannel Cloud ERP Rollout Tier 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Account *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Technologies Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deal Value ($ USD) *</label>
              <input
                type="number"
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                placeholder="Sarah Jenkins"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="sarah.j@apextech.io"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="lead_in">Lead In</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Win Prob. (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expected Close Date</label>
            <input
              type="date"
              value={expectedCloseDate}
              onChange={(e) => setExpectedCloseDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Deal Strategy & Notes</label>
              <button
                type="button"
                onClick={handleRunAiScore}
                disabled={isScoringAi || !title}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isScoringAi ? 'Calculating AI Score...' : 'AI Win Predictor'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Outline stakeholder requirements and contract scope..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {aiAnalysis && (
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-950 text-xs">
              <strong>Gemini AI Score ({aiScore}/100):</strong> {aiAnalysis}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
            >
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
