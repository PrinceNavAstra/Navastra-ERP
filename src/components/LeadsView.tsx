import React, { useState } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Mail,
  Video,
  MapPin,
  ArrowRight,
  Building2,
  Phone,
  Flame,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Kanban as KanbanIcon,
  List,
  Eye,
  Edit3,
  Palette,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, LeadStatus, LeadTemperature, LeadStageColorConfig } from '../types';

export const defaultLeadStages: LeadStageColorConfig[] = [
  {
    id: 'New',
    label: 'Created / New',
    color: '#00a5e5', // Sky Blue / Cyan (Matches Screenshot Column 1)
    badgeBg: '#e0f2fe',
    badgeText: '#0284c7',
    barColor: '#0ea5e9'
  },
  {
    id: 'Contacted',
    label: 'Contacted / Sent',
    color: '#f59e0b', // Amber / Orange (Matches Screenshot Column 3)
    badgeBg: '#fef3c7',
    badgeText: '#b45309',
    barColor: '#fbbf24'
  },
  {
    id: 'Qualified',
    label: 'Qualified Lead',
    color: '#6366f1', // Indigo / Purple
    badgeBg: '#e0e7ff',
    badgeText: '#4338ca',
    barColor: '#818cf8'
  },
  {
    id: 'Proposal',
    label: 'Proposal / Active',
    color: '#22c55e', // Vibrant Green / Paid (Matches Screenshot Column 4)
    badgeBg: '#dcfce7',
    badgeText: '#15803d',
    barColor: '#4ade80'
  },
  {
    id: 'Unqualified',
    label: 'Cancel / Lost',
    color: '#f87171', // Coral Red / Cancel (Matches Screenshot Column 2)
    badgeBg: '#fee2e2',
    badgeText: '#b91c1c',
    barColor: '#ef4444'
  },
];

