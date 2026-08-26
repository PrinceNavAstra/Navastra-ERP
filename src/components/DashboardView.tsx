import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  Calendar, 
  Video, 
  BrainCircuit, 
  Receipt,
  Mail,
  ChevronRight
} from 'lucide-react';
import { Deal, Lead, Invoice, GoogleMeeting, ViewType } from '../types';

interface DashboardViewProps {
  deals: Deal[];
  leads: Lead[];
  invoices: Invoice[];
  meetings: GoogleMeeting[];
  onSelectView: (view: ViewType) => void;
  onOpenDeal: (deal: Deal) => void;
  onOpenHighThinking: () => void;
  onOpenAiChat: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deals,
  leads,
  invoices,
  meetings,
  onSelectView,
  onOpenDeal,
  onOpenHighThinking,
  onOpenAiChat
}) => {
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Calculations
  const totalPipelineValue = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipeline = deals
    .filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);

  const closedWonTotal = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.value, 0);

  const overdueInvoicesTotal = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + i.total, 0);

  const activeDeals = deals.filter(d => d.stage !== 'closed_lost');
  const hotLeads = leads.filter(l => l.temperature === 'Hot');

  const generateLiveBriefing = async () => {
    setIsGeneratingBrief(true);
    try {
      const summaryContext = {
        totalPipeline: totalPipelineValue,
        weightedPipeline: Math.round(weightedPipeline),
        closedWon: closedWonTotal,
        overdueInvoices: overdueInvoicesTotal,
        urgentDeals: deals.filter(d => d.priority === 'urgent').map(d => ({ title: d.title, value: d.value, company: d.company, stage: d.stage })),
        upcomingMeetingsCount: meetings.length
      };

      const res = await fetch('/api/ai/fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick_summary',
          payload: {
            data: summaryContext,
            prompt: 'Provide a concise, 3-point executive briefing on revenue risks, highest-priority deal actions, and Google Workspace meetings for today.'
          }
        })
      });

      const data = await res.json();
      if (data.result) {
        setAiBriefing(data.result);
      }
    } catch (err) {
      console.error('Failed to generate AI executive brief', err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Welcome & KPI Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>OmniCRM Executive Radar</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Revenue Performance & Pipeline Telemetry
          </h2>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl">
            Active pipeline stands at <strong className="text-white">${(totalPipelineValue / 1000).toFixed(0)}k</strong> with <strong className="text-emerald-400">${(weightedPipeline / 1000).toFixed(0)}k</strong> weighted probability. 2 urgent deals are pending final signature.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            id="dash-high-thinking-btn"
            onClick={onOpenHighThinking}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>High Thinking Audit</span>
          </button>
          <button
            id="dash-copilot-btn"
            onClick={onOpenAiChat}
            className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-indigo-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ask Gemini AI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Pipeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weighted: ${Math.round(weightedPipeline).toLocaleString()}</span>
          </div>
        </div>

        {/* Closed Won Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Won Revenue (Q3)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ${closedWonTotal.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>100% quota pace achieved</span>
          </div>
        </div>

        {/* Hot Leads & Opportunities */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hot Prospects</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {hotLeads.length} <span className="text-xs font-normal text-slate-500">/ {leads.length} Total</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-slate-600 font-medium">
            <span>Est. Value: ${(hotLeads.reduce((s, l) => s + l.estimatedValue, 0) / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Overdue Invoices Alert */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-red-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue AR Balance</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 tracking-tight">
            ${overdueInvoicesTotal.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs text-slate-500 font-medium">
            <span>1 invoice requiring follow-up</span>
          </div>
        </div>
      </div>

      {/* Live Gemini AI Executive Brief Widget */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100 p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Gemini Live Executive Briefing</h3>
              <p className="text-[11px] text-slate-500">Real-time revenue forecast and deal risk summary</p>
            </div>
          </div>
          <button
            id="dash-refresh-brief-btn"
            onClick={generateLiveBriefing}
            disabled={isGeneratingBrief}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-indigo-700 shadow-2xs transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingBrief ? 'animate-spin' : ''}`} />
            <span>{isGeneratingBrief ? 'Analyzing CRM...' : aiBriefing ? 'Regenerate Brief' : 'Generate Brief'}</span>
          </button>
        </div>

        {aiBriefing ? (
          <div className="p-4 bg-white rounded-xl border border-indigo-100/80 text-xs text-slate-700 leading-relaxed space-y-1.5">
            <p className="font-medium text-slate-900">{aiBriefing}</p>
          </div>
        ) : (
          <div className="p-3.5 bg-white/70 rounded-xl border border-dashed border-indigo-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Click <strong>Generate Brief</strong> to run Gemini AI cross-analysis across pipeline stages, overdue invoices, and scheduled meetings.</span>
          </div>
        )}
      </div>

      {/* Mid Section: Active Urgent Deals & Google Workspace Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Value Priority Deals */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active High-Priority Deals</h3>
              <p className="text-xs text-slate-500">Deals requiring executive touch or contract closing</p>
            </div>
            <button
              onClick={() => onSelectView('pipeline')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>View Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {deals.slice(0, 4).map((deal) => (
              <div
                key={deal.id}
                onClick={() => onOpenDeal(deal)}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 hover:text-indigo-600">{deal.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      deal.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      deal.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {deal.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center space-x-2">
                    <span className="font-medium text-slate-700">{deal.company}</span>
                    <span>•</span>
                    <span>Rep: {deal.assignedTo}</span>
                    <span>•</span>
                    <span>Close: {deal.expectedCloseDate}</span>
                  </div>
                </div>
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center">
                  <div className="text-sm font-bold text-slate-900">${deal.value.toLocaleString()}</div>
                  <div className="text-[11px] font-semibold text-indigo-600">{deal.probability}% Win Prob.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Google Workspace Live Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Today's Google Meets</h3>
            </div>
            <button
              onClick={() => onSelectView('meet')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              All Calls
            </button>
          </div>

          <div className="space-y-3">
            {meetings.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 leading-snug">{m.title}</div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                    {m.scheduledTime}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Attendees: {m.attendees.join(', ')}
                </div>
                <a
                  href={m.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-1"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Google Meet Room</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onSelectView('gmail')}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <span>Open Google Mail Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
