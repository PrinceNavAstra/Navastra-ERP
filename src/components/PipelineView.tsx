import React, { useState } from 'react';
import { 
  Plus, 
  Kanban as KanbanIcon, 
  List, 
  Sparkles, 
  BrainCircuit, 
  ChevronRight, 
  MoreHorizontal, 
  Video, 
  Mail, 
  MapPin, 
  Building2,
  Calendar,
  Check,
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Deal, DealStage, Priority, StageColorConfig } from '../types';

interface PipelineViewProps {
  deals: Deal[];
  stageConfigs?: StageColorConfig[];
  onUpdateDealStage: (dealId: string, newStage: DealStage) => void;
  onOpenNewDeal: () => void;
  onOpenDealDetail: (deal: Deal) => void;
  onComposeEmailToContact: (email: string, name: string, dealId: string) => void;
  onLaunchMeetingWithContact: (name: string, email: string, title: string) => void;
  onLocateOnMap: (company: string) => void;
  onRunAiDiagnosis: (deal: Deal) => void;
  onOpenCrmSettings?: () => void;
}

const defaultStages: StageColorConfig[] = [
  { id: 'lead_in', label: 'NEW', color: '#4b5563', badgeBg: '#f3f4f6', badgeText: '#374151', barColor: '#6b7280' },
  { id: 'qualified', label: 'QUALIFIED', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8', barColor: '#3b82f6' },
  { id: 'proposal_sent', label: 'PROPOSAL', color: '#d97706', badgeBg: '#fffbeb', badgeText: '#b45309', barColor: '#f59e0b' },
  { id: 'negotiation', label: 'NEGOTIATION', color: '#7c3aed', badgeBg: '#f5f3ff', badgeText: '#6d28d9', barColor: '#8b5cf6' },
  { id: 'closed_won', label: 'WON', color: '#16a34a', badgeBg: '#f0fdf4', badgeText: '#15803d', barColor: '#22c55e' },
  { id: 'closed_lost', label: 'LOST', color: '#dc2626', badgeBg: '#fef2f2', badgeText: '#b91c1c', barColor: '#ef4444' },
];

export const PipelineView: React.FC<PipelineViewProps> = ({
  deals,
  stageConfigs = defaultStages,
  onUpdateDealStage,
  onOpenNewDeal,
  onOpenDealDetail,
  onComposeEmailToContact,
  onLaunchMeetingWithContact,
  onLocateOnMap,
  onRunAiDiagnosis,
  onOpenCrmSettings,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchFilter, setSearchFilter] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'score'>('date');

  // Drag and Drop state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [activeDropStage, setActiveDropStage] = useState<DealStage | null>(null);

  const stages = stageConfigs && stageConfigs.length > 0 ? stageConfigs : defaultStages;

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    onUpdateDealStage(dealId, newStage);
    if (newStage === 'closed_won') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(deal.id);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setActiveDropStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropStage !== stageId) {
      setActiveDropStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: DealStage) => {
    // Check if moving outside column
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!currentTarget.contains(relatedTarget)) {
      if (activeDropStage === stageId) {
        setActiveDropStage(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, stageId: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      handleStageChange(dealId, stageId);
    }
    setActiveDropStage(null);
    setDraggedDealId(null);
  };

  const filteredDeals = deals.filter(d => {
    if (filterPriority !== 'all' && d.priority !== filterPriority) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matches = d.title.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'value') return b.value - a.value;
    if (sortBy === 'score') return (b.aiScore || 0) - (a.aiScore || 0);
    return (a.expectedCloseDate || '').localeCompare(b.expectedCloseDate || '');
  });

  const totalPipelineValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-full mx-auto h-[calc(100vh-4.5rem)] flex flex-col overflow-hidden bg-[#f4f6f8] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Filter Bar (Matches Reference Screenshot layout with QUICK FILTERS) */}
      <div className="bg-white dark:bg-[#121829] p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-none flex flex-wrap items-center justify-between gap-3 shrink-0 transition-colors">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
          {/* Quick Filters label */}
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>QUICK FILTERS:</span>
          </div>

          {/* Search Input pill */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, companies, or contacts..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#1a233c] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-400 transition-all"
            />
          </div>

          {/* Filter Dropdown Pill */}
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 dark:bg-[#1a233c] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#222d4c] transition-colors"
            >
              <option value="all">Filter: All Priorities</option>
              <option value="urgent">Urgent Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Pill */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-7 py-1.5 bg-slate-50 dark:bg-[#1a233c] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-[#222d4c] transition-colors"
            >
              <option value="date">Sort: Closing Date</option>
              <option value="value">Sort: Opportunity Value</option>
              <option value="score">Sort: AI Win Score</option>
            </select>
            <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Stage Colors Settings Quick Button with Live Stage Color Swatches */}
          {onOpenCrmSettings && (
            <button
              id="pipeline-stage-colors-btn"
              onClick={onOpenCrmSettings}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-[#1a233c] hover:bg-slate-100 dark:hover:bg-[#222d4c] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title="Customize Pipeline Stage Colors"
            >
              <Palette className="w-3.5 h-3.5 text-[#d4a853]" />
              <span>Stage Colors</span>
              {/* Visual color swatches showing current stage palette on screen */}
              <div className="flex items-center space-x-1 pl-1.5 border-l border-slate-200 dark:border-slate-700">
                {stages.map((s) => (
                  <span 
                    key={s.id} 
                    style={{ backgroundColor: s.color }} 
                    className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs shrink-0" 
                    title={`${s.label}: ${s.color}`}
                  />
                ))}
              </div>
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex bg-slate-100 dark:bg-[#1a233c] p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban' 
                  ? 'bg-white dark:bg-[#253050] text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-[#253050] text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            id="pipeline-new-deal-btn"
            onClick={onOpenNewDeal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1c2237] hover:bg-[#28304c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Main Kanban Content Area */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 kanban-scroll scroll-smooth">
          <div className="flex space-x-4 h-full min-w-max pr-4">
            {stages.map((stage) => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
              const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);
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
                  className={`w-[320px] sm:w-[335px] flex flex-col h-full bg-[#ebedf0]/85 dark:bg-[#13192b]/95 rounded-2xl border border-slate-300/80 dark:border-slate-800/90 transition-all duration-150 overflow-hidden shadow-2xs dark:shadow-md dark:shadow-black/20 ${
                    isDropTarget 
                      ? 'ring-2 ring-sky-400 bg-sky-50/50 dark:bg-sky-950/40' 
                      : ''
                  }`}
                >
                  {/* Solid Colored Column Header (Exact visual match to Screenshot with Quick Add Button) */}
                  <div 
                    style={{ backgroundColor: stage.color }}
                    className="px-3.5 py-2.5 text-white font-bold text-xs flex items-center justify-between shrink-0 select-none shadow-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="truncate tracking-wide">{stage.label}</span>
                      <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs">
                        {stageDeals.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[11px] font-semibold text-white/95">
                        ${(stageTotal / 1000).toFixed(1)}k
                      </span>
                      <button
                        onClick={onOpenNewDeal}
                        className="w-5 h-5 rounded-md bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-colors cursor-pointer"
                        title={`Add deal to ${stage.label}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Cards Scrollable Column with Smooth Scroll Effect */}
                  <div className="flex-1 overflow-y-auto p-2.5 pr-2 space-y-2.5 kanban-scroll">
                    {stageDeals.length === 0 ? (
                      <div className={`h-36 rounded-xl border border-dashed transition-all flex flex-col items-center justify-center text-xs font-medium p-4 text-center ${
                        isDropTarget 
                          ? 'border-sky-400 bg-sky-100/50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300' 
                          : 'border-slate-300 dark:border-slate-700/60 bg-white/40 dark:bg-[#182036]/40 text-slate-400 dark:text-slate-500'
                      }`}>
                        <span className="font-semibold">{isDropTarget ? `Drop to move to ${stage.label}` : `No deals in ${stage.label}`}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Drag opportunities here or click + above</span>
                      </div>
                    ) : (
                      stageDeals.map((deal) => {
                        const avatarBg = deal.avatarBg || '#d4a853';
                        const avatarInitials = deal.avatarInitials || deal.contactName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ME';
                        const isDragging = draggedDealId === deal.id;

                        return (
                          <div
                            key={deal.id}
                            id={`deal-card-${deal.id}`}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, deal)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onOpenDealDetail(deal)}
                            style={{
                              borderLeft: `4px solid ${stage.color}`
                            }}
                            className={`bg-white dark:bg-[#182035] rounded-xl p-3 border border-slate-200/90 dark:border-slate-750/70 transition-all duration-200 space-y-2.5 group cursor-grab active:cursor-grabbing select-none shadow-2xs dark:shadow-sm dark:shadow-black/25 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/40 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-600 dark:hover:bg-[#1d2740] ${
                              isDragging 
                                ? 'opacity-30 scale-95 border-dashed border-2 border-sky-400 shadow-none' 
                                : ''
                            }`}
                          >
                            {/* Card Header with Company & Contact */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors truncate">
                                  {deal.company}
                                </h4>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                                  {deal.contactName} · {deal.title}
                                </div>
                              </div>

                              {/* Opportunity Value */}
                              <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-slate-900 dark:text-emerald-400 block">
                                  ${deal.value.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Stage Badge & Expected Date Row */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                              {/* Stage Badge with Stage's Custom Color (Matches screenshot) */}
                              <span 
                                style={{ 
                                  backgroundColor: stage.badgeBg, 
                                  color: stage.badgeText,
                                  border: `1px solid ${stage.color}35`
                                }}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md inline-block uppercase tracking-wider dark:brightness-110"
                              >
                                {stage.label}
                              </span>

                              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                Exp: {deal.timeAgo || deal.expectedCloseDate}
                              </div>
                            </div>

                            {/* Action Item Pill / Tag if available */}
                            {deal.actionItems && deal.actionItems.length > 0 && (
                              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 font-medium truncate">
                                  <span 
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: stage.color }}
                                  />
                                  <span className="truncate">{deal.actionItems[0].title}</span>
                                </div>
                              </div>
                            )}

                            {/* Quick Actions & Assignee Toolbar */}
                            <div 
                              className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Assignee Avatar & Name */}
                              <div className="flex items-center space-x-1.5 min-w-0">
                                <div 
                                  style={{ backgroundColor: avatarBg }}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900 font-bold text-[9px] shrink-0 shadow-2xs"
                                >
                                  {avatarInitials}
                                </div>
                                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[85px]">
                                  {deal.assignedTo || 'Unassigned'}
                                </span>
                              </div>

                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => onOpenDealDetail(deal)}
                                  className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="View Deal Dossier"
                                >
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onComposeEmailToContact(deal.contactEmail, deal.contactName, deal.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Send Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onLaunchMeetingWithContact(deal.contactName, deal.contactEmail, `Demo: ${deal.title}`)}
                                  className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                                  title="Google Meet"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                </button>

                                {/* Stage Mover Selector */}
                                <select
                                  value={deal.stage}
                                  onChange={(e) => handleStageChange(deal.id, e.target.value as DealStage)}
                                  className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#232c48] dark:hover:bg-[#2c3758] border border-slate-300 dark:border-slate-650 text-slate-700 dark:text-slate-200 py-0.5 px-1 rounded focus:outline-none transition-colors cursor-pointer"
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

                    {/* Active Drop Placeholder during drag over */}
                    {isDropTarget && draggedDealId && (
                      <div className="h-16 rounded-xl border-2 border-dashed border-sky-400 bg-sky-50/70 dark:bg-sky-950/60 flex items-center justify-center text-xs font-bold text-sky-700 dark:text-sky-300 animate-pulse">
                        Drop to move here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="flex-1 bg-white dark:bg-[#121829] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col shadow-2xs dark:shadow-none">
          <div className="overflow-y-auto flex-1 kanban-scroll">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f8fafc] dark:bg-[#182138] border-b border-slate-200 dark:border-slate-750 sticky top-0 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Expected Close</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDeals.map((deal) => {
                  const stageObj = stages.find(s => s.id === deal.stage) || defaultStages[0];
                  return (
                    <tr
                      key={deal.id}
                      onClick={() => onOpenDealDetail(deal)}
                      className="hover:bg-slate-50 dark:hover:bg-[#1a233c] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{deal.company}</td>
                      <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">{deal.contactName}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-emerald-400">${deal.value.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span 
                          style={{ backgroundColor: stageObj.badgeBg, color: stageObj.badgeText }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          {stageObj.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{deal.expectedCloseDate}</td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{deal.assignedTo || 'Alex Rivera'}</td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenDealDetail(deal)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
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

