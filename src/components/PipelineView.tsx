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
    <div className="p-6 lg:p-8 space-y-6 max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-[#fbf9f4]">
      {/* Top Filter Bar (Matches Image 1 layout) */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input pill */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads or companies..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          {/* Filter Dropdown Pill */}
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 focus:outline-none shadow-2xs cursor-pointer hover:bg-slate-50"
            >
              <option value="all">Filter: All Priorities</option>
              <option value="urgent">Urgent Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Pill */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3.5 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 focus:outline-none shadow-2xs cursor-pointer hover:bg-slate-50"
            >
              <option value="date">Sort: Closing Date</option>
              <option value="value">Sort: Opportunity Value</option>
              <option value="score">Sort: AI Win Score</option>
            </select>
            <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Stage Colors Settings Quick Button with Live Stage Color Swatches */}
          {onOpenCrmSettings && (
            <button
              id="pipeline-stage-colors-btn"
              onClick={onOpenCrmSettings}
              className="flex items-center space-x-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-full text-xs font-semibold shadow-2xs transition-all hover:border-slate-300"
              title="Customize Pipeline Stage Colors"
            >
              <Palette className="w-3.5 h-3.5 text-[#d4a853]" />
              <span>Stage Colors</span>
              {/* Visual color swatches showing current stage palette on screen */}
              <div className="flex items-center space-x-1 pl-1.5 border-l border-slate-200">
                {stages.map((s) => (
                  <span 
                    key={s.id} 
                    style={{ backgroundColor: s.color }} 
                    className="w-2 h-2 rounded-full inline-block shadow-2xs" 
                    title={`${s.label}: ${s.color}`}
                  />
                ))}
              </div>
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-white p-1 rounded-full border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Kanban Content Area */}
      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2">
          <div className="flex space-x-5 h-full min-w-max">
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
                  className={`w-76 flex flex-col h-full space-y-3 p-1.5 rounded-2xl transition-all duration-200 ${
                    isDropTarget 
                      ? 'bg-emerald-50/60 ring-2 ring-emerald-400/80 shadow-md' 
                      : 'bg-transparent'
                  }`}
                >
                  {/* Column Header (Matches Image 1 with custom stage color) */}
                  <div className="flex items-center justify-between px-1 shrink-0">
                    <div className="flex items-center space-x-2">
                      <span 
                        style={{ color: stage.color }}
                        className="text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5"
                      >
                        <span 
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: stage.color }}
                        />
                        {stage.label}
                      </span>
                      <span 
                        style={{ backgroundColor: stage.badgeBg, color: stage.badgeText }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      >
                        {stageDeals.length}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">
                      ${(stageTotal / 1000).toFixed(1)}k
                    </span>
                  </div>

                  {/* Cards Scrollable Column */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                    {stageDeals.length === 0 ? (
                      <div className={`h-28 rounded-2xl border border-dashed transition-all flex items-center justify-center text-xs font-medium ${
                        isDropTarget 
                          ? 'border-emerald-500 bg-emerald-100/40 text-emerald-700' 
                          : 'border-slate-300/80 bg-white/40 text-slate-400'
                      }`}>
                        {isDropTarget ? `Drop to move to ${stage.label}` : `No deals in ${stage.label.toLowerCase()}`}
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
                            className={`bg-white rounded-2xl p-4 border transition-all duration-200 space-y-3 group cursor-grab active:cursor-grabbing select-none ${
                              isDragging 
                                ? 'opacity-30 scale-95 border-dashed border-2 border-emerald-500 shadow-none' 
                                : 'border-slate-250/80 shadow-2xs hover:shadow-md hover:border-slate-350 hover:-translate-y-0.5'
                            }`}
                          >
                            {/* Top Avatar & Title */}
                            <div className="flex items-start space-x-3">
                              <div 
                                style={{ backgroundColor: avatarBg }}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200"
                              >
                                {avatarInitials}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="font-serif text-sm font-bold text-slate-900 group-hover:text-[#2d7d56] transition-colors truncate">
                                  {deal.company}
                                </h4>
                                <div className="text-[11px] font-medium text-slate-500 truncate">
                                  {deal.contactName} · {deal.company}
                                </div>
                              </div>
                            </div>

                            {/* Value and Time Ago Row */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100/90 text-xs">
                              <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400">Opportunity</div>
                                <div className="font-bold text-slate-900 text-sm mt-0.5">
                                  ${deal.value.toLocaleString()}
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-[10px] uppercase font-bold text-slate-400">Expected</div>
                                <div className="font-semibold text-slate-700 text-xs mt-0.5">
                                  {deal.timeAgo || deal.expectedCloseDate}
                                </div>
                              </div>
                            </div>

                            {/* Action Item Pill / Tag if available */}
                            {deal.actionItems && deal.actionItems.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <div className="flex items-center space-x-1.5 text-slate-600 font-medium truncate">
                                  <span 
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: stage.color }}
                                  />
                                  <span className="truncate">{deal.actionItems[0].title}</span>
                                </div>
                              </div>
                            )}

                            {/* Quick Actions Toolbar */}
                            <div 
                              className="pt-2 border-t border-slate-100 flex items-center justify-between"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => onComposeEmailToContact(deal.contactEmail, deal.contactName, deal.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Send Email via Gmail"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onLaunchMeetingWithContact(deal.contactName, deal.contactEmail, `Demo: ${deal.title}`)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Schedule Google Meet"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onLocateOnMap(deal.company)}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="View on Google Maps"
                                >
                                  <MapPin className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onRunAiDiagnosis(deal)}
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Run Gemini AI Intelligence"
                                >
                                  <BrainCircuit className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Stage Mover Selector */}
                              <select
                                value={deal.stage}
                                onChange={(e) => handleStageChange(deal.id, e.target.value as DealStage)}
                                className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-1 px-1.5 rounded-lg focus:outline-none transition-colors duration-150 cursor-pointer"
                              >
                                {stages.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Active Drop Placeholder during drag over */}
                    {isDropTarget && draggedDealId && (
                      <div className="h-16 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 flex items-center justify-center text-xs font-semibold text-emerald-700 animate-pulse">
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
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col shadow-2xs">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#f7f5ed] border-b border-slate-200 sticky top-0 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
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
              <tbody className="divide-y divide-slate-100">
                {filteredDeals.map((deal) => {
                  const stageObj = stages.find(s => s.id === deal.stage) || defaultStages[0];
                  return (
                    <tr
                      key={deal.id}
                      onClick={() => onOpenDealDetail(deal)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-serif font-bold text-slate-900">{deal.company}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{deal.contactName}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">${deal.value.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span 
                          style={{ backgroundColor: stageObj.badgeBg, color: stageObj.badgeText }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          {stageObj.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{deal.expectedCloseDate}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{deal.assignedTo || 'Alex Rivera'}</td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenDealDetail(deal)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-[11px] transition-colors"
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

