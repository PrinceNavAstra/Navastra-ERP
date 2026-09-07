import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Palette, 
  RotateCcw, 
  Check, 
  Sparkles, 
  X,
  Settings,
  Eye,
  DollarSign,
  Copy,
  CheckCheck,
  ShieldCheck,
  Building2,
  Users,
  Target
} from 'lucide-react';
import { DealStage, StageColorConfig, LeadStatus, LeadStageColorConfig } from '../../types';
import { ErpLogoIcon, ErpLogoBadge } from '../Logo';
import { defaultLeadStages } from '../LeadsView';

interface CrmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageConfigs: StageColorConfig[];
  onSaveStageConfigs: (configs: StageColorConfig[]) => void;
  leadStageConfigs?: LeadStageColorConfig[];
  onSaveLeadStageConfigs?: (configs: LeadStageColorConfig[]) => void;
  onResetDefaults?: () => void;
}

const PRESET_PALETTES = [
  { name: 'Sky Cyan (Created)', color: '#00a5e5', badgeBg: '#e0f2fe', badgeText: '#0284c7', barColor: '#0ea5e9' },
  { name: 'Amber Gold (Sent)', color: '#f59e0b', badgeBg: '#fef3c7', badgeText: '#b45309', barColor: '#fbbf24' },
  { name: 'Vibrant Green (Paid)', color: '#22c55e', badgeBg: '#dcfce7', badgeText: '#15803d', barColor: '#4ade80' },
  { name: 'Coral Red (Cancel)', color: '#f87171', badgeBg: '#fee2e2', badgeText: '#b91c1c', barColor: '#ef4444' },
  { name: 'Deep Indigo', color: '#6366f1', badgeBg: '#e0e7ff', badgeText: '#4338ca', barColor: '#818cf8' },
  { name: 'Royal Amethyst', color: '#8b5cf6', badgeBg: '#f5f3ff', badgeText: '#6d28d9', barColor: '#a78bfa' },
  { name: 'Slate Steel', color: '#4b5563', badgeBg: '#f3f4f6', badgeText: '#374151', barColor: '#6b7280' },
  { name: 'Bronze Ochre', color: '#d4a853', badgeBg: '#fdf8ec', badgeText: '#926a1d', barColor: '#cca458' },
  { name: 'Teal Emerald', color: '#0d9488', badgeBg: '#ccfbf1', badgeText: '#0f766e', barColor: '#14b8a6' },
  { name: 'Sapphire Blue', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8', barColor: '#3b82f6' }
];

export const CrmSettingsModal: React.FC<CrmSettingsModalProps> = ({
  isOpen,
  onClose,
  stageConfigs,
  onSaveStageConfigs,
  leadStageConfigs = defaultLeadStages,
  onSaveLeadStageConfigs,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'deals' | 'brand'>('leads');
  const [dealConfigs, setDealConfigs] = useState<StageColorConfig[]>(stageConfigs);
  const [leadConfigs, setLeadConfigs] = useState<LeadStageColorConfig[]>(leadStageConfigs);
  
  const [activeDealStageId, setActiveDealStageId] = useState<DealStage>('lead_in');
  const [activeLeadStageId, setActiveLeadStageId] = useState<LeadStatus>('New');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleUpdateDealStage = (id: DealStage, updates: Partial<StageColorConfig>) => {
    setDealConfigs(prev => prev.map(stage => {
      if (stage.id !== id) return stage;
      return { ...stage, ...updates };
    }));
  };

  const handleUpdateLeadStage = (id: LeadStatus, updates: Partial<LeadStageColorConfig>) => {
    setLeadConfigs(prev => prev.map(stage => {
      if (stage.id !== id) return stage;
      return { ...stage, ...updates };
    }));
  };

  const handleSave = () => {
    onSaveStageConfigs(dealConfigs);
    if (onSaveLeadStageConfigs) {
      onSaveLeadStageConfigs(leadConfigs);
    }
    onClose();
  };

  const selectedDealStage = dealConfigs.find(s => s.id === activeDealStageId) || dealConfigs[0];
  const selectedLeadStage = leadConfigs.find(s => s.id === activeLeadStageId) || leadConfigs[0];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 lg:p-8 space-y-5 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header with Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <ErpLogoBadge size={40} bg="dark" />
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">
                CRM & Pipeline Stage Colors
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Configure staging-wise colors for leads and deals matching your organization's workflow.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab('leads')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'leads'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Lead Stages</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('deals')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'deals'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Target className="w-3 h-3" />
                <span>Deal Stages</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('brand')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'brand'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ERP Brand
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lead Stages Tab */}
        {activeTab === 'leads' && (
          <>
            {/* Live Lead Stepper Preview */}
            <div className="bg-[#f4f6f8] p-4 rounded-2xl border border-slate-200 space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Live Leads Staging-Wise Colors</span>
                </div>
                <span className="text-[11px] font-normal text-slate-500">5 Active Stages</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {leadConfigs.map((stage) => {
                  const isSelected = stage.id === activeLeadStageId;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveLeadStageId(stage.id)}
                      className={`flex flex-col items-start space-y-1.5 p-2 rounded-xl text-left transition-all ${
                        isSelected ? 'bg-white shadow-xs ring-2 ring-slate-900' : 'hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span 
                          style={{ color: stage.color }}
                          className="text-[10px] font-bold tracking-wider truncate"
                        >
                          {stage.label}
                        </span>
                      </div>
                      <div 
                        style={{ backgroundColor: stage.color }}
                        className="w-full h-1.5 rounded-full shadow-2xs" 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lead Stage Editor */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {/* Stage selector pills */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                {leadConfigs.map((stage) => {
                  const isActive = stage.id === activeLeadStageId;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveLeadStageId(stage.id)}
                      style={{
                        borderColor: isActive ? stage.color : undefined,
                        backgroundColor: isActive ? stage.badgeBg : undefined,
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-2 ${
                        isActive 
                          ? 'shadow-2xs text-slate-900' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span 
                        style={{ backgroundColor: stage.color }}
                        className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                      />
                      <span>{stage.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Editing Card Form */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      style={{ backgroundColor: selectedLeadStage.color }}
                      className="w-3.5 h-3.5 rounded-md inline-block shadow-2xs"
                    />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Configuring Lead Stage: <span className="font-serif italic">{selectedLeadStage.label}</span>
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{selectedLeadStage.id}</code>
                  </span>
                </div>

                {/* Display Label Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Title
                  </label>
                  <input
                    type="text"
                    value={selectedLeadStage.label}
                    onChange={(e) => handleUpdateLeadStage(selectedLeadStage.id, { label: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                {/* Preset Palettes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Color Presets
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_PALETTES.map((preset) => {
                      const isCurrent = selectedLeadStage.color.toLowerCase() === preset.color.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            handleUpdateLeadStage(selectedLeadStage.id, {
                              color: preset.color,
                              badgeBg: preset.badgeBg,
                              badgeText: preset.badgeText,
                              barColor: preset.barColor
                            });
                          }}
                          className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                            isCurrent 
                              ? 'border-slate-900 bg-slate-50 shadow-xs ring-1 ring-slate-900' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <span 
                            style={{ backgroundColor: preset.color }}
                            className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0 flex-1 truncate">
                            <div className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Inputs */}
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700">Custom Hex:</label>
                    <input 
                      type="color"
                      value={selectedLeadStage.color}
                      onChange={(e) => {
                        const hex = e.target.value;
                        handleUpdateLeadStage(selectedLeadStage.id, {
                          color: hex,
                          barColor: hex,
                          badgeBg: `${hex}18`,
                          badgeText: hex
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedLeadStage.color}
                    onChange={(e) => {
                      let hex = e.target.value;
                      if (!hex.startsWith('#')) hex = '#' + hex;
                      handleUpdateLeadStage(selectedLeadStage.id, {
                        color: hex,
                        barColor: hex,
                        badgeBg: `${hex}18`,
                        badgeText: hex
                      });
                    }}
                    className="w-28 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase text-slate-800"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Deal Stages Tab */}
        {activeTab === 'deals' && (
          <>
            {/* Live Stepper Preview */}
            <div className="bg-[#f4f6f8] p-4 rounded-2xl border border-slate-200 space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Live Pipeline Stepper Preview</span>
                </div>
                <span className="text-[11px] font-normal text-slate-500">6 Active Stages</span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {dealConfigs.map((stage, idx) => {
                  const isSelected = stage.id === activeDealStageId;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveDealStageId(stage.id)}
                      className={`flex flex-col items-start space-y-1.5 p-2 rounded-xl text-left transition-all ${
                        isSelected ? 'bg-white shadow-xs ring-2 ring-slate-900' : 'hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span 
                          style={{ color: stage.color }}
                          className="text-[10px] font-bold tracking-wider truncate"
                        >
                          {stage.label}
                        </span>
                        <span
                          style={{ backgroundColor: stage.badgeBg, color: stage.badgeText }}
                          className="text-[9px] font-bold px-1.5 py-0.2 rounded-full"
                        >
                          {idx + 1}
                        </span>
                      </div>
                      <div 
                        style={{ backgroundColor: stage.barColor }}
                        className="w-full h-1.5 rounded-full shadow-2xs" 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage Editor Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                {dealConfigs.map((stage) => {
                  const isActive = stage.id === activeDealStageId;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveDealStageId(stage.id)}
                      style={{
                        borderColor: isActive ? stage.color : undefined,
                        backgroundColor: isActive ? stage.badgeBg : undefined,
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-2 ${
                        isActive 
                          ? 'shadow-2xs text-slate-900' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span 
                        style={{ backgroundColor: stage.color }}
                        className="w-2.5 h-2.5 rounded-full"
                      />
                      <span>{stage.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      style={{ backgroundColor: selectedDealStage.color }}
                      className="w-3.5 h-3.5 rounded-md"
                    />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Configuring Deal Stage: <span className="font-serif italic">{selectedDealStage.label}</span>
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">{selectedDealStage.id}</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Label / Name
                  </label>
                  <input
                    type="text"
                    value={selectedDealStage.label}
                    onChange={(e) => handleUpdateDealStage(selectedDealStage.id, { label: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                {/* Preset Palettes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Color Presets
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_PALETTES.map((preset) => {
                      const isCurrent = selectedDealStage.color.toLowerCase() === preset.color.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            handleUpdateDealStage(selectedDealStage.id, {
                              color: preset.color,
                              badgeBg: preset.badgeBg,
                              badgeText: preset.badgeText,
                              barColor: preset.barColor
                            });
                          }}
                          className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                            isCurrent 
                              ? 'border-slate-900 bg-slate-50 shadow-xs ring-1 ring-slate-900' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <span 
                            style={{ backgroundColor: preset.color }}
                            className="w-4 h-4 rounded-full shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0 flex-1 truncate">
                            <div className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700">Custom Hex:</label>
                    <input 
                      type="color"
                      value={selectedDealStage.color}
                      onChange={(e) => {
                        const hex = e.target.value;
                        handleUpdateDealStage(selectedDealStage.id, {
                          color: hex,
                          barColor: hex,
                          badgeBg: `${hex}18`,
                          badgeText: hex
                        });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedDealStage.color}
                    onChange={(e) => {
                      let hex = e.target.value;
                      if (!hex.startsWith('#')) hex = '#' + hex;
                      handleUpdateDealStage(selectedDealStage.id, {
                        color: hex,
                        barColor: hex,
                        badgeBg: `${hex}18`,
                        badgeText: hex
                      });
                    }}
                    className="w-28 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase text-slate-800"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Brand Tab */}
        {activeTab === 'brand' && (
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
            <div className="bg-[#f8f9fa] p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center space-x-4">
                <ErpLogoIcon size={56} />
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">ERP Brand Geometry</h3>
                  <p className="text-xs text-slate-500">Official vector insignia color palette</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Vibrant Orange', hex: '#FA7C17', desc: 'Lead Generation' },
                  { name: 'Cyan Emerald', hex: '#00A887', desc: 'Active Qualification' },
                  { name: 'Imperial Red', hex: '#E5232F', desc: 'Closing & Execution' },
                  { name: 'Fresh Green', hex: '#22C55E', desc: 'Enterprise Expansion' }
                ].map((color) => (
                  <div key={color.name} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span style={{ backgroundColor: color.hex }} className="w-5 h-5 rounded-lg shadow-2xs" />
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="text-slate-400 hover:text-slate-900"
                        title="Copy Hex"
                      >
                        {copiedColor === color.hex ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{color.name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{color.hex}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onResetDefaults) {
                onResetDefaults();
              }
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Colors</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 bg-[#1c2237] hover:bg-[#28304c] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apply & Save</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
