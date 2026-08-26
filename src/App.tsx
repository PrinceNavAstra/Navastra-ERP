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
  NavastraApp,
  NavastraAppId
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
import { LeadsView } from './components/LeadsView';
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
import { InventoryAppView } from './components/apps/InventoryAppView';
import { ProjectsAppView } from './components/apps/ProjectsAppView';
import { HrAppView } from './components/apps/HrAppView';
import { HelpdeskAppView } from './components/apps/HelpdeskAppView';
import { SettingsAppView } from './components/apps/SettingsAppView';

// Modals
import { NewDealModal } from './components/modals/NewDealModal';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { NewContactModal } from './components/modals/NewContactModal';
import { NewInvoiceModal } from './components/modals/NewInvoiceModal';
import { DealDetailModal } from './components/modals/DealDetailModal';
import { CrmSettingsModal } from './components/modals/CrmSettingsModal';

const defaultStageColors: StageColorConfig[] = [
  { id: 'lead_in', label: 'NEW', color: '#4b5563', badgeBg: '#f3f4f6', badgeText: '#374151', barColor: '#6b7280' },
  { id: 'qualified', label: 'QUALIFIED', color: '#2563eb', badgeBg: '#eff6ff', badgeText: '#1d4ed8', barColor: '#3b82f6' },
  { id: 'proposal_sent', label: 'PROPOSAL', color: '#d97706', badgeBg: '#fffbeb', badgeText: '#b45309', barColor: '#f59e0b' },
  { id: 'negotiation', label: 'NEGOTIATION', color: '#7c3aed', badgeBg: '#f5f3ff', badgeText: '#6d28d9', barColor: '#8b5cf6' },
  { id: 'closed_won', label: 'WON', color: '#16a34a', badgeBg: '#f0fdf4', badgeText: '#15803d', barColor: '#22c55e' },
  { id: 'closed_lost', label: 'LOST', color: '#dc2626', badgeBg: '#fef2f2', badgeText: '#b91c1c', barColor: '#ef4444' }
];