interface LeadsViewProps {
  leads: Lead[];
  stageConfigs?: LeadStageColorConfig[];
  onOpenNewLead: () => void;
  onOpenLeadDetail: (lead: Lead) => void;
  onConvertLeadToDeal: (lead: Lead) => void;
  onComposeEmail: (email: string, name: string) => void;
  onLaunchMeeting: (name: string, email: string, title: string) => void;
  onLocateOnMap: (company: string) => void;
  onEnrichLeadWithAi: (lead: Lead) => void;
  onUpdateLeadStatus?: (leadId: string, newStatus: LeadStatus) => void;
  onOpenCrmSettings?: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  stageConfigs = defaultLeadStages,
  onOpenNewLead,
  onOpenLeadDetail,
  onConvertLeadToDeal,
  onComposeEmail,
  onLaunchMeeting,
  onLocateOnMap,
  onEnrichLeadWithAi,
  onUpdateLeadStatus,
  onOpenCrmSettings
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterTemp, setFilterTemp] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchLead, setSearchLead] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'score' | 'name'>('value');

  // Drag and Drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [activeDropStage, setActiveDropStage] = useState<LeadStatus | null>(null);

  const stages = stageConfigs && stageConfigs.length > 0 ? stageConfigs : defaultLeadStages;

  const handleStageChange = (leadId: string, newStatus: LeadStatus) => {
    if (onUpdateLeadStatus) {
      onUpdateLeadStatus(leadId, newStatus);
    }
    if (newStatus === 'Proposal') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(lead.id);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setActiveDropStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropStage !== stageId) {
      setActiveDropStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: LeadStatus) => {
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!currentTarget.contains(relatedTarget)) {
      if (activeDropStage === stageId) {
        setActiveDropStage(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      handleStageChange(leadId, stageId);
    }
    setActiveDropStage(null);
    setDraggedLeadId(null);
  };

  const filteredLeads = leads.filter(l => {
    if (filterTemp !== 'all' && l.temperature !== filterTemp) return false;
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (searchLead.trim()) {
      const q = searchLead.toLowerCase();
      const matches = l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.assignedTo && l.assignedTo.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'value') return b.estimatedValue - a.estimatedValue;
    if (sortBy === 'score') return b.score - a.score;
    return a.company.localeCompare(b.company);
  });

  const getStageConfig = (status: LeadStatus): LeadStageColorConfig => {
    return stages.find(s => s.id === status) || {
      id: status,
      label: status,
      color: '#64748b',
      badgeBg: '#f1f5f9',
      badgeText: '#334155',
      barColor: '#94a3b8'
    };
  };

  const totalLeadsValue = filteredLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-full mx-auto h-[calc(100vh-4.5rem)] flex flex-col overflow-hidden bg-slate-100/90 dark:bg-[#0b0f19] transition-colors duration-200">

      {/* Top Quick Filters Bar - Matches Reference Screenshot Layout */}
      <div className="bg-white dark:bg-[#111627] p-3 rounded-2xl border border-slate-250 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors">

        {/* Quick Filters label & input fields */}
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>QUICK FILTERS:</span>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, contact, company, or assignee..."
              value={searchLead}
              onChange={(e) => setSearchLead(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#182138] border border-slate-250 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Temperature dropdown */}
          <div className="relative">
            <select
              value={filterTemp}
              onChange={(e) => setFilterTemp(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 dark:bg-[#182138] border border-slate-250 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#202c4b] transition-colors"
            >
              <option value="all">All Intent</option>
              <option value="Hot">🔥 Hot Velocity</option>
              <option value="Warm">⚡ Warm Interest</option>
              <option value="Cold">❄️ Cold Prospect</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status filter dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 dark:bg-[#182138] border border-slate-250 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#202c4b] transition-colors"
            >
              <option value="all">All Stages</option>
              {stages.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <ChevronRight className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {/* Stage Color Swatches Indicator */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-50 dark:bg-[#182138] rounded-lg border border-slate-200 dark:border-slate-700" title="Stage Wise Color Coding">
            <Palette className="w-3 h-3 text-slate-400 mr-1" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Stages:</span>
            {stages.map(s => (
              <span
                key={s.id}
                style={{ backgroundColor: s.color }}
                className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                title={`${s.label}: ${s.color}`}
              />
            ))}
          </div>
        </div>

        {/* View mode toggle & Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-250 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'kanban'
                  ? 'bg-white dark:bg-[#111627] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'table'
                  ? 'bg-white dark:bg-[#111627] text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            id="leads-add-new-btn"
            onClick={onOpenNewLead}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1c2237] dark:bg-emerald-600 hover:bg-[#28304c] dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Kanban Board or Table View */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 kanban-scroll">
          <div className="flex space-x-4 h-full min-w-max">
            {stages.map((stage) => {
              const stageLeads = filteredLeads.filter(l => l.status === stage.id);
              const stageTotal = stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
              const isDropTarget = activeDropStage === stage.id;

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={(e) => handleDragLeave(e, stage.id)}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  style={{
                    borderBottom: `3px solid ${stage.color}`
                  }}
                  className={`w-72 sm:w-80 flex flex-col h-full bg-[#ebedf0]/80 dark:bg-[#151c2e]/90 rounded-xl border border-slate-300/80 dark:border-slate-800 transition-all duration-150 overflow-hidden shadow-2xs ${isDropTarget
                      ? 'ring-2 ring-sky-400 bg-sky-50/50 dark:bg-sky-950/40'
                      : ''
                    }`}
                >
                  {/* Solid Colored Column Header (Exact visual match to Screenshot) */}
                  <div
                    style={{ backgroundColor: stage.color }}
                    className="px-3.5 py-2.5 text-white font-bold text-xs flex items-center justify-between shrink-0 select-none shadow-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="truncate">{stage.label}</span>
                      <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                        {stageLeads.length}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-white/90 shrink-0">
                      ${(stageTotal / 1000).toFixed(1)}k
                    </span>
                  </div>

                  {/* Cards Scrollable Container */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 kanban-scroll">
                    {stageLeads.length === 0 ? (
                      <div className={`h-32 rounded-lg border border-dashed transition-all flex flex-col items-center justify-center text-xs font-medium ${isDropTarget
                          ? 'border-sky-400 bg-sky-100/50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300'
                          : 'border-slate-300 dark:border-slate-750 bg-white/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500'
                        }`}>
                        <span>{isDropTarget ? `Drop to move to ${stage.label}` : `No leads in ${stage.label}`}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Drag leads here</span>
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const avatarBg = lead.avatarBg || '#d4a853';
                        const avatarInitials = lead.avatarInitials || lead.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ME';
                        const isDragging = draggedLeadId === lead.id;

                        return (
                          <div
                            key={lead.id}
                            id={`lead-card-${lead.id}`}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, lead)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onOpenLeadDetail(lead)}
                            style={{
                              borderLeft: `5px solid ${stage.color}`
                            }}
                            className={`bg-white dark:bg-[#111627] rounded-lg p-3 border border-slate-200 dark:border-slate-800 transition-all duration-150 space-y-2 group cursor-grab active:cursor-grabbing select-none shadow-2xs hover:shadow-md dark:hover:border-slate-700 hover:-translate-y-0.5 ${isDragging
                                ? 'opacity-30 scale-95 border-dashed border-2 border-sky-400 shadow-none'
                                : ''
                              }`}
                          >
                            {/* Card Title & Company Header (Matches Screenshot layout) */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors truncate">
                                  {lead.company}
                                </h4>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                                  {lead.name} {lead.title ? `· ${lead.title}` : ''}
                                </div>
                              </div>

                              {/* Value badge */}
                              <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                  ${lead.estimatedValue.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Stage-wise Color Status Badge & Temperature row */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                              {/* Stage Badge with Stage's Custom Color (Matches screenshot) */}
                              <span
                                style={{
                                  backgroundColor: stage.badgeBg,
                                  color: stage.badgeText,
                                  border: `1px solid ${stage.color}30`
                                }}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider"
                              >
                                {lead.status}
                              </span>

                              {/* Lead Temperature indicator */}
                              <div className="flex items-center space-x-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center ${lead.temperature === 'Hot' ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60' :
                                    lead.temperature === 'Warm' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60' :
                                      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                                  }`}>
                                  {lead.temperature === 'Hot' && <Flame className="w-2.5 h-2.5 text-red-500 mr-0.5" />}
                                  <span>{lead.temperature} · {lead.score}%</span>
                                </span>
                              </div>
                            </div>

                            {/* Assignee row & Quick Action Buttons (Eye, Email, Meet) */}
                            <div
                              className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Assignee Avatar & Name (Matches Screenshot: Admin / User 1 / User 2) */}
                              <div className="flex items-center space-x-1.5 min-w-0">
                                <div
                                  style={{ backgroundColor: avatarBg }}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900 font-bold text-[9px] shrink-0 shadow-2xs"
                                >
                                  {avatarInitials}
                                </div>
                                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[90px]">
                                  {lead.assignedTo || 'Unassigned'}
                                </span>
                              </div>

                              {/* Action icons: Eye (View Dossier), Email, Quick Stage Selector */}
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => onOpenLeadDetail(lead)}
                                  className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded transition-colors cursor-pointer"
                                  title="View Full Dossier"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onComposeEmail(lead.email, lead.name)}
                                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-colors cursor-pointer"
                                  title="Send Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onLaunchMeeting(lead.name, lead.email, `Discovery: ${lead.company}`)}
                                  className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded transition-colors cursor-pointer"
                                  title="Google Meet"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                </button>

                                {/* Stage quick changer */}
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStatus)}
                                  className="text-[10px] font-bold bg-slate-100 dark:bg-[#1c2438] hover:bg-slate-200 dark:hover:bg-[#25304b] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-0.5 px-1 rounded focus:outline-none transition-colors cursor-pointer"
                                  title="Change Stage"
                                >
                                  {stages.map(s => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Drop Highlight during Drag */}
                    {isDropTarget && draggedLeadId && (
                      <div className="h-16 rounded-lg border-2 border-dashed border-sky-400 bg-sky-50/70 dark:bg-sky-950/50 flex items-center justify-center text-xs font-bold text-sky-700 dark:text-sky-300 animate-pulse">
                        Drop to move to {stage.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View with Stage-wise Colors */
        <div className="flex-1 bg-white dark:bg-[#111627] rounded-2xl border border-slate-250 dark:border-slate-800 overflow-hidden flex flex-col shadow-2xs transition-colors">
          <div className="overflow-y-auto flex-1 kanban-scroll">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f7f5ed] dark:bg-[#182138] border-b border-slate-200 dark:border-slate-800 sticky top-0 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Lead / Company</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Intent & AI Score</th>
                  <th className="py-3.5 px-4">Est. Value</th>
                  <th className="py-3.5 px-4">Assignee</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLeads.map((lead) => {
                  const stage = getStageConfig(lead.status);
                  const avatarBg = lead.avatarBg || '#d4a853';
                  const avatarInitials = lead.avatarInitials || lead.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ME';

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onOpenLeadDetail(lead)}
                      style={{ borderLeft: `4px solid ${stage.color}` }}
                      className="hover:bg-slate-50/80 dark:hover:bg-[#182138]/60 transition-colors cursor-pointer group"
                    >
                      {/* Stage Column with Stage-wise Color Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          style={{
                            backgroundColor: stage.badgeBg,
                            color: stage.badgeText,
                            border: `1px solid ${stage.color}40`
                          }}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-md inline-flex items-center space-x-1 uppercase"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block mr-1"
                            style={{ backgroundColor: stage.color }}
                          />
                          <span>{stage.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            style={{ backgroundColor: avatarBg }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs shrink-0 shadow-2xs"
                          >
                            {avatarInitials}
                          </div>
                          <div>
                            <div className="font-serif font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                              {lead.company}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lead.name} · {lead.title}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">{lead.email}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lead.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${lead.temperature === 'Hot' ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60' :
                              lead.temperature === 'Warm' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60' :
                                'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60'
                            }`}>
                            {lead.temperature === 'Hot' && <Flame className="w-3 h-3 text-red-500 mr-0.5" />}
                            <span>{lead.temperature} ({lead.score}%)</span>
                          </span>
                        </div>
                        {lead.aiInsights && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 max-w-xs">
                            {lead.aiInsights}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                        ${lead.estimatedValue.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {lead.assignedTo || 'Unassigned'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                        {lead.city}, {lead.country}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenLeadDetail(lead)}
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-lg transition-colors cursor-pointer"
                            title="View Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onComposeEmail(lead.email, lead.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Send Google Mail"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onLaunchMeeting(lead.name, lead.email, `Intro: ${lead.company}`)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Schedule Google Meet"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onLocateOnMap(lead.company)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                            title="View on Google Maps"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
