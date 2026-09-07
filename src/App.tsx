import React, { useState, useEffect } from 'react';
import {
  ViewType,
  Deal,
  Lead,
  Contact,
  Account,
  Invoice,
  EmailMessage,
  CalendarEvent,
  GoogleMeeting,
  DealStage,
  InvoiceStatus,
  StageColorConfig,
  LeadStageColorConfig,
  LeadStatus,
  NavastraApp,
  NavastraAppId,
  ThemeMode
} from './types';
import {
  initialDeals,
  initialLeads,
  initialContacts,
  initialAccounts,
  initialInvoices,
  initialEmails,
  initialCalendarEvents,
  initialMeetings
} from './data/initialData';
import { initialNavastraApps } from './data/appsData';

// Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NavastraAppsDashboard } from './components/NavastraAppsDashboard';
import { NavastraAppStore } from './components/NavastraAppStore';
import { DashboardView } from './components/DashboardView';
import { PipelineView } from './components/PipelineView';
import { LeadsView, defaultLeadStages } from './components/LeadsView';
import { ContactsView } from './components/ContactsView';
import { AccountsView } from './components/AccountsView';
import { InvoicesView } from './components/InvoicesView';
import { GoogleMailView } from './components/GoogleMailView';
import { GoogleCalendarView } from './components/GoogleCalendarView';
import { GoogleMeetView } from './components/GoogleMeetView';
import { GoogleMapsView } from './components/GoogleMapsView';
import { GeminiChatDrawer } from './components/GeminiChatDrawer';
import { HighThinkingModal } from './components/HighThinkingModal';
import { LeadDetailPage } from './components/LeadDetailPage';
import { DraggableAiCopilot } from './components/DraggableAiCopilot';

// Modular Apps
import { SalesAppView } from './components/apps/SalesAppView';
import { PurchaseAppView } from './components/apps/PurchaseAppView';
import { AccountingAppView } from './components/apps/AccountingAppView';
import { PosAppView } from './components/apps/PosAppView';
import { SettingsAppView } from './components/apps/SettingsAppView';

// Modals
import { DealDetailModal } from './components/modals/DealDetailModal';
import { CrmSettingsModal } from './components/modals/CrmSettingsModal';

const defaultStageColors: StageColorConfig[] = [
  { id: 'lead_in', label: 'NEW', color: '#00a5e5', badgeBg: '#e0f2fe', badgeText: '#0284c7', barColor: '#0ea5e9' },
  { id: 'qualified', label: 'QUALIFIED', color: '#6366f1', badgeBg: '#eff6ff', badgeText: '#4338ca', barColor: '#818cf8' },
  { id: 'proposal_sent', label: 'PROPOSAL', color: '#f59e0b', badgeBg: '#fffbeb', badgeText: '#b45309', barColor: '#fbbf24' },
  { id: 'negotiation', label: 'NEGOTIATION', color: '#8b5cf6', badgeBg: '#f5f3ff', badgeText: '#6d28d9', barColor: '#8b5cf6' },
  { id: 'closed_won', label: 'WON', color: '#22c55e', badgeBg: '#f0fdf4', badgeText: '#15803d', barColor: '#4ade80' },
  { id: 'closed_lost', label: 'LOST', color: '#f87171', badgeBg: '#fef2f2', badgeText: '#b91c1c', barColor: '#ef4444' }
];

