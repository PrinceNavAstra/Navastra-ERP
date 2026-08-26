import React, { useState } from 'react';
import { 
  Kanban, 
  Building2, 
  User, 
  Mail, 
  Video, 
  MapPin, 
  Sparkles, 
  BrainCircuit, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Deal, DealStage, Priority } from '../../types';

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (dealId: string, stage: DealStage) => void;
  onUpdateNotes: (dealId: string, notes: string) => void;
  onComposeEmail: (email: string, name: string, dealId: string) => void;
  onLaunchMeeting: (name: string, email: string, title: string) => void;
  onLocateOnMap: (company: string) => void;
  onRunHighThinkingForDeal: (deal: Deal) => void;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  isOpen,
  onClose,
  onUpdateStage,
  onUpdateNotes,
  onComposeEmail,
  onLaunchMeeting,
  onLocateOnMap,
  onRunHighThinkingForDeal
}) => {
  if (!isOpen || !deal) return null;

  const [notes, setNotes] = useState(deal.notes);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState(deal.aiAnalysis);

  const handleStageChange = (newStage: DealStage) => {
    onUpdateStage(deal.id, newStage);
    if (newStage === 'closed_won') {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRunAiDiagnosis = async () => {
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deal_strategy',
          payload: { deal }
        })
      });
      const data = await res.json();
      if (data.result) {
        setAiDiagnosis(data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleSaveNotes = () => {
    onUpdateNotes(deal.id, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                deal.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                deal.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {deal.priority.toUpperCase()} PRIORITY
              </span>
              <span className="text-xs text-slate-400">• Expected: {deal.expectedCloseDate}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{deal.title}</h2>
            <p className="text-xs text-slate-600 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <strong>{deal.company}</strong>
              <span>• Contact: {deal.contactName} ({deal.contactEmail})</span>
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Deal Value</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">${deal.value.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Win Probability</span>
            <div className="text-lg font-bold text-indigo-600 mt-0.5">{deal.probability}%</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Current Stage</span>
            <div className="text-xs font-bold text-slate-800 mt-1 capitalize">
              {deal.stage.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Stage Mover Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline Stage Progression</label>
          <div className="flex flex-wrap gap-1.5">
            {(['lead_in', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'] as DealStage[]).map((stg) => {
              const isActive = deal.stage === stg;
              return (
                <button
                  key={stg}
                  onClick={() => handleStageChange(stg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {stg.replace('_', ' ').toUpperCase()} {stg === 'closed_won' ? '🏆' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Integration Bar (Google Workspace & Maps) */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onComposeEmail(deal.contactEmail, deal.contactName, deal.id)}
            className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-red-200/80"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Google Mail</span>
          </button>
          <button
            onClick={() => onLaunchMeeting(deal.contactName, deal.contactEmail, `Negotiation: ${deal.title}`)}
            className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-emerald-200/80"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Schedule Google Meet</span>
          </button>
          <button
            onClick={() => onLocateOnMap(deal.company)}
            className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-blue-200/80"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locate on Google Maps</span>
          </button>
          <button
            onClick={() => { onClose(); onRunHighThinkingForDeal(deal); }}
            className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-indigo-200/80"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>High Thinking Audit</span>
          </button>
        </div>

        {/* Gemini AI Deal Strategy Diagnosis */}
        <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Gemini AI Deal Doctor</span>
            </div>
            <button
              onClick={handleRunAiDiagnosis}
              disabled={isDiagnosing}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
            >
              {isDiagnosing ? 'Analyzing...' : 'Refresh AI Strategy'}
            </button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {aiDiagnosis || 'Click Refresh AI Strategy to generate tailored tactics.'}
          </p>
        </div>

        {/* Notes & Account Plan */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Executive Notes & Strategy</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNotes}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
