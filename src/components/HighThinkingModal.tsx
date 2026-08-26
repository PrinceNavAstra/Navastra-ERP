import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  Clock, 
  Copy, 
  Check,
  RotateCcw
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Deal } from '../types';

interface HighThinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  preSelectedDeal?: Deal | null;
}

export const HighThinkingModal: React.FC<HighThinkingModalProps> = ({
  isOpen,
  onClose,
  deals,
  preSelectedDeal
}) => {
  const [selectedDealId, setSelectedDealId] = useState<string>(preSelectedDeal?.id || deals[0]?.id || '');
  const [thinkingTopic, setThinkingTopic] = useState<string>('win_probability');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const presetTopics = [
    {
      id: 'win_probability',
      title: 'Deal Acceleration & Win Playbook',
      prompt: 'Perform deep multi-stage analysis on closing dynamics, identify hidden deal stall risks, and formulate an aggressive 72-hour playbook to secure contract signature.'
    },
    {
      id: 'competitor_displacement',
      title: 'Competitive Displacement vs Incumbents (SAP/Salesforce)',
      prompt: 'Construct an executive battlecard to decisively displace legacy incumbents, emphasizing TCO savings, modern Google Workspace agility, and zero-downtime migration.'
    },
    {
      id: 'contract_risk',
      title: 'Contract Liability & SLA Risk Audit',
      prompt: 'Examine enterprise contract liabilities, SLA penalty thresholds, payment term risks, and recommend optimized legal phrasing for Section 8.4 compliance.'
    },
    {
      id: 'scenario_forecast',
      title: '3-Tier Revenue Scenario Forecasting',
      prompt: 'Forecast 3 distinct financial outcomes (Optimistic, Base, Downside) for this opportunity, with weighted probabilistic milestones and cash collection schedules.'
    }
  ];

  const handleRunHighThinking = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const activePreset = presetTopics.find(t => t.id === thinkingTopic);
    const finalPrompt = customPrompt.trim() 
      ? `${activePreset?.prompt || ''}\n\nCustom Operator Instructions:\n${customPrompt}`
      : activePreset?.prompt || 'Deep analysis of enterprise deal';

    try {
      const res = await fetch('/api/ai/high-thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          dealData: selectedDeal,
          context: {
            analysisEngine: 'gemini-3.1-pro-preview',
            thinkingMode: 'HIGH',
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisResult('Analysis completed with no output.');
      }
    } catch (err: any) {
      console.error('High thinking failure:', err);
      setAnalysisResult(`Error running High Thinking analysis: ${err.message || 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-950">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">Gemini High Thinking Strategic Core</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  gemini-3.1-pro-preview • HIGH
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Deep multi-stage reasoning engine for enterprise risk modeling, deal acceleration & predictive strategy.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Body: Left Inputs, Right Deep Output */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
          {/* Left Column: Deal Target & Configuration */}
          <div className="md:col-span-5 border-r border-slate-800 p-5 space-y-4 overflow-y-auto bg-slate-900/60">
            {/* Target Deal Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Opportunity / Client
              </label>
              <select
                value={selectedDealId}
                onChange={(e) => setSelectedDealId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.company} — ${d.value.toLocaleString()} ({d.stage})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Deal Mini-Dossier */}
            {selectedDeal && (
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-white text-sm">{selectedDeal.title}</div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Value: <strong className="text-emerald-400">${selectedDeal.value.toLocaleString()}</strong></span>
                  <span>Win Prob: <strong className="text-indigo-400">{selectedDeal.probability}%</strong></span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  Notes: {selectedDeal.notes}
                </div>
              </div>
            )}

            {/* Strategic Topic Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                High-Thinking Protocol
              </label>
              <div className="space-y-2">
                {presetTopics.map((topic) => {
                  const isSelected = thinkingTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setThinkingTopic(topic.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{topic.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Directives */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Additional Instructions (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Focus on countering competitor's 15% discount offer while holding our price firm..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Trigger */}
            <button
              id="run-high-thinking-btn"
              onClick={handleRunHighThinking}
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-950 disabled:opacity-50"
            >
              <BrainCircuit className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Thinking Deeply (gemini-3.1-pro-preview)...' : 'Execute High-Thinking Analysis'}</span>
            </button>
          </div>

          {/* Right Column: Reasoning Output */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-slate-950">
            {/* Output Sub-Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reasoning Artifact & Strategic Roadmap
              </span>
              {analysisResult && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Brief</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Output Display Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-pulse">
                    <BrainCircuit className="w-7 h-7 text-indigo-400 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Gemini High Thinking in Progress</h3>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Evaluating multi-variable risks, customer decision trees, and formulating tactical closing playbooks...
                    </p>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="markdown-body prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed">
                  <Markdown>{analysisResult}</Markdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-3 text-center text-slate-500">
                  <BrainCircuit className="w-12 h-12 text-slate-700" />
                  <p className="text-xs max-w-xs">
                    Select a target deal and strategic protocol, then click <strong>Execute High-Thinking Analysis</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