export default function App() {
  const APP_STORAGE_KEY = 'navastra_apps_v1';
  const DUMMY_DATA_KEY = 'navastra_dummy_data_enabled';
  const DUMMY_DATA_DELETED_KEY = 'navastra_dummy_data_deleted';

  const saveAppsRegistry = (nextApps: NavastraApp[]) => {
    try {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(nextApps));
    } catch (e) {
      console.warn('Failed to persist app registry locally', e);
    }

    fetch('/api/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextApps),
    }).catch(() => {
      // Ignore server-side persistence failures in local-only mode.
    });
  };

  const [apps, setApps] = useState<NavastraApp[]>(initialNavastraApps);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const stored = localStorage.getItem(APP_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as NavastraApp[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApps(parsed);
            return;
          }
        }

        const serverResponse = await fetch('/api/apps');
        if (serverResponse.ok) {
          const serverApps = await serverResponse.json() as NavastraApp[];
          if (Array.isArray(serverApps) && serverApps.length > 0) {
            setApps(serverApps);
            localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(serverApps));
          }
        }
      } catch (e) {
        console.warn('Failed to load apps from storage or server', e);
      }
    };

    loadApps();
  }, []);

  // Navigation & Layout
  const [currentView, setCurrentView] = useState<ViewType>('apps_grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailEntity, setActiveDetailEntity] = useState<Deal | Lead | null>(null);

  // Theme & Appearance Mode (dark / light)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('omnicrm_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Failed to load theme preference', e);
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('omnicrm_theme', theme);
    } catch (e) {
      console.warn('Failed to persist theme', e);
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getDummyDataState = () => {
    try {
      const deleted = localStorage.getItem(DUMMY_DATA_DELETED_KEY) === 'true';
      const enabled = localStorage.getItem(DUMMY_DATA_KEY) === 'true';
      return { enabled: !deleted && enabled, deleted };
    } catch (e) {
      console.warn('Failed to load dummy data preference', e);
      return { enabled: false, deleted: false };
    }
  };

  const dummyDataState = getDummyDataState();
  const [dummyDataEnabled, setDummyDataEnabled] = useState<boolean>(dummyDataState.enabled);
  const [dummyDataDeleted, setDummyDataDeleted] = useState<boolean>(dummyDataState.deleted);

  useEffect(() => {
    try {
      localStorage.setItem(DUMMY_DATA_KEY, String(dummyDataEnabled));
      localStorage.setItem(DUMMY_DATA_DELETED_KEY, String(dummyDataDeleted));
    } catch (e) {
      console.warn('Failed to persist dummy data preference', e);
    }
  }, [dummyDataEnabled, dummyDataDeleted]);

  const applyDummyDataSet = (enabled: boolean) => {
    if (!enabled) {
      setDeals([]);
      setLeads([]);
      setContacts([]);
      setAccounts([]);
      setInvoices([]);
      setEmails([]);
      setCalendarEvents([]);
      setMeetings([]);
      return;
    }

    setDeals(initialDeals);
    setLeads(initialLeads);
    setContacts(initialContacts);
    setAccounts(initialAccounts);
    setInvoices(initialInvoices);
    setEmails(initialEmails);
    setCalendarEvents(initialCalendarEvents);
    setMeetings(initialMeetings);
  };

  const handleToggleDummyData = (enabled: boolean) => {
    if (dummyDataDeleted && enabled) return;
    setDummyDataEnabled(enabled);
    if (!enabled) {
      setDummyDataDeleted(false);
    }
    applyDummyDataSet(enabled);
  };

  const handleDeleteDummyData = () => {
    const confirmed = window.confirm('Delete all dummy ERP data permanently? This action cannot be undone and the dummy data will never return for this workspace.');
    if (!confirmed) return;

    setDummyDataEnabled(false);
    setDummyDataDeleted(true);
    applyDummyDataSet(false);
  };

  // CRM Settings & Stage Colors
  const [isCrmSettingsOpen, setIsCrmSettingsOpen] = useState<boolean>(false);
  const [stageConfigs, setStageConfigs] = useState<StageColorConfig[]>(() => {
    try {
      const saved = localStorage.getItem('omni_stage_configs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load stage configs from storage', e);
    }
    return defaultStageColors;
  });

  // Staging-wise Colors for Leads
  const [leadStageConfigs, setLeadStageConfigs] = useState<LeadStageColorConfig[]>(() => {
    try {
      const saved = localStorage.getItem('omni_lead_stage_configs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lead stage configs from storage', e);
    }
    return defaultLeadStages;
  });

  // Primary CRM & ERP State
  const [deals, setDeals] = useState<Deal[]>(() => (dummyDataState.enabled ? initialDeals : []));
  const [leads, setLeads] = useState<Lead[]>(() => (dummyDataState.enabled ? initialLeads : []));
  const [contacts, setContacts] = useState<Contact[]>(() => (dummyDataState.enabled ? initialContacts : []));
  const [accounts, setAccounts] = useState<Account[]>(() => (dummyDataState.enabled ? initialAccounts : []));
  const [invoices, setInvoices] = useState<Invoice[]>(() => (dummyDataState.enabled ? initialInvoices : []));
  const [emails, setEmails] = useState<EmailMessage[]>(() => (dummyDataState.enabled ? initialEmails : []));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => (dummyDataState.enabled ? initialCalendarEvents : []));
  const [meetings, setMeetings] = useState<GoogleMeeting[]>(() => (dummyDataState.enabled ? initialMeetings : []));

  // Gemini AI Drawers & Modals
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isHighThinkingOpen, setIsHighThinkingOpen] = useState(false);
  const [selectedDealForHighThinking, setSelectedDealForHighThinking] = useState<Deal | null>(null);

  // Entity detail tracking only; creation popups are intentionally disabled.
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<Deal | null>(null);

  // App Install / Uninstall Handlers
  const handleInstallApp = (appId: NavastraAppId) => {
    setApps(prev => {
      const updated = prev.map(a => a.id === appId ? { ...a, isInstalled: true } : a);
      saveAppsRegistry(updated);
      return updated;
    });
  };

  const handleUninstallApp = (appId: NavastraAppId) => {
    setApps(prev => {
      const updated = prev.map(a => a.id === appId ? { ...a, isInstalled: false } : a);
      saveAppsRegistry(updated);
      return updated;
    });
  };

  const handleLaunchApp = (appId: NavastraAppId, defaultView?: ViewType) => {
    setActiveDetailEntity(null);
    if (defaultView) {
      setCurrentView(defaultView);
    } else if (appId === 'crm') {
      setCurrentView('pipeline');
    } else if (appId === 'app_store') {
      setCurrentView('app_store');
    } else if (appId === 'settings') {
      setCurrentView('settings');
    } else if (appId === 'sales') {
      setCurrentView('sales_orders');
    } else if (appId === 'purchase') {
      setCurrentView('purchase');
    } else if (appId === 'accounting') {
      setCurrentView('accounting');
    } else if (appId === 'pos') {
      setCurrentView('pos');
    } else {
      setCurrentView('pipeline');
    }
  };

  // Global Deal Stage Updater
  const handleUpdateDealStage = (dealId: string, newStage: DealStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] } : d));
    if (selectedDealForDetail && selectedDealForDetail.id === dealId) {
      setSelectedDealForDetail(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  // Deal Notes Updater
  const handleUpdateDealNotes = (dealId: string, notes: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, notes, updatedAt: new Date().toISOString().split('T')[0] } : d));
  };

  // Direct Open New Deal (Full detail page with blank fields ready for user input)
  const handleOpenNewDealFullPage = () => {
    const blankDeal: Deal = {
      id: `deal-new-${Date.now()}`,
      title: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      value: 0,
      stage: 'lead_in',
      probability: 35,
      expectedCloseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
      priority: 'medium',
      source: 'Referral',
      avatarInitials: 'ND',
      avatarBg: '#d4a853',
      timeAgo: 'Just now',
      city: 'San Francisco',
      country: 'USA',
      lat: 37.7749,
      lng: -122.4194,
      notes: '',
      tags: ['New Deal'],
      assignedTo: 'Alex Rivera',
      aiScore: 0,
      aiAnalysis: '',
      actionItems: [
        { id: `act-${Date.now()}-1`, title: 'Confirm stakeholder and budget fit', dueDate: 'Tomorrow, 2:00 PM', completed: false, type: 'review' },
        { id: `act-${Date.now()}-2`, title: 'Schedule discovery call with the prospect', dueDate: 'Mar 15, 11:00 AM', completed: false, type: 'meeting' }
      ],
      activities: [
        { id: `ev-${Date.now()}-1`, type: 'note', title: 'New Deal Draft Created', description: 'Deal initialized by Alex Rivera in Navastra CRM.', date: 'Today at 09:00 AM', author: 'Alex Rivera' }
      ],
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setActiveDetailEntity(blankDeal);
  };

  // Direct Open New Lead (Full Dossier Page with blank fields ready for user input)
  const handleOpenNewLeadFullPage = () => {
    const blankLead: Lead = {
      id: `lead-new-${Date.now()}`,
      name: '',
      company: '',
      title: '',
      email: '',
      phone: '',
      estimatedValue: 0,
      status: 'New',
      temperature: 'Warm',
      source: 'Referral',
      assignedTo: 'Alex Rivera',
      city: 'San Francisco',
      country: 'USA',
      notes: '',
      score: 75,
      avatarInitials: 'NL',
      avatarBg: '#d4a853',
      createdAt: new Date().toISOString().split('T')[0],
      actionItems: [
        { id: `act-${Date.now()}-1`, title: 'Schedule preliminary discovery call with champion', dueDate: 'Tomorrow, 2:00 PM', completed: false, type: 'meeting' },
        { id: `act-${Date.now()}-2`, title: 'Send customized enterprise proposal with Google Workspace SLA', dueDate: 'Mar 15, 11:00 AM', completed: false, type: 'proposal' }
      ],
      activities: [
        { id: `ev-${Date.now()}-1`, type: 'note', title: 'Draft Lead Created', description: 'Lead initialized by Alex Rivera in Navastra CRM.', date: 'Today at 09:00 AM', author: 'Alex Rivera' }
      ],
      comments: []
    };

    setActiveDetailEntity(blankLead);
  };

  // Save / Update Lead from Detail Page
  const handleSaveLeadDetail = (updatedLead: Lead) => {
    setLeads(prev => {
      const exists = prev.some(l => l.id === updatedLead.id);
      if (exists) {
        return prev.map(l => l.id === updatedLead.id ? updatedLead : l);
      }
      return [updatedLead, ...prev];
    });

    // Also sync or create corresponding deal for pipeline view
    const correspondingDeal: Deal = {
      id: `deal-${updatedLead.id}`,
      title: `${updatedLead.company || 'New Lead'} Opportunity`,
      company: updatedLead.company || 'Unnamed Company',
      contactName: updatedLead.name || 'Primary Contact',
      contactEmail: updatedLead.email || '',
      contactPhone: updatedLead.phone || '',
      value: updatedLead.estimatedValue || 0,
      stage: updatedLead.status === 'Qualified' ? 'qualified' : updatedLead.status === 'Proposal' ? 'proposal_sent' : updatedLead.status === 'Unqualified' ? 'closed_lost' : 'lead_in',
      probability: updatedLead.status === 'Qualified' ? 70 : updatedLead.status === 'Proposal' ? 85 : 40,
      expectedCloseDate: 'Mar 30, 2025',
      assignedTo: updatedLead.assignedTo || 'Alex Rivera',
      priority: updatedLead.temperature === 'Hot' ? 'high' : 'medium',
      source: updatedLead.source || 'Referral',
      avatarInitials: updatedLead.avatarInitials || (updatedLead.company ? updatedLead.company.slice(0, 2).toUpperCase() : 'NL'),
      avatarBg: updatedLead.avatarBg || '#d4a853',
      notes: updatedLead.notes || '',
      tags: ['Inbound', 'Enterprise'],
      createdAt: updatedLead.createdAt,
      updatedAt: new Date().toISOString().split('T')[0],
      actionItems: updatedLead.actionItems,
      activities: updatedLead.activities,
      comments: updatedLead.comments
    };

    setDeals(prev => {
      const exists = prev.some(d => d.id === correspondingDeal.id || (d.company && d.company === updatedLead.company));
      if (exists) {
        return prev.map(d => (d.id === correspondingDeal.id || (d.company && d.company === updatedLead.company)) ? correspondingDeal : d);
      }
      return [correspondingDeal, ...prev];
    });

    setActiveDetailEntity(updatedLead);
  };

  // Create Lead is redirected directly to the main page without any popup.
  const handleCreateLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads([newLead, ...leads]);
    setActiveDetailEntity(null);
    setCurrentView('apps_grid');
  };

  // Save Stage Colors for Deals
  const handleSaveStageConfigs = (newConfigs: StageColorConfig[]) => {
    setStageConfigs(newConfigs);
    try {
      localStorage.setItem('omni_stage_configs', JSON.stringify(newConfigs));
    } catch (e) {
      console.warn('Failed to persist stage configs', e);
    }
  };

  // Save Stage Colors for Leads
  const handleSaveLeadStageConfigs = (newConfigs: LeadStageColorConfig[]) => {
    setLeadStageConfigs(newConfigs);
    try {
      localStorage.setItem('omni_lead_stage_configs', JSON.stringify(newConfigs));
    } catch (e) {
      console.warn('Failed to persist lead stage configs', e);
    }
  };

  // Reset Stage Colors to Default
  const handleResetStageConfigs = () => {
    setStageConfigs(defaultStageColors);
    setLeadStageConfigs(defaultLeadStages);
    try {
      localStorage.removeItem('omni_stage_configs');
      localStorage.removeItem('omni_lead_stage_configs');
    } catch (e) {
      console.warn('Failed to clear stage configs', e);
    }
  };

  // Update Lead Status / Stage
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
  };

  // Convert Lead to Deal & Account
  const handleConvertLeadToDeal = (lead: Lead) => {
    const convertedDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: `${lead.company} - Enterprise Rollout`,
      company: lead.company,
      contactName: lead.name,
      contactEmail: lead.email,
      value: lead.estimatedValue || 65000,
      stage: 'qualified',
      probability: 60,
      expectedCloseDate: '2026-10-15',
      priority: lead.temperature === 'Hot' ? 'urgent' : 'high',
      notes: `Converted from inbound lead. Original notes: ${lead.notes}`,
      tags: ['Converted Lead', lead.company],
      assignedTo: lead.assignedTo || 'Alex Rivera',
      aiScore: lead.score || 85,
      aiAnalysis: 'Successfully converted from high-intent inbound prospect.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setDeals([convertedDeal, ...deals]);
    setLeads(leads.filter(l => l.id !== lead.id));
    setCurrentView('pipeline');
  };

  // Create Contact
  const handleCreateContact = (newContactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: `contact-${Date.now()}`
    };
    setContacts([newContact, ...contacts]);
  };

  // Create Invoice
  const handleCreateInvoice = (newInvoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...newInvoiceData,
      id: `inv-${Date.now()}`
    };
    setInvoices([newInvoice, ...invoices]);
  };

  // Update Invoice Status
  const handleUpdateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status, paidAt: status === 'Paid' ? new Date().toISOString().split('T')[0] : inv.paidAt } : inv));
  };

  // Send Email
  const handleSendEmail = (newEmail: Omit<EmailMessage, 'id' | 'date'>) => {
    const email: EmailMessage = {
      ...newEmail,
      id: `mail-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setEmails([email, ...emails]);
  };

  // Add Calendar Event
  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`
    };
    setCalendarEvents([event, ...calendarEvents]);
  };

  // Schedule Google Meet Meeting
  const handleScheduleMeeting = (meetingData: Omit<GoogleMeeting, 'id' | 'status'>) => {
    const meet: GoogleMeeting = {
      ...meetingData,
      id: `meet-${Date.now()}`,
      status: 'upcoming'
    };
    setMeetings([meet, ...meetings]);

    handleAddCalendarEvent({
      title: meet.title,
      start: `${meet.scheduledDate}T10:00:00`,
      end: `${meet.scheduledDate}T11:00:00`,
      location: 'Google Meet',
      attendees: meet.attendees,
      description: meet.agenda,
      meetLink: meet.meetUrl,
      type: 'meeting'
    });
  };

  // Direct 1-Click Action Handlers
  const handleComposeEmailToContact = (email: string, name: string, dealId?: string) => {
    setCurrentView('gmail');
  };

  const handleLaunchMeetingWithContact = (name: string, email: string, title: string) => {
    handleScheduleMeeting({
      title,
      hostName: 'Alex Rivera',
      hostEmail: 'alex.r@navastra.enterprise',
      attendees: [email],
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '11:00 AM PST',
      durationMinutes: 45,
      meetUrl: `https://meet.google.com/navastra-${Math.random().toString(36).substring(2, 6)}`,
      meetingCode: `navastra-${Math.random().toString(36).substring(2, 6)}`,
      agenda: `Enterprise platform review with ${name}`,
      aiTalkingPoints: ['Review architectural alignment', 'Address compliance & security', 'Agree on next milestone']
    });
    setCurrentView('meet');
  };

  const handleLocateOnMap = (locationQuery: string) => {
    setCurrentView('maps');
  };

  const handleRunHighThinkingForDeal = (deal: Deal) => {
    setSelectedDealForHighThinking(deal);
    setIsHighThinkingOpen(true);
  };

  // Filtered lists if search query is active
  const filteredDeals = searchQuery
    ? deals.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.company.toLowerCase().includes(searchQuery.toLowerCase()))
    : deals;

  const unreadEmailsCount = emails.filter(e => e.folder === 'inbox' && !e.isRead).length;
  const activeDealsCount = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length;
  const pipelineTotal = deals.reduce((s, d) => s + d.value, 0);

  const handleGoHome = () => {
    setActiveDetailEntity(null);
    setSelectedDealForDetail(null);
    setCurrentView('apps_grid');
  };

  const handleGoCrm = () => {
    setActiveDetailEntity(null);
    setSelectedDealForDetail(null);
    setCurrentView('pipeline');
  };

  const handleGoLeads = () => {
    setActiveDetailEntity(null);
    setSelectedDealForDetail(null);
    setCurrentView('leads');
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans overflow-hidden ${theme === 'dark' ? 'dark' : ''} transition-colors duration-200`}>
      {/* Left Sidebar - hidden on homepage */}
      {currentView !== 'apps_grid' && (
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setActiveDetailEntity(null);
            setCurrentView(v);
          }}
          openAiChat={() => setIsAiChatOpen(true)}
          openHighThinking={() => { setSelectedDealForHighThinking(deals[0]); setIsHighThinkingOpen(true); }}
          unreadEmailsCount={unreadEmailsCount}
          activeDealsCount={activeDealsCount}
          onOpenCrmSettings={() => setCurrentView('settings')}
          installedApps={apps}
          onNavigateToAppsHub={handleGoHome}
          onNavigateHome={handleGoHome}
          onNavigateToAppStore={() => {
            setActiveDetailEntity(null);
            setCurrentView('app_store');
          }}
          theme={theme}
        />
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - hidden on homepage */}
        {currentView !== 'apps_grid' && (
          <Header
            currentView={currentView}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onOpenNewDeal={handleGoHome}
            onOpenNewLead={handleGoHome}
            onOpenNewInvoice={handleGoHome}
            onOpenNewMeeting={handleGoHome}
            onOpenAiChat={() => setIsAiChatOpen(true)}
            onOpenHighThinking={() => { setSelectedDealForHighThinking(deals[0]); setIsHighThinkingOpen(true); }}
            onOpenCrmSettings={() => setCurrentView('settings')}
            onNavigateToAppsHub={handleGoHome}
            onNavigateHome={handleGoHome}
            onNavigateToAppStore={() => {
              setActiveDetailEntity(null);
              setCurrentView('app_store');
            }}
            onLaunchApp={handleLaunchApp}
            installedApps={apps}
            activeDetailEntity={activeDetailEntity}
            onClearDetailEntity={() => setActiveDetailEntity(null)}
            onSelectView={(v) => {
              setActiveDetailEntity(null);
              setCurrentView(v);
            }}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}

        {/* View Switcher Container */}
        <main className={`flex-1 overflow-y-auto ${currentView === 'apps_grid' ? 'bg-transparent' : 'bg-slate-50/95 dark:bg-[#0b0f19]'} kanban-scroll transition-colors duration-200`}>
          {activeDetailEntity ? (
            <LeadDetailPage
              leadOrDeal={activeDetailEntity}
              stageConfigs={stageConfigs}
              onBack={() => setActiveDetailEntity(null)}
              onNavigateToHome={handleGoHome}
              onNavigateToCrm={handleGoCrm}
              onNavigateToLeads={handleGoLeads}
              onSaveLead={handleSaveLeadDetail}
              onUpdateStage={(stage) => {
                handleUpdateDealStage(activeDetailEntity.id, stage as DealStage);
              }}
              onComposeEmail={handleComposeEmailToContact}
              onLaunchMeeting={handleLaunchMeetingWithContact}
              onLocateOnMap={handleLocateOnMap}
              onRunHighThinking={(entity) => {
                const deal = deals.find(d => d.id === entity.id) || deals[0];
                setSelectedDealForHighThinking(deal);
                setIsHighThinkingOpen(true);
              }}
              onOpenAiChat={() => setIsAiChatOpen(true)}
              onOpenCrmSettings={() => setCurrentView('settings')}
            />
          ) : (
            <>
              {/* Odoo-Style App Hub / Matrix */}
              {currentView === 'apps_grid' && (
                <NavastraAppsDashboard
                  apps={apps}
                  onLaunchApp={handleLaunchApp}
                  onOpenAppStore={() => setCurrentView('app_store')}
                  onOpenSettings={() => setCurrentView('settings')}
                  onOpenNewLead={handleGoHome}
                  onOpenNewDeal={handleGoHome}
                  onOpenNewInvoice={handleGoHome}
                  pipelineTotal={pipelineTotal}
                  activeDealsCount={activeDealsCount}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                  onSetTheme={setTheme}
                />
              )}

              {/* Navastra App Store & Module Manager */}
              {currentView === 'app_store' && (
                <NavastraAppStore
                  apps={apps}
                  onInstallApp={handleInstallApp}
                  onUninstallApp={handleUninstallApp}
                  onLaunchApp={handleLaunchApp}
                  onBackToDashboard={() => setCurrentView('apps_grid')}
                />
              )}

              {/* Installed Modules */}
              {currentView === 'sales_orders' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <SalesAppView
                    onOpenNewDeal={handleGoHome}
                    onOpenInvoice={() => setCurrentView('invoices')}
                  />
                </div>
              )}

              {currentView === 'purchase' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <PurchaseAppView />
                </div>
              )}

              {currentView === 'accounting' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <AccountingAppView />
                </div>
              )}

              {currentView === 'pos' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <PosAppView />
                </div>
              )}

              {currentView === 'settings' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <SettingsAppView
                    stageColors={stageConfigs}
                    onUpdateStageColors={handleSaveStageConfigs}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    onSetTheme={setTheme}
                    dummyDataEnabled={dummyDataEnabled}
                    dummyDataDeleted={dummyDataDeleted}
                    onToggleDummyData={handleToggleDummyData}
                    onDeleteDummyData={handleDeleteDummyData}
                  />
                </div>
              )}

              {/* CRM Base Modules */}
              {currentView === 'dashboard' && (
                <DashboardView
                  deals={filteredDeals}
                  leads={leads}
                  invoices={invoices}
                  meetings={meetings}
                  onSelectView={setCurrentView}
                  onOpenDeal={(deal) => setActiveDetailEntity(deal)}
                  onOpenHighThinking={() => { setSelectedDealForHighThinking(deals[0]); setIsHighThinkingOpen(true); }}
                  onOpenAiChat={() => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'pipeline' && (
                <PipelineView
                  deals={filteredDeals}
                  stageConfigs={stageConfigs}
                  onUpdateDealStage={handleUpdateDealStage}
                  onOpenNewDeal={handleGoHome}
                  onOpenDealDetail={(deal) => setActiveDetailEntity(deal)}
                  onComposeEmailToContact={handleComposeEmailToContact}
                  onLaunchMeetingWithContact={handleLaunchMeetingWithContact}
                  onLocateOnMap={handleLocateOnMap}
                  onRunAiDiagnosis={(deal) => setActiveDetailEntity(deal)}
                  onOpenCrmSettings={() => setCurrentView('settings')}
                />
              )}

              {currentView === 'leads' && (
                <LeadsView
                  leads={leads}
                  stageConfigs={leadStageConfigs}
                  onOpenNewLead={handleGoHome}
                  onOpenLeadDetail={(lead) => setActiveDetailEntity(lead)}
                  onConvertLeadToDeal={handleConvertLeadToDeal}
                  onComposeEmail={handleComposeEmailToContact}
                  onLaunchMeeting={handleLaunchMeetingWithContact}
                  onLocateOnMap={handleLocateOnMap}
                  onEnrichLeadWithAi={(lead) => setIsAiChatOpen(true)}
                  onUpdateLeadStatus={handleUpdateLeadStatus}
                  onOpenCrmSettings={() => setIsCrmSettingsOpen(true)}
                />
              )}

              {currentView === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onOpenNewContact={handleGoHome}
                  onComposeEmail={handleComposeEmailToContact}
                  onLaunchMeeting={handleLaunchMeetingWithContact}
                  onLocateOnMap={handleLocateOnMap}
                  onGenerateDossier={(contact) => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'accounts' && (
                <AccountsView
                  accounts={accounts}
                  onOpenNewAccount={handleGoHome}
                  onLocateOnMap={handleLocateOnMap}
                  onRunAiAccountAudit={(acc) => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'invoices' && (
                <InvoicesView
                  invoices={invoices}
                  onOpenNewInvoice={handleGoHome}
                  onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                  onAuditInvoiceWithAi={(inv) => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'gmail' && (
                <GoogleMailView
                  emails={emails}
                  onSendEmail={handleSendEmail}
                  onLaunchMeetingWithAttendee={handleLaunchMeetingWithContact}
                  onOpenAiChat={() => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'calendar' && (
                <GoogleCalendarView
                  events={calendarEvents}
                  onAddEvent={handleAddCalendarEvent}
                />
              )}

              {currentView === 'meet' && (
                <GoogleMeetView
                  meetings={meetings}
                  onScheduleMeeting={handleScheduleMeeting}
                  onOpenAiChat={() => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'maps' && (
                <GoogleMapsView
                  accounts={accounts}
                  leads={leads}
                  contacts={contacts}
                  onComposeEmail={handleComposeEmailToContact}
                  onLaunchMeeting={handleLaunchMeetingWithContact}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Draggable & Dockable AI Copilot Chat Bot Bubble - hidden on homepage */}
      {currentView !== 'apps_grid' && (
        <DraggableAiCopilot
          onOpenHighThinking={() => setIsHighThinkingOpen(true)}
          crmContext={{
            activeDealsCount: deals.length,
            pipelineTotal: deals.reduce((s, d) => s + d.value, 0),
            urgentDeals: deals.filter(d => d.priority === 'urgent').map(d => ({ title: d.title, company: d.company, value: d.value, stage: d.stage })),
            upcomingMeetings: meetings.map(m => ({ title: m.title, time: m.scheduledTime, attendees: m.attendees })),
            overdueInvoices: invoices.filter(i => i.status === 'Overdue')
          }}
        />
      )}

      {/* Multi-Turn Gemini AI Copilot Drawer */}
      <GeminiChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        crmContext={{
          activeDealsCount: deals.length,
          pipelineTotal: deals.reduce((s, d) => s + d.value, 0),
          urgentDeals: deals.filter(d => d.priority === 'urgent').map(d => ({ title: d.title, company: d.company, value: d.value, stage: d.stage })),
          upcomingMeetings: meetings.map(m => ({ title: m.title, time: m.scheduledTime, attendees: m.attendees })),
          overdueInvoices: invoices.filter(i => i.status === 'Overdue')
        }}
      />

      {/* Gemini High Thinking Reasoning Studio */}
      <HighThinkingModal
        isOpen={isHighThinkingOpen}
        onClose={() => setIsHighThinkingOpen(false)}
        deals={deals}
        preSelectedDeal={selectedDealForHighThinking}
      />

      {/* Creation modals removed: all create actions redirect to the main page */}
      <DealDetailModal
        deal={selectedDealForDetail}
        isOpen={!!selectedDealForDetail}
        onClose={() => setSelectedDealForDetail(null)}
        onUpdateStage={handleUpdateDealStage}
        onUpdateNotes={handleUpdateDealNotes}
        onComposeEmail={handleComposeEmailToContact}
        onLaunchMeeting={handleLaunchMeetingWithContact}
        onLocateOnMap={handleLocateOnMap}
        onRunHighThinkingForDeal={handleRunHighThinkingForDeal}
      />

      {/* CRM Settings & Pipeline Stage Colors Modal */}
      <CrmSettingsModal
        isOpen={isCrmSettingsOpen}
        onClose={() => setIsCrmSettingsOpen(false)}
        stageConfigs={stageConfigs}
        onSaveStageConfigs={handleSaveStageConfigs}
        leadStageConfigs={leadStageConfigs}
        onSaveLeadStageConfigs={handleSaveLeadStageConfigs}
        onResetDefaults={handleResetStageConfigs}
      />
    </div>
  );
}

