import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Layers, 
  Palette, 
  Shield, 
  BrainCircuit, 
  Globe, 
  Save, 
  Check, 
  Sparkles,
  Video,
  Mail,
  Calendar,
  Lock,
  Cpu
} from 'lucide-react';
import { StageColorConfig, DealStage } from '../../types';

interface SettingsAppViewProps {
  stageColors: StageColorConfig[];
  onUpdateStageColors?: (stages: StageColorConfig[]) => void;
}

export const SettingsAppView: React.FC<SettingsAppViewProps> = ({
  stageColors,
  onUpdateStageColors
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'pipeline' | 'google' | 'ai' | 'security'>('general');
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('Navastra Enterprise Inc');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');
  const [fiscalYear, setFiscalYear] = useState('January 1 - December 31');
  const [aiModel, setAiModel] = useState('gemini-3.5-flash');
  const [enableThinking, setEnableThinking] = useState(true);

  // Stage colors state
  const [stages, setStages] = useState<StageColorConfig[]>(stageColors);

  const handleSave = () => {
    if (onUpdateStageColors) {
      onUpdateStageColors(stages);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs text-slate-400 font-medium">Navastra ERP Master Control</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">ERP Global Settings</h2>
          <p className="text-xs text-slate-500">Configure company organization profile, pipeline stage behaviors, Google Workspace bridges, and Gemini AI engines.</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'general' ? 'bg-[#1c2237] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>General & Company</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pipeline' ? 'bg-[#1c2237] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Pipeline Stages & Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('google')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'google' ? 'bg-[#1c2237] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span>Google Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ai' ? 'bg-[#1c2237] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4a853]" />
          <span>Gemini AI Models</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security' ? 'bg-[#1c2237] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Roles</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">Organization & Currency</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">ERP System & Enterprise Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Primary Accounting Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option>USD ($) - United States Dollar</option>
                  <option>EUR (€) - Euro</option>
                  <option>GBP (£) - British Pound</option>
                  <option>JPY (¥) - Japanese Yen</option>
                  <option>INR (₹) - Indian Rupee</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">System Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Fiscal Calendar Year</label>
                <input
                  type="text"
                  value={fiscalYear}
                  onChange={e => setFiscalYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Kanban Pipeline Stage Styling</h3>
              <p className="text-xs text-slate-500">Configure visual themes, cards, and badges across your sales stages.</p>
            </div>

            <div className="space-y-3">
              {stages.map((st, idx) => (
                <div key={st.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <span 
                      style={{ backgroundColor: st.color }}
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{st.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Stage ID: {st.id}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span 
                      style={{ backgroundColor: st.badgeBg, color: st.badgeText }}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    >
                      Sample Badge
                    </span>
                    <input 
                      type="color" 
                      value={st.color} 
                      onChange={e => {
                        const updated = [...stages];
                        updated[idx].color = e.target.value;
                        setStages(updated);
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Workspace Tab */}
        {activeTab === 'google' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">Google Workspace Integrations</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-xs text-slate-900">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Google Meet Scheduler</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Auto-generates encrypted Google Meet links on deal meetings.</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-xs text-slate-900">
                    <Mail className="w-4 h-4 text-red-600" />
                    <span>Gmail Two-Way Sync</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Logs incoming customer correspondence directly to deal timelines.</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">Gemini Intelligence Engine</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Model</label>
                <select
                  value={aiModel}
                  onChange={e => setAiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="gemini-3.5-flash">Gemini 2.5 Flash (Ultra-Low Latency & Proposal Drafter)</option>
                  <option value="gemini-3.5-pro">Gemini 2.5 Pro (Deep Strategic Revenue Auditor)</option>
                  <option value="gemini-3.1-flash-lite">Gemini 2.5 Flash-Lite (Fast Context Lookup)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div>
                  <div className="font-bold text-xs text-slate-900">High Thinking Mode</div>
                  <div className="text-[11px] text-slate-500">Expose deep step-by-step reasoning tokens for complex deal analysis</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableThinking}
                  onChange={e => setEnableThinking(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900">User Roles & Access Control</h3>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Admin Role</div>
                  <div className="text-[10px] text-slate-500">Full system access, app installations, and settings configuration</div>
                </div>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">1 User</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Sales Executive</div>
                  <div className="text-[10px] text-slate-500">Create leads, manage assigned pipeline deals, view calendar</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">14 Users</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