export default function App() {
  // Modular Apps Registry State
  const [apps, setApps] = useState<NavastraApp[]>(() => {
    try {
      const saved = localStorage.getItem('navastra_apps_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load apps from storage', e);
    }
    return initialNavastraApps;
  });

  // Navigation & Layout
  const [currentView, setCurrentView] = useState<ViewType>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailEntity, setActiveDetailEntity] = useState<Deal | Lead | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

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

  // Primary CRM & ERP State
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [emails, setEmails] = useState<EmailMessage[]>(initialEmails);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [meetings, setMeetings] = useState<GoogleMeeting[]>(initialMeetings);

  // Gemini AI Drawers & Modals
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isHighThinkingOpen, setIsHighThinkingOpen] = useState(false);
  const [selectedDealForHighThinking, setSelectedDealForHighThinking] = useState<Deal | null>(null);

  // Entity Modals
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<Deal | null>(null);

  // App Install / Uninstall Handlers
  const handleInstallApp = (appId: NavastraAppId) => {
    setApps(prev => {
      const updated = prev.map(a => a.id === appId ? { ...a, isInstalled: true } : a);
      try {
        localStorage.setItem('navastra_apps_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist app install', e);
      }
      return updated;
    });
  };

  const handleUninstallApp = (appId: NavastraAppId) => {
    setApps(prev => {
      const updated = prev.map(a => a.id === appId ? { ...a, isInstalled: false } : a);
      try {
        localStorage.setItem('navastra_apps_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist app uninstall', e);
      }
      return updated;
    });
  };

  const handleLaunchApp = (appId: NavastraAppId, defaultView?: ViewType) => {
    setActiveDetailEntity(null);
    if (appId === 'crm') {
      setCurrentView('pipeline');
    } else if (appId === 'app_store') {
      setCurrentView('app_store');
    } else if (appId === 'settings') {
      setCurrentView('settings');
    } else if (defaultView) {
      setCurrentView(defaultView);
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

  // Create Deal
  const handleCreateDeal = (newDealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...newDealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDeals([newDeal, ...deals]);
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
      stage: updatedLead.status === 'Won' ? 'closed_won' : updatedLead.status === 'Lost' ? 'closed_lost' : 'lead_in',
      expectedCloseDate: 'Mar 30, 2025',
      assignedTo: updatedLead.assignedTo || 'Alex Rivera',
      priority: updatedLead.temperature === 'Hot' ? 'high' : 'medium',
      source: updatedLead.source || 'Referral',
      avatarInitials: updatedLead.avatarInitials || (updatedLead.company ? updatedLead.company.slice(0, 2).toUpperCase() : 'NL'),
      avatarBg: updatedLead.avatarBg || '#d4a853',
      notes: updatedLead.notes || '',
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

  // Create Lead and Redirect to Detail Page
  const handleCreateLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads([newLead, ...leads]);
    setIsNewLeadOpen(false);
    setActiveDetailEntity(newLead);
  };

  // Save Stage Colors
  const handleSaveStageConfigs = (newConfigs: StageColorConfig[]) => {
    setStageConfigs(newConfigs);
    try {
      localStorage.setItem('omni_stage_configs', JSON.stringify(newConfigs));
    } catch (e) {
      console.warn('Failed to persist stage configs', e);
    }
  };

  // Reset Stage Colors to Default
  const handleResetStageConfigs = () => {
    setStageConfigs(defaultStageColors);
    try {
      localStorage.removeItem('omni_stage_configs');
    } catch (e) {
      console.warn('Failed to clear stage configs', e);
    }
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
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Left Sidebar */}
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
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onOpenCrmSettings={() => setCurrentView('settings')}
        installedApps={apps}
        onNavigateToAppsHub={handleGoHome}
        onNavigateHome={handleGoHome}
        onNavigateToAppStore={() => {
          setActiveDetailEntity(null);
          setCurrentView('app_store');
        }}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Logo Home Redirect & Interactive Breadcrumbs */}
        <Header
          currentView={currentView}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onOpenNewDeal={() => setIsNewDealOpen(true)}
          onOpenNewLead={handleOpenNewLeadFullPage}
          onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
          onOpenNewMeeting={() => setCurrentView('meet')}
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
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto bg-[#fbf9f4]">
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
                  onOpenNewLead={handleOpenNewLeadFullPage}
                  onOpenNewDeal={() => setIsNewDealOpen(true)}
                  onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
                  pipelineTotal={pipelineTotal}
                  activeDealsCount={activeDealsCount}
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
                    onOpenNewDeal={() => setIsNewDealOpen(true)}
                    onOpenInvoice={() => setCurrentView('invoices')}
                  />
                </div>
              )}

              {currentView === 'inventory_stock' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <InventoryAppView />
                </div>
              )}

              {currentView === 'project_tasks' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <ProjectsAppView />
                </div>
              )}

              {currentView === 'hr_employees' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <HrAppView />
                </div>
              )}

              {currentView === 'helpdesk_tickets' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <HelpdeskAppView />
                </div>
              )}

              {currentView === 'settings' && (
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                  <SettingsAppView 
                    stageColors={stageConfigs}
                    onUpdateStageColors={handleSaveStageConfigs}
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
                  onOpenNewDeal={() => setIsNewDealOpen(true)}
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
                  onOpenNewLead={handleOpenNewLeadFullPage}
                  onOpenLeadDetail={(lead) => setActiveDetailEntity(lead)}
                  onConvertLeadToDeal={handleConvertLeadToDeal}
                  onComposeEmail={handleComposeEmailToContact}
                  onLaunchMeeting={handleLaunchMeetingWithContact}
                  onLocateOnMap={handleLocateOnMap}
                  onEnrichLeadWithAi={(lead) => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onOpenNewContact={() => setIsNewContactOpen(true)}
                  onComposeEmail={handleComposeEmailToContact}
                  onLaunchMeeting={handleLaunchMeetingWithContact}
                  onLocateOnMap={handleLocateOnMap}
                  onGenerateDossier={(contact) => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'accounts' && (
                <AccountsView
                  accounts={accounts}
                  onOpenNewAccount={() => setIsNewContactOpen(true)}
                  onLocateOnMap={handleLocateOnMap}
                  onRunAiAccountAudit={(acc) => setIsAiChatOpen(true)}
                />
              )}

              {currentView === 'invoices' && (
                <InvoicesView
                  invoices={invoices}
                  onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
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

      {/* Draggable & Dockable AI Copilot Chat Bot Bubble */}
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

      {/* Creation & Detail Modals */}
      <NewDealModal
        isOpen={isNewDealOpen}
        onClose={() => setIsNewDealOpen(false)}
        onCreateDeal={handleCreateDeal}
      />

      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onCreateLead={handleCreateLead}
      />

      <NewContactModal
        isOpen={isNewContactOpen}
        onClose={() => setIsNewContactOpen(false)}
        onCreateContact={handleCreateContact}
      />

      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoice}
      />

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
        onResetDefaults={handleResetStageConfigs}
      />
    </div>
  );
}

