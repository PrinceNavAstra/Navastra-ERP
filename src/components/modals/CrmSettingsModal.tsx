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
  Building2
} from 'lucide-react';
import { DealStage, StageColorConfig } from '../../types';
import { ErpLogoIcon, ErpLogoBadge } from '../Logo';

interface CrmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageConfigs: StageColorConfig[];
  onSaveStageConfigs: (configs: StageColorConfig[]) => void;
  onResetDefaults?: () => void;
}

const PRESET_PALETTES = [
  { name: 'Slate Steel', color: '#4b5563', badgeBg: '#f3f4f6', badgeText: '#374151', barColor: '#6b7280' },
  { name: 'Sapphire Blue', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8', barColor: '#3b82f6' },
  { name: 'Emerald Forest', color: '#16a34a', badgeBg: '#f0fdf4', badgeText: '#15803d', barColor: '#22c55e' },
  { name: 'Sage Evergreen', color: '#2d7d56', badgeBg: '#e6f4ed', badgeText: '#2d7d56', barColor: '#376b5c' },
  { name: 'Amber Gold', color: '#d97706', badgeBg: '#fffbeb', badgeText: '#b45309', barColor: '#f59e0b' },
  { name: 'Bronze Ochre', color: '#d4a853', badgeBg: '#fdf8ec', badgeText: '#926a1d', barColor: '#cca458' },
  { name: 'Royal Amethyst', color: '#7c3aed', badgeBg: '#f5f3ff', badgeText: '#6d28d9', barColor: '#8b5cf6' },
  { name: 'Rose Crimson', color: '#dc2626', badgeBg: '#fef2f2', badgeText: '#b91c1c', barColor: '#ef4444' },
  { name: 'Cyan Ocean', color: '#0891b2', badgeBg: '#ecfeff', badgeText: '#0e7490', barColor: '#06b6d4' },
  { name: 'Deep Indigo', color: '#4338ca', badgeBg: '#eef2ff', badgeText: '#3730a3', barColor: '#6366f1' },
];

export const CrmSettingsModal: React.FC<CrmSettingsModalProps> = ({
  isOpen,
  onClose,
  stageConfigs,
  onSaveStageConfigs,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'brand'>('stages');
  const [currentConfigs, setCurrentConfigs] = useState<StageColorConfig[]>(stageConfigs);
  const [activeStageId, setActiveStageId] = useState<DealStage>('lead_in');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleUpdateStage = (id: DealStage, updates: Partial<StageColorConfig>) => {
    setCurrentConfigs(prev => prev.map(stage => {
      if (stage.id !== id) return stage;
      return { ...stage, ...updates };
    }));
  };

  const handleApplyPreset = (id: DealStage, preset: typeof PRESET_PALETTES[0]) => {
    handleUpdateStage(id, {
      color: preset.color,
      badgeBg: preset.badgeBg,
      badgeText: preset.badgeText,
      barColor: preset.barColor
    });
  };

  const handleCustomHexChange = (id: DealStage, hex: string) => {
    if (!hex.startsWith('#')) hex = '#' + hex;
    handleUpdateStage(id, {
      color: hex,
      barColor: hex,
      badgeBg: `${hex}18`,
      badgeText: hex
    });
  };

  const handleSave = () => {
    onSaveStageConfigs(currentConfigs);
    onClose();
  };

  const selectedStage = currentConfigs.find(s => s.id === activeStageId) || currentConfigs[0];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 lg:p-8 space-y-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header with Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <ErpLogoBadge size={44} bg="dark" />
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">
                Enterprise CRM & ERP Settings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Customize pipeline visual milestones, color themes, and ERP brand assets.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab('stages')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'stages'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Stage Colors
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
                ERP Logo & Brand
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

        {activeTab === 'stages' ? (
          <>
            {/* Live Stepper Preview */}
            <div className="bg-[#fbf9f4] p-4.5 rounded-2xl border border-slate-200/80 space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Live Pipeline Stepper Preview</span>
                </div>
                <span className="text-[11px] font-normal text-slate-500">6 Active Stages</span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {currentConfigs.map((stage, idx) => {
                  const isSelected = stage.id === activeStageId;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStageId(stage.id)}
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
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-thin">
              {/* Stage Selector Tabs */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                {currentConfigs.map((stage) => {
                  const isActive = stage.id === activeStageId;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveStageId(stage.id)}
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
                        className="w-2 h-2 rounded-full"
                      />
                      <span>{stage.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Stage Attributes Form */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      style={{ backgroundColor: selectedStage.color }}
                      className="w-3.5 h-3.5 rounded-md"
                    />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Editing Stage: <span className="font-serif italic">{selectedStage.label}</span>
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Stage ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{selectedStage.id}</code>
                  </span>
                </div>

                {/* Display Label Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Label / Name
                  </label>
                  <input
                    type="text"
                    value={selectedStage.label}
                    onChange={(e) => handleUpdateStage(selectedStage.id, { label: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-800"
                    placeholder="e.g. QUALIFIED, IN REVIEW"
                  />
                </div>

                {/* Custom Color Hex Picker & Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Theme Accent Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={selectedStage.color.startsWith('#') ? selectedStage.color : '#4b5563'}
                        onChange={(e) => handleCustomHexChange(selectedStage.id, e.target.value)}
                        className="w-9 h-9 rounded-xl border border-slate-200 p-0.5 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={selectedStage.color}
                        onChange={(e) => handleCustomHexChange(selectedStage.id, e.target.value)}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase"
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Progress Bar Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={selectedStage.barColor?.startsWith('#') ? selectedStage.barColor : selectedStage.color}
                        onChange={(e) => handleUpdateStage(selectedStage.id, { barColor: e.target.value })}
                        className="w-9 h-9 rounded-xl border border-slate-200 p-0.5 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={selectedStage.barColor || selectedStage.color}
                        onChange={(e) => handleUpdateStage(selectedStage.id, { barColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase"
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Palette Suggestions */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Quick Preset Color Palettes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_PALETTES.map((preset) => {
                      const isMatch = selectedStage.color.toLowerCase() === preset.color.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleApplyPreset(selectedStage.id, preset)}
                          className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                            isMatch
                              ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <span 
                            style={{ backgroundColor: preset.color }}
                            className="w-4 h-4 rounded-lg shrink-0 shadow-2xs" 
                          />
                          <span className="text-[11px] font-semibold text-slate-800 truncate">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Badge Preview */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 font-medium">
                    Live Badge Appearance:
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      style={{ backgroundColor: selectedStage.badgeBg, color: selectedStage.badgeText }}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                    >
                      {selectedStage.label}
                    </span>
                    <span
                      style={{ backgroundColor: selectedStage.color }}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                    >
                      {selectedStage.label} (Filled)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ERP Brand Identity & Logo Showcase Tab */
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin py-1">
            {/* Main Logo Card */}
            <div className="bg-gradient-to-br from-[#181f33] to-[#121624] rounded-3xl p-6 lg:p-8 text-white border border-[#2b3554] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                {/* Large Vector Logo */}
                <div className="w-28 h-28 rounded-3xl bg-[#0f1422] border border-[#2e395b] flex items-center justify-center p-3 shadow-2xl shrink-0">
                  <ErpLogoIcon size={88} />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official Brand Asset</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    OmniCRM & Enterprise ERP
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                    The interconnected 4-vector geometric ribbon emblem represents continuous pipeline flow, operations synergy, and automated multi-channel intelligence.
                  </p>
                </div>
              </div>

              {/* Logo In Dark & Light Badge Previews */}
              <div className="flex sm:flex-col gap-3 shrink-0">
                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <ErpLogoBadge size={36} bg="dark" />
                  <span className="text-xs text-slate-300 font-semibold pr-2">Dark Theme</span>
                </div>
                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <ErpLogoBadge size={36} bg="white" />
                  <span className="text-xs text-slate-300 font-semibold pr-2">Light Theme</span>
                </div>
              </div>
            </div>

            {/* Color Geometry Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official ERP Brand Palette
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'Vibrant Orange', role: 'Left Pillar / Inward Flow', hex: '#FA7C17', desc: 'Lead Generation' },
                  { name: 'Cyan Emerald', role: 'Upper Diagonal Link', hex: '#00A887', desc: 'Active Qualification' },
                  { name: 'Imperial Red', role: 'Lower Diagonal Link', hex: '#E5232F', desc: 'Closing & Execution' },
                  { name: 'Fresh Green', role: 'Right Pillar / Growth', hex: '#22C55E', desc: 'Enterprise Expansion' }
                ].map((color) => (
                  <div 
                    key={color.name}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:shadow-sm transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        style={{ backgroundColor: color.hex }}
                        className="w-7 h-7 rounded-xl shadow-2xs inline-block"
                      />
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy Hex Code"
                      >
                        {copiedColor === color.hex ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{color.name}</div>
                      <div className="font-mono text-[11px] font-semibold text-slate-500">{color.hex}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      {color.role} · <span className="font-medium text-slate-700">{color.desc}</span>
                    </div>
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
