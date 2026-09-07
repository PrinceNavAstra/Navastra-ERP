import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Check,
  Plus,
  Sparkles,
  BrainCircuit,
  Video,
  MapPin,
  Building2,
  User,
  Clock,
  CheckCircle2,
  Send,
  FileText,
  Flame,
  ExternalLink,
  MessageSquare,
  Activity,
  DollarSign,
  AlertCircle,
  Palette,
  Edit3,
  Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Deal, Lead, DealStage, Priority, ActionItem, ActivityEvent, StageColorConfig } from '../types';

interface LeadDetailPageProps {
  leadOrDeal: Deal | Lead;
  stageConfigs?: StageColorConfig[];
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToCrm?: () => void;
  onNavigateToLeads?: () => void;
  onSaveLead?: (lead: Lead) => void;
  onUpdateStage?: (stage: DealStage) => void;
  onUpdateNotes?: (notes: string) => void;
  onComposeEmail: (email: string, name: string, contextId?: string) => void;
  onLaunchMeeting: (name: string, email: string, title: string) => void;
  onLocateOnMap: (company: string) => void;
  onRunHighThinking: (deal: Deal) => void;
  onOpenAiChat?: () => void;
  onOpenCrmSettings?: () => void;
}

const defaultStages: StageColorConfig[] = [
  { id: 'lead_in', label: 'NEW', color: '#4b5563', badgeBg: '#f3f4f6', badgeText: '#374151', barColor: '#6b7280' },
  { id: 'qualified', label: 'QUALIFIED', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8', barColor: '#3b82f6' },
  { id: 'proposal_sent', label: 'PROPOSAL', color: '#d97706', badgeBg: '#fffbeb', badgeText: '#b45309', barColor: '#f59e0b' },
  { id: 'negotiation', label: 'NEGOTIATION', color: '#7c3aed', badgeBg: '#f5f3ff', badgeText: '#6d28d9', barColor: '#8b5cf6' },
  { id: 'closed_won', label: 'WON', color: '#16a34a', badgeBg: '#f0fdf4', badgeText: '#15803d', barColor: '#22c55e' },
  { id: 'closed_lost', label: 'LOST', color: '#dc2626', badgeBg: '#fef2f2', badgeText: '#b91c1c', barColor: '#ef4444' }
];

export const LeadDetailPage: React.FC<LeadDetailPageProps> = ({
  leadOrDeal,
  stageConfigs = defaultStages,
  onBack,
  onNavigateToHome,
  onNavigateToCrm,
  onNavigateToLeads,
  onSaveLead,
  onUpdateStage,
  onUpdateNotes,
  onComposeEmail,
  onLaunchMeeting,
  onLocateOnMap,
  onRunHighThinking,
  onOpenAiChat,
  onOpenCrmSettings
}) => {
  const isDeal = 'value' in leadOrDeal && typeof (leadOrDeal as Deal).value === 'number';
  const isInitiallyBlank = !leadOrDeal.company || leadOrDeal.company.trim() === '' || leadOrDeal.id.startsWith('lead-new') || leadOrDeal.id.startsWith('lead-blank');

  // Interactive Form State
  const [isEditing, setIsEditing] = useState<boolean>(isInitiallyBlank);
  const [companyName, setCompanyName] = useState<string>(leadOrDeal.company || '');
  const [contactName, setContactName] = useState<string>(
    ('contactName' in leadOrDeal ? (leadOrDeal as Deal).contactName : (leadOrDeal as Lead).name) || ''
  );
  const [contactEmail, setContactEmail] = useState<string>(
    ('contactEmail' in leadOrDeal ? (leadOrDeal as Deal).contactEmail : (leadOrDeal as Lead).email) || ''
  );
  const [contactPhone, setContactPhone] = useState<string>(
    ('contactPhone' in leadOrDeal ? (leadOrDeal as Deal).contactPhone : ('phone' in leadOrDeal ? (leadOrDeal as Lead).phone : '')) || ''
  );
  const [value, setValue] = useState<number>(
    isDeal ? (leadOrDeal as Deal).value : ((leadOrDeal as Lead).estimatedValue || 0)
  );
  const [expectedClose, setExpectedClose] = useState<string>(
    ('expectedCloseDate' in leadOrDeal ? leadOrDeal.expectedCloseDate : 'Mar 18, 2025') || 'Mar 18, 2025'
  );
  const [assignedTo, setAssignedTo] = useState<string>(leadOrDeal.assignedTo || 'Alex Rivera');
  const [priority, setPriority] = useState<Priority | string>(
    ('priority' in leadOrDeal ? leadOrDeal.priority : (leadOrDeal as Lead).temperature === 'Hot' ? 'high' : 'medium') || 'high'
  );
  const [source, setSource] = useState<string>(
    ('source' in leadOrDeal ? leadOrDeal.source : 'Referral') || 'Referral'
  );
  const [industry, setIndustry] = useState<string>('Enterprise Hospitality');
  const [territory, setTerritory] = useState<string>('San Francisco, USA');
  const [winProbability, setWinProbability] = useState<string>('88%');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state if leadOrDeal changes
  useEffect(() => {
    const isBlank = !leadOrDeal.company || leadOrDeal.company.trim() === '' || leadOrDeal.id.startsWith('lead-new') || leadOrDeal.id.startsWith('lead-blank');
    setIsEditing(isBlank);
    setCompanyName(leadOrDeal.company || '');
    setContactName(('contactName' in leadOrDeal ? (leadOrDeal as Deal).contactName : (leadOrDeal as Lead).name) || '');
    setContactEmail(('contactEmail' in leadOrDeal ? (leadOrDeal as Deal).contactEmail : (leadOrDeal as Lead).email) || '');
    setContactPhone(('contactPhone' in leadOrDeal ? (leadOrDeal as Deal).contactPhone : ('phone' in leadOrDeal ? (leadOrDeal as Lead).phone : '')) || '');
    setValue(isDeal ? (leadOrDeal as Deal).value : ((leadOrDeal as Lead).estimatedValue || 0));
    setNotes(leadOrDeal.notes || '');
  }, [leadOrDeal.id]);

  // Compute initials & avatars
  const avatarInitials = companyName
    ? companyName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : contactName
      ? contactName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : 'NL';

  const ownerInitials = assignedTo ? assignedTo.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AR';
  const avatarBg = leadOrDeal.avatarBg || '#d4a853';

  // Pipeline stages from config or default
  const pipelineStages: StageColorConfig[] = stageConfigs && stageConfigs.length > 0 ? stageConfigs : defaultStages;
  const currentStage: DealStage = ('stage' in leadOrDeal ? (leadOrDeal as Deal).stage : 'lead_in') || 'lead_in';
  const [activeStage, setActiveStage] = useState<DealStage>(currentStage);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'comments' | 'ai'>('overview');

  // Next actions state
  const initialActions: ActionItem[] = leadOrDeal.actionItems && leadOrDeal.actionItems.length > 0
    ? leadOrDeal.actionItems
    : [
      { id: 'act-1', title: 'Send customized enterprise proposal with Google Workspace SLA', dueDate: 'Tomorrow, 2:00 PM', completed: false, type: 'proposal' },
      { id: 'act-2', title: 'Schedule Google Meet product walkthrough with ' + (contactName || 'lead'), dueDate: 'Mar 12, 10:30 AM', completed: false, type: 'meeting' },
      { id: 'act-3', title: 'Verify multi-currency billing requirements for European properties', dueDate: 'Mar 14, 4:00 PM', completed: true, type: 'review' }
    ];

  const [actionItems, setActionItems] = useState<ActionItem[]>(initialActions);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [isAddingAction, setIsAddingAction] = useState(false);

  // Activities & Comments state
  const initialActivities: ActivityEvent[] = leadOrDeal.activities && leadOrDeal.activities.length > 0
    ? leadOrDeal.activities
    : [
      { id: 'ev-1', type: 'email', title: 'Inbound Inquiry Received', description: `${contactName || 'Lead'} reached out via referral link regarding CRM rollout.`, date: 'Today at 09:15 AM', author: contactName || 'System' },
      { id: 'ev-2', type: 'note', title: 'Initial Qualification Note', description: `Budget approved ($${(value || 0).toLocaleString()}). Looking to deploy by end of quarter.`, date: 'Today at 10:30 AM', author: assignedTo },
      { id: 'ev-3', type: 'stage_change', title: 'Stage Updated to New', description: `Lead captured and assigned to ${assignedTo}.`, date: 'Today at 10:35 AM', author: 'System' }
    ];

  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);
  const [comments, setComments] = useState<{ id: string; author: string; text: string; date: string }[]>(
    leadOrDeal.comments || [{ id: 'c-1', author: assignedTo, text: 'Executive sponsor is highly responsive. Scheduled preliminary discovery call.', date: '2 hours ago' }]
  );
  const [newComment, setNewComment] = useState('');

  // Strategic Notes
  const [notes, setNotes] = useState(leadOrDeal.notes || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>(
    ('aiAnalysis' in leadOrDeal ? (leadOrDeal as Deal).aiAnalysis : '') ||
    ('aiInsights' in leadOrDeal ? (leadOrDeal as Lead).aiInsights : '') ||
    'High conversion velocity. Decision maker is actively evaluating Google Workspace integration and team collaboration workflows.'
  );

  const currentStageIndex = pipelineStages.findIndex(s => s.id === activeStage);
  const stageDisplayNum = Math.max(1, currentStageIndex + 1);

  const handleStageSelect = (stageId: DealStage) => {
    setActiveStage(stageId);
    if (onUpdateStage) {
      onUpdateStage(stageId);
    }
    if (stageId === 'closed_won') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'stage_change',
      title: `Stage Changed to ${stageId.replace('_', ' ').toUpperCase()}`,
      description: `Pipeline stage updated by ${assignedTo}`,
      date: 'Just now',
      author: assignedTo
    };
    setActivities([newActivity, ...activities]);
  };

  const handleToggleAction = (id: string) => {
    setActionItems(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;

    const newAct: ActionItem = {
      id: `act-${Date.now()}`,
      title: newActionTitle.trim(),
      dueDate: 'This week',
      completed: false,
      type: 'review'
    };
    setActionItems([newAct, ...actionItems]);
    setNewActionTitle('');
    setIsAddingAction(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newC = {
      id: `c-${Date.now()}`,
      author: assignedTo || 'Alex Rivera',
      text: newComment.trim(),
      date: 'Just now'
    };
    setComments([newC, ...comments]);
    setNewComment('');
  };

  const handleRunAiEnrichment = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setAiAnalysis(`AI Insights for ${companyName || 'Lead'}: Strategic opportunity with strong executive engagement. Recommend prioritizing tailored proposal with Google Workspace integration SLA.`);
      setIsGeneratingAi(false);
    }, 800);
  };

  // Save Lead Function
  const handleSaveLead = () => {
    const finalCompany = companyName.trim() || 'New Lead';
    const finalContact = contactName.trim() || 'Primary Contact';

    const updatedLead: Lead = {
      id: leadOrDeal.id.startsWith('lead-') ? leadOrDeal.id : `lead-${Date.now()}`,
      name: finalContact,
      company: finalCompany,
      title: 'Managing Director',
      email: contactEmail.trim() || `${finalContact.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: contactPhone.trim() || '+1 415 555 0149',
      estimatedValue: Number(value) || 0,
      status: activeStage === 'closed_won' || activeStage === 'qualified' ? 'Qualified' : activeStage === 'closed_lost' ? 'Unqualified' : activeStage === 'proposal_sent' ? 'Proposal' : 'New',
      temperature: priority === 'high' || priority === 'urgent' ? 'Hot' : 'Warm',
      source: source,
      assignedTo: assignedTo,
      city: territory.split(',')[0] || 'San Francisco',
      country: territory.split(',')[1]?.trim() || 'USA',
      notes: notes,
      score: 85,
      avatarInitials: avatarInitials,
      avatarBg: avatarBg,
      createdAt: 'createdAt' in leadOrDeal ? leadOrDeal.createdAt : new Date().toISOString().split('T')[0],
      actionItems: actionItems,
      activities: activities,
      comments: comments
    };

    if (onSaveLead) {
      onSaveLead(updatedLead);
    }
    if (onUpdateNotes) {
      onUpdateNotes(notes);
    }

    setSavedSuccess(true);
    setIsEditing(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });

    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  const displayBreadcrumbName = companyName.trim() || (isInitiallyBlank ? 'New Lead' : 'Lead Details');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/90 dark:bg-[#0b0f19] p-4 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto transition-colors duration-200">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            id="back-to-pipeline-btn"
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors py-1.5 px-3.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 bg-white/80 dark:bg-[#111827]/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs cursor-pointer"
            title="Back to previous view"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
            <span>Back</span>
          </button>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              id="save-lead-btn-top"
              onClick={handleSaveLead}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#2d7d56] hover:bg-[#236344] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Lead</span>
            </button>
          ) : (
            <button
              id="edit-lead-btn-top"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
              <span>Edit Details</span>
            </button>
          )}

          <button
            onClick={() => onComposeEmail(contactEmail, contactName, leadOrDeal.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
            <span>Send Gmail</span>
          </button>
          <button
            onClick={() => onLaunchMeeting(contactName || 'Lead', contactEmail, `${companyName || 'Lead'} Executive Demo`)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Launch Meet</span>
          </button>
          <button
            onClick={() => onLocateOnMap(companyName || 'San Francisco')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Map Location</span>
          </button>
          {isDeal && (
            <button
              onClick={() => onRunHighThinking(leadOrDeal as Deal)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#1c2237] hover:bg-[#27304d] text-white rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4a853]" />
              <span>AI High Thinking</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Success Banner */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Lead successfully saved and registered into CRM Pipeline!</span>
          </div>
          <button
            onClick={() => setSavedSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 underline text-[11px] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Top Banner Card (Matches Image 1) */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-250/70 dark:border-slate-700/80 p-6 lg:p-8 shadow-xs space-y-6 transition-colors duration-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Avatar & Title Details */}
          <div className="flex items-start space-x-5 flex-1 min-w-0">
            {/* Square/Rounded Initials Avatar in Tan/Gold */}
            <div
              style={{ backgroundColor: avatarBg }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-slate-900 font-bold text-2xl shadow-2xs shrink-0 tracking-tight select-none"
            >
              {avatarInitials}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      id="input-lead-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Company Name (e.g. Aurora House)"
                      className="font-serif text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      autoFocus={isInitiallyBlank}
                    />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f4ed] dark:bg-emerald-500/10 text-[#2d7d56] dark:text-emerald-300 border border-[#c4e8d7] dark:border-emerald-500/30 shrink-0">
                      {activeStage === 'lead_in' ? 'New' : activeStage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Contact Name (e.g. Mina Ellis)"
                      className="text-xs text-slate-700 dark:text-slate-100 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email (e.g. mina@aurorahouse.co)"
                      className="text-xs text-slate-700 dark:text-slate-100 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Phone (e.g. +1 415 555 0149)"
                      className="text-xs text-slate-700 dark:text-slate-100 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <h1 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {companyName || 'Unnamed Company'}
                    </h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f4ed] dark:bg-emerald-500/10 text-[#2d7d56] dark:text-emerald-300 border border-[#c4e8d7] dark:border-emerald-500/30">
                      {activeStage === 'lead_in' ? 'New' : activeStage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {contactName || 'Primary Contact'} · {companyName || 'Company'}
                  </div>

                  {/* Contact Icons */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-300 pt-0.5">
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="flex items-center space-x-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
                        <span>{contactEmail}</span>
                      </a>
                    )}
                    {contactPhone && (
                      <a
                        href={`tel:${contactPhone}`}
                        className="flex items-center space-x-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" />
                        <span>{contactPhone}</span>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Metrics 2x2 Grid (Matches Image 1) */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-slate-700 pt-4 lg:pt-0 lg:pl-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                OPPORTUNITY
              </div>
              {isEditing ? (
                <div className="flex items-center mt-0.5">
                  <span className="text-slate-400 dark:text-slate-300 font-bold text-sm mr-1">$</span>
                  <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="12800"
                    className="w-24 px-2 py-0.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  ${(value || 0).toLocaleString()}
                </div>
              )}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                EXPECTED CLOSE
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={expectedClose}
                  onChange={(e) => setExpectedClose(e.target.value)}
                  placeholder="Mar 18, 2025"
                  className="w-28 px-2 py-0.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-900 dark:text-white mt-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              ) : (
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {expectedClose}
                </div>
              )}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                OWNER
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#cca458] text-slate-900 text-[10px] font-bold flex items-center justify-center select-none">
                  {ownerInitials}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-24 px-2 py-0.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                ) : (
                  <span className="dark:text-slate-100">{assignedTo}</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                PRIORITY
              </div>
              {isEditing ? (
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="mt-0.5 px-2 py-0.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 capitalize flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${priority === 'urgent' || priority === 'high' ? 'bg-red-500' :
                    priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                  <span>{priority}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline Progress Stepper (Matches Image 1) */}
        <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <span className="text-slate-700 font-bold">Pipeline Progress</span>
              {onOpenCrmSettings && (
                <button
                  onClick={onOpenCrmSettings}
                  className="flex items-center space-x-1 text-[11px] text-[#cca458] hover:text-[#b8934b] font-semibold transition-colors ml-2 cursor-pointer"
                  title="Configure Stage Colors in CRM Settings"
                >
                  <Palette className="w-3 h-3" />
                  <span>Edit Colors</span>
                </button>
              )}
            </div>
            <span className="text-slate-500 font-medium">
              {stageDisplayNum} of {pipelineStages.length} · {pipelineStages[currentStageIndex]?.label || activeStage.toUpperCase()}
            </span>
          </div>

          {/* Stepper Segments */}
          <div className="grid grid-cols-6 gap-2">
            {pipelineStages.map((stage, idx) => {
              const isPastOrActive = idx <= currentStageIndex;
              const isCurrent = stage.id === activeStage;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  className="group flex flex-col items-start space-y-1.5 text-left focus:outline-none transition-all cursor-pointer"
                >
                  <span
                    style={{
                      color: isCurrent ? stage.color : isPastOrActive ? '#334155' : '#94a3b8'
                    }}
                    className={`text-[10px] font-bold tracking-wider transition-colors truncate max-w-full`}
                  >
                    {stage.label}
                  </span>
                  <div
                    style={{
                      backgroundColor: isCurrent
                        ? (stage.barColor || stage.color)
                        : isPastOrActive
                          ? `${stage.color}88`
                          : '#e2e8f0'
                    }}
                    className="w-full h-2 rounded-full transition-all duration-300 shadow-2xs"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs (Matches Image 1) */}
      <div className="flex items-center space-x-6 border-b border-slate-200/80 px-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${activeTab === 'overview'
            ? 'text-[#2d7d56] border-b-2 border-[#2d7d56]'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 text-xs font-bold transition-all flex items-center space-x-1.5 relative cursor-pointer ${activeTab === 'activity'
            ? 'text-[#2d7d56] border-b-2 border-[#2d7d56]'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <span>Activity</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-semibold">
            {activities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 text-xs font-bold transition-all flex items-center space-x-1.5 relative cursor-pointer ${activeTab === 'comments'
            ? 'text-[#2d7d56] border-b-2 border-[#2d7d56]'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <span>Comments</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-semibold">
            {comments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 text-xs font-bold transition-all flex items-center space-x-1.5 relative cursor-pointer ${activeTab === 'ai'
            ? 'text-[#2d7d56] border-b-2 border-[#2d7d56]'
            : 'text-slate-500 hover:text-slate-800'
            }`}
        >
          <Sparkles className="w-3 h-3 text-[#d4a853]" />
          <span>Gemini Intelligence</span>
        </button>
      </div>

      {/* Main Content Two-Column Grid (Matches Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Deal & Prospect Summary (Matches Image 1) */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/70 pb-3">
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">Prospect & Deal Dossier</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Source:</span>
                    {isEditing ? (
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="text-xs bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 font-semibold text-slate-800 dark:text-slate-100"
                      >
                        <option value="Referral">Referral</option>
                        <option value="Inbound">Inbound</option>
                        <option value="Website">Website</option>
                        <option value="Cold Outreach">Cold Outreach</option>
                        <option value="Partner">Partner</option>
                        <option value="Event">Event</option>
                      </select>
                    ) : (
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{source}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Strategic Notes & Qualification Context</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      if (onUpdateNotes) onUpdateNotes(e.target.value);
                    }}
                    placeholder="Enter prospect qualification notes, business requirements, and strategic context..."
                    className="w-full p-3.5 bg-slate-50 dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400">INDUSTRY & MODEL</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g. Enterprise Hospitality"
                        className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 w-full"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{industry}</div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400">TERRITORY</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={territory}
                        onChange={(e) => setTerritory(e.target.value)}
                        placeholder="e.g. San Francisco, USA"
                        className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 w-full"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{territory}</div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400">WIN PROBABILITY</div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={winProbability}
                        onChange={(e) => setWinProbability(e.target.value)}
                        placeholder="e.g. 88%"
                        className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 w-full"
                      />
                    ) : (
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{winProbability} (High Velocity)</div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSaveLead}
                      className="px-5 py-2 bg-[#2d7d56] hover:bg-[#236344] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Lead Details</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Key Stakeholder Card */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/70 pb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">Key Stakeholder & Champion</h3>
                  </div>
                  <button
                    onClick={() => onComposeEmail(contactEmail, contactName, leadOrDeal.id)}
                    className="text-xs font-bold text-[#2d7d56] hover:underline cursor-pointer"
                  >
                    Compose Email
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-100 text-sm select-none">
                      {avatarInitials}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{contactName || 'Primary Contact'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {contactEmail || 'No email provided'} · {contactPhone || 'No phone provided'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLaunchMeeting(contactName || 'Lead', contactEmail, `${companyName || 'Lead'} Sync`)}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Launch Google Meet"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onComposeEmail(contactEmail, contactName, leadOrDeal.id)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Send Gmail"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/70 pb-3">
                Engagement & Activity Timeline
              </h3>
              <div className="space-y-4">
                {activities.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200/60 dark:border-slate-700">
                    <div className="p-2 bg-white dark:bg-[#111827] rounded-xl shadow-2xs shrink-0 text-slate-700 dark:text-slate-200">
                      {item.type === 'email' && <Mail className="w-4 h-4 text-indigo-600" />}
                      {item.type === 'call' && <Phone className="w-4 h-4 text-emerald-600" />}
                      {item.type === 'meeting' && <Video className="w-4 h-4 text-amber-600" />}
                      {item.type === 'stage_change' && <CheckCircle2 className="w-4 h-4 text-[#2d7d56]" />}
                      {item.type === 'note' && <FileText className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{item.description}</p>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-semibold">Author: {item.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/70 pb-3">
                Internal Team Comments
              </h3>

              <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add an internal note or tag a colleague..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1c2237] hover:bg-[#28304d] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Post Note
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {comments.map((c) => (
                  <div key={c.id} className="p-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{c.author}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/70 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#d4a853]" />
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">Gemini AI Strategy Advisor</h3>
                </div>
                <button
                  onClick={handleRunAiEnrichment}
                  disabled={isGeneratingAi}
                  className="px-3 py-1.5 bg-[#1c2237] text-white rounded-full text-xs font-semibold hover:bg-[#28304d] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAi ? 'Analyzing...' : 'Re-run AI Analysis'}
                </button>
              </div>

              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <BrainCircuit className="w-4 h-4 text-amber-700" />
                  <span>Closing Strategy Recommendation</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {aiAnalysis}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200/70 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Key Differentiator</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">Native Google Workspace integration & automated dispatch routing</div>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200/70 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Next Recommended Step</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">Present customized contract terms with multi-year tier discount</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Next Actions & Attributes (Matches Image 1) */}
        <div className="space-y-6">
          {/* Next Actions Card (Matches Image 1) */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/70 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Next actions</h3>
              <button
                onClick={() => setIsAddingAction(!isAddingAction)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Add Next Action"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add action inline form */}
            {isAddingAction && (
              <form onSubmit={handleAddAction} className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <input
                  type="text"
                  placeholder="Task title (e.g. Send proposal)..."
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAction(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#1c2237] text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            )}

            {/* Actions List (Matches Image 1 with round radio-style check buttons) */}
            <div className="space-y-3">
              {actionItems.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleToggleAction(action.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start space-x-3 group ${action.completed
                    ? 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700 opacity-75'
                    : 'bg-white dark:bg-[#0f172a] border-slate-200/80 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 hover:shadow-xs shadow-2xs'
                    }`}
                >
                  <button
                    type="button"
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all duration-200 transform group-hover:scale-105 active:scale-95 cursor-pointer ${action.completed
                      ? 'bg-[#2d7d56] border-[#2d7d56] text-white shadow-2xs'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0f172a] text-transparent group-hover:border-[#2d7d56]'
                      }`}
                  >
                    <Check className={`w-3 h-3 stroke-[3] transition-transform duration-150 ${action.completed ? 'scale-100' : 'scale-0'}`} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-snug transition-all duration-200 ${action.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                      }`}>
                      {action.title}
                    </p>
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-400" />
                      <span>{action.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Drafting Widget */}
          <div className="bg-[#1c2237] text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#d4a853] text-slate-900 flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">One-Click Closing Drafter</h4>
                <p className="text-[11px] text-slate-400">Gemini AI generates executive proposals</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Generate a personalized proposal email to {contactName || 'the prospect'} highlighting Google Workspace synergies and volume discounts.
            </p>

            <button
              onClick={() => onComposeEmail(contactEmail, contactName, leadOrDeal.id)}
              className="w-full py-2 bg-[#d4a853] hover:bg-[#c49843] text-slate-900 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Draft Proposal in Gmail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
