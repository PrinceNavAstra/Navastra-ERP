import React, { useState, useEffect } from 'react';
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
  Cpu,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { StageColorConfig, DealStage, ThemeMode } from '../../types';

interface SettingsAppViewProps {
  stageColors: StageColorConfig[];
  onUpdateStageColors?: (stages: StageColorConfig[]) => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onSetTheme?: (theme: ThemeMode) => void;
  dummyDataEnabled?: boolean;
  dummyDataDeleted?: boolean;
  onToggleDummyData?: (enabled: boolean) => void;
  onDeleteDummyData?: () => void;
}

export const SettingsAppView: React.FC<SettingsAppViewProps> = ({
  stageColors,
  onUpdateStageColors,
  theme = 'light',
  onToggleTheme,
  onSetTheme,
  dummyDataEnabled = false,
  dummyDataDeleted = false,
  onToggleDummyData,
  onDeleteDummyData
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'pipeline' | 'google' | 'ai' | 'security'>('general');
  const [isSaved, setIsSaved] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('Navastra Enterprise Inc');
  const [companyCountry, setCompanyCountry] = useState('India');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST)');
  const [fiscalYear, setFiscalYear] = useState('April 1 - March 31');
  const [coaMode, setCoaMode] = useState<'basic' | 'import'>('basic');
  const [adminPassword, setAdminPassword] = useState('Navastra');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [enableThinking, setEnableThinking] = useState(true);
  const [dbSettings, setDbSettings] = useState({
    enabled: false,
    host: 'localhost',
    port: 5432,
    database: 'navastra_erp',
    user: 'postgres',
    password: 'postgres',
    ssl: false,
  });
  const [aiSettings, setAiSettings] = useState({
    enabled: false,
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: '',
    bearerToken: '',
    tokenHeader: 'Authorization',
    baseUrl: 'https://generativelanguage.googleapis.com',
  });
  const [securityKey, setSecurityKey] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data?.database) setDbSettings(data.database);
        if (data?.ai) {
          setAiSettings(data.ai);
          setAiModel(data.ai.model || 'gemini-2.5-flash');
        }
        if (data?.securityKey) setSecurityKey(data.securityKey);
        if (data?.companyName) setCompanyName(data.companyName);
        if (data?.companyCountry) setCompanyCountry(data.companyCountry);
        if (data?.fiscalYear) setFiscalYear(data.fiscalYear);
        if (data?.chartOfAccountsMode) setCoaMode(data.chartOfAccountsMode);
        if (data?.adminUsername) setAdminPassword(data.adminPassword || 'Navastra');
        if (data?.adminPassword) setAdminPassword(data.adminPassword);
      })
      .catch(() => undefined);
  }, []);

  // Stage colors state
  const [stages, setStages] = useState<StageColorConfig[]>(stageColors);

  const handleSave = async () => {
    if (onUpdateStageColors) {
      onUpdateStageColors(stages);
    }

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: dbSettings,
          ai: { ...aiSettings, model: aiModel || aiSettings.model },
          securityKey: securityKey.trim(),
          companyName: companyName.trim() || 'Navastra Enterprise Inc',
          companyCountry: companyCountry.trim() || 'India',
          fiscalYear: fiscalYear.trim() || 'April 1 - March 31',
          chartOfAccountsMode: coaMode,
          adminUsername: 'Administration',
          adminPassword: adminPassword.trim() || 'Navastra'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save ERP configuration');
      }
    } catch (error) {
      console.error('Failed to persist ERP settings:', error);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111627] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs text-slate-400 font-medium">Navastra ERP Master Control</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">ERP Global Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure appearance, theme modes, company organization profile, pipeline stages, and AI engines.</p>
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
      <div className="flex items-center space-x-2 bg-white dark:bg-[#111627] p-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-x-auto transition-colors">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'general' ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>General & Company</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'appearance' ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Theme & Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'pipeline' ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Pipeline Stages & Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('google')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'google' ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span>Google Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'ai' ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4a853]" />
          <span>Gemini AI Models</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'security' ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Roles</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="bg-white dark:bg-[#111627] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">

        {/* Appearance & Theme Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme & Display Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Switch between Dark Mode and Light Mode. All colors, text contrasts, hover effects, and cards update dynamically.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <div
                onClick={() => onSetTheme ? onSetTheme('light') : onToggleTheme && theme === 'dark' && onToggleTheme()}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${theme === 'light'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Light Mode</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Clean white and warm slate aesthetic</div>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="h-16 rounded-xl bg-white border border-slate-200 p-2.5 flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500" />
                  <div className="space-y-1 flex-1">
                    <div className="w-20 h-2 rounded bg-slate-200" />
                    <div className="w-14 h-1.5 rounded bg-slate-100" />
                  </div>
                </div>
              </div>

              {/* Dark Mode Card */}
              <div
                onClick={() => onSetTheme ? onSetTheme('dark') : onToggleTheme && theme === 'light' && onToggleTheme()}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-indigo-900/50 text-indigo-400">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Deep sapphire navy & high-contrast slate</div>
                    </div>
                  </div>
                  {theme === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="h-16 rounded-xl bg-[#0b0f19] border border-slate-800 p-2.5 flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500" />
                  <div className="space-y-1 flex-1">
                    <div className="w-20 h-2 rounded bg-slate-700" />
                    <div className="w-14 h-1.5 rounded bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Organization & Currency</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ERP System & Enterprise Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  value={companyCountry}
                  onChange={e => setCompanyCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Primary Accounting Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option>USD ($) - United States Dollar</option>
                  <option>EUR (€) - Euro</option>
                  <option>GBP (£) - British Pound</option>
                  <option>JPY (¥) - Japanese Yen</option>
                  <option>INR (₹) - Indian Rupee</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Fiscal Calendar Year</label>
                <input
                  type="text"
                  value={fiscalYear}
                  onChange={e => setFiscalYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">System Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Chart of Accounts Setup</label>
                <select
                  value={coaMode}
                  onChange={e => setCoaMode(e.target.value as 'basic' | 'import')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="basic">Basic COA Template</option>
                  <option value="import">Import COA File</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Login User</label>
                <input
                  type="text"
                  value="Administration"
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Administration Password</label>
                <input
                  type="text"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Kanban Pipeline Stage Styling</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure visual themes, cards, and badges across your sales stages.</p>
            </div>

            <div className="space-y-3">
              {stages.map((st, idx) => (
                <div key={st.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182138] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span
                      style={{ backgroundColor: st.color }}
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{st.label}</div>
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
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800"
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Google Workspace Integrations</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182138] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-xs text-slate-900 dark:text-white">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Google Meet Scheduler</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Auto-generates encrypted Google Meet links on deal meetings.</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182138] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-xs text-slate-900 dark:text-white">
                    <Mail className="w-4 h-4 text-red-600" />
                    <span>Gmail Two-Way Sync</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Logs incoming customer correspondence directly to deal timelines.</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Gemini Intelligence Engine</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Model</label>
                <select
                  value={aiModel}
                  onChange={e => setAiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="gemini-3.5-flash">Gemini 2.5 Flash (Ultra-Low Latency & Proposal Drafter)</option>
                  <option value="gemini-3.5-pro">Gemini 2.5 Pro (Deep Strategic Revenue Auditor)</option>
                  <option value="gemini-3.1-flash-lite">Gemini 2.5 Flash-Lite (Fast Context Lookup)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#182138]">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">High Thinking Mode</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Expose deep step-by-step reasoning tokens for complex deal analysis</div>
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">User Roles & Access Control</h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="p-4 bg-slate-50 dark:bg-[#182138] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white">Master Decryption Key</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Required to decrypt ERP data and company records.</div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-[10px] font-bold">AES-256</span>
                </div>
                <input
                  type="text"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value.toUpperCase())}
                  maxLength={21}
                  placeholder="Enter 21-character alphanumeric key"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">The key must be exactly 21 alphanumeric characters. Without the correct key, stored ERP data remains encrypted and unreadable.</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#182138] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Default Login</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Administration / Navastra</div>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold">Always Primary</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#182138] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white">Demo / Dummy Data</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Toggle ERPNext-style starter records for the system.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleDummyData && onToggleDummyData(!dummyDataEnabled)}
                    disabled={dummyDataDeleted}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dummyDataDeleted ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : dummyDataEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'} `}
                    aria-label="Toggle dummy data"
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${dummyDataEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {dummyDataDeleted ? 'All dummy records have been permanently removed.' : dummyDataEnabled ? 'Dummy data is active in the workspace.' : 'Dummy data is disabled.'}
                  </div>
                  <button
                    type="button"
                    onClick={onDeleteDummyData}
                    disabled={dummyDataDeleted}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${dummyDataDeleted ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/60 cursor-pointer'}`}
                  >
                    {dummyDataDeleted ? 'Deleted Permanently' : 'Delete Dummy Data'}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#182138] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Admin Role</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Full system access, app installations, and settings configuration</div>
                </div>
                <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded text-[10px] font-bold">1 User</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#182138] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">Sales Team</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Access CRM pipeline, sales orders, quotations, and customer follow-up workflows</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded text-[10px] font-bold">CRM + Sales</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
