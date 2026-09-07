import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  HelpCircle, 
  Sparkles, 
  BrainCircuit, 
  Bot, 
  Kanban, 
  UserCheck, 
  Receipt, 
  Video, 
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Package,
  FolderKanban,
  Users,
  LifeBuoy,
  Home,
  Sun,
  Moon,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { ViewType, NavastraApp, NavastraAppId, Deal, Lead, ThemeMode } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenNewLead: () => void;
  onOpenNewDeal: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewMeeting: () => void;
  onOpenAiChat: () => void;
  onOpenHighThinking: () => void;
  onOpenCrmSettings?: () => void;
  onNavigateToAppsHub?: () => void;
  onNavigateToAppStore?: () => void;
  onLaunchApp?: (appId: NavastraAppId, view?: ViewType) => void;
  installedApps?: NavastraApp[];
  activeDetailEntity?: Deal | Lead | null;
  onClearDetailEntity?: () => void;
  onSelectView?: (view: ViewType) => void;
  onNavigateHome?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSearch,
  searchQuery,
  onOpenNewLead,
  onOpenNewDeal,
  onOpenNewInvoice,
  onOpenNewMeeting,
  onOpenAiChat,
  onOpenHighThinking,
  onOpenCrmSettings,
  onNavigateToAppsHub,
  onNavigateToAppStore,
  onLaunchApp,
  installedApps = [],
  activeDetailEntity,
  onClearDetailEntity,
  onSelectView,
  onNavigateHome,
  theme = 'light',
  onToggleTheme
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Formatted date subtitle matching screenshot
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleHomeRedirect = () => {
    if (onClearDetailEntity) onClearDetailEntity();
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onNavigateToAppsHub) {
      onNavigateToAppsHub();
    } else if (onSelectView) {
      onSelectView('apps_grid');
    }
  };

  const handleNavigateCrm = () => {
    if (onClearDetailEntity) onClearDetailEntity();
    if (onSelectView) onSelectView('pipeline');
  };

  const handleNavigateLeads = () => {
    if (onClearDetailEntity) onClearDetailEntity();
    if (onSelectView) onSelectView('leads');
  };

  // Build breadcrumb segments based on active view and entity
  interface BreadcrumbSegment {
    label: string;
    onClick?: () => void;
    isCurrent?: boolean;
    title?: string;
  }

  const getBreadcrumbs = (): BreadcrumbSegment[] => {
    // If a Lead / Deal full dossier page is open
    if (activeDetailEntity) {
      const isLead = 'temperature' in activeDetailEntity || 'status' in activeDetailEntity;
      const entityName = activeDetailEntity.company || ('title' in activeDetailEntity ? (activeDetailEntity as Deal).title : 'Lead Details');
      
      return [
        { 
          label: 'CRM', 
          onClick: handleNavigateCrm, 
          title: 'Go to CRM Pipeline & Overview' 
        },
        { 
          label: isLead ? 'Lead' : 'Deal', 
          onClick: isLead ? handleNavigateLeads : handleNavigateCrm, 
          title: isLead ? 'Go to Leads List' : 'Go to Pipeline Deals' 
        },
        { 
          label: entityName, 
          isCurrent: true, 
          title: entityName 
        }
      ];
    }

    // Standard view breadcrumbs
    switch (currentView) {
      case 'pipeline':
        return [
          { label: 'CRM', onClick: handleNavigateCrm, title: 'CRM Overview' },
          { label: 'Pipeline & Deals', isCurrent: true }
        ];
      case 'leads':
        return [
          { label: 'CRM', onClick: handleNavigateCrm, title: 'CRM Overview' },
          { label: 'Leads & Prospects', isCurrent: true }
        ];
      case 'dashboard':
        return [
          { label: 'CRM', onClick: handleNavigateCrm, title: 'CRM Overview' },
          { label: 'Executive Dashboard', isCurrent: true }
        ];
      case 'contacts':
        return [
          { label: 'CRM', onClick: handleNavigateCrm, title: 'CRM Overview' },
          { label: 'Contacts Directory', isCurrent: true }
        ];
      case 'accounts':
        return [
          { label: 'CRM', onClick: handleNavigateCrm, title: 'CRM Overview' },
          { label: 'Accounts & ERP', isCurrent: true }
        ];
      case 'invoices':
        return [
          { label: 'CRM', onClick: handleNavigateCrm, title: 'CRM Overview' },
          { label: 'Invoices & Billing', isCurrent: true }
        ];
      case 'sales_orders':
        return [
          { label: 'Sales', onClick: () => onSelectView?.('sales_orders'), title: 'Sales Module' },
          { label: 'Sales Orders', isCurrent: true }
        ];
      case 'inventory_stock':
        return [
          { label: 'Inventory', onClick: () => onSelectView?.('inventory_stock'), title: 'Inventory Module' },
          { label: 'Stock & Warehouses', isCurrent: true }
        ];
      case 'project_tasks':
        return [
          { label: 'Projects', onClick: () => onSelectView?.('project_tasks'), title: 'Projects Module' },
          { label: 'Tasks & Sprints', isCurrent: true }
        ];
      case 'hr_employees':
        return [
          { label: 'Human Resources', onClick: () => onSelectView?.('hr_employees'), title: 'HR Module' },
          { label: 'Employee Directory', isCurrent: true }
        ];
      case 'helpdesk_tickets':
        return [
          { label: 'Helpdesk', onClick: () => onSelectView?.('helpdesk_tickets'), title: 'Helpdesk Module' },
          { label: 'Support Queue', isCurrent: true }
        ];
      case 'gmail':
        return [
          { label: 'Google Workspace', onClick: () => onSelectView?.('gmail'), title: 'Workspace Suite' },
          { label: 'Google Mail', isCurrent: true }
        ];
      case 'calendar':
        return [
          { label: 'Google Workspace', onClick: () => onSelectView?.('calendar'), title: 'Workspace Suite' },
          { label: 'Google Calendar', isCurrent: true }
        ];
      case 'meet':
        return [
          { label: 'Google Workspace', onClick: () => onSelectView?.('meet'), title: 'Workspace Suite' },
          { label: 'Google Meet', isCurrent: true }
        ];
      case 'maps':
        return [
          { label: 'Google Workspace', onClick: () => onSelectView?.('maps'), title: 'Workspace Suite' },
          { label: 'Territory Maps', isCurrent: true }
        ];
      case 'settings':
        return [
          { label: 'Settings', isCurrent: true }
        ];
      case 'app_store':
        return [
          { label: 'Apps', onClick: handleHomeRedirect, title: 'App Launcher' },
          { label: 'Install Apps Store', isCurrent: true }
        ];
      case 'apps_grid':
      default:
        return [
          { label: 'App Launcher', isCurrent: true }
        ];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 bg-white dark:bg-[#111627] px-5 lg:px-8 flex items-center justify-between z-10 shrink-0 select-none border-b border-slate-200/90 dark:border-slate-800 gap-4 transition-colors duration-200">
      {/* Left: Dynamic Breadcrumbs */}
      <div className="flex items-center min-w-0">
        <div className="flex flex-col justify-center min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs lg:text-sm font-sans min-w-0">
            {breadcrumbs.map((crumb, index) => {
              const isLast = crumb.isCurrent || index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-slate-300 dark:text-slate-650 font-light text-xs shrink-0 select-none">/</span>
                  )}
                  {isLast ? (
                    <span 
                      id={`breadcrumb-current-page`}
                      className="font-serif text-base lg:text-xl font-bold text-slate-900 dark:text-white truncate tracking-tight"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      id={`breadcrumb-crumb-${index}`}
                      onClick={crumb.onClick}
                      title={crumb.title || `Go to ${crumb.label}`}
                      className="text-xs lg:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 uppercase tracking-wide hover:underline cursor-pointer transition-colors whitespace-nowrap"
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
            India time · {dateString}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5 shrink-0">
        {/* Theme Toggle Button (Light / Dark mode) */}
        {onToggleTheme && (
          <button
            id="theme-toggle-header-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-[#1a233c] dark:hover:bg-[#232f50] text-slate-700 dark:text-amber-300 transition-all shadow-2xs group cursor-pointer active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        )}

        {/* + New Lead Dark Pill Button with Dropdown */}
        <div className="relative flex items-center">
          <div className="flex items-center bg-[#1c2237] hover:bg-[#28304c] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-full shadow-xs transition-all divide-x divide-slate-700 dark:divide-emerald-700">
            <button
              id="header-new-lead-btn"
              onClick={onOpenNewLead}
              className="flex items-center space-x-1.5 pl-3.5 pr-2.5 py-2 text-xs font-semibold hover:text-emerald-300 transition-colors cursor-pointer"
              title="Add & Redirect to New Lead Dossier"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New lead</span>
            </button>
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="px-2 py-2 text-slate-400 dark:text-white/80 hover:text-white transition-colors cursor-pointer"
              title="More Actions"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {showQuickMenu && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowQuickMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#182138] border border-slate-200/90 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-2xl z-30 py-2 text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 origin-top-right transition-all">
                <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider">
                  Quick Create
                </div>
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewLead(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">New Lead (Full Dossier)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Open full dossier like Aurora House</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewDeal(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-100/80 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                    <Kanban className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">New Deal / Opportunity</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Add straight to pipeline stages</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewInvoice(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-blue-50/70 dark:hover:bg-blue-950/40 hover:text-blue-900 dark:hover:text-blue-300 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100/80 dark:bg-blue-900/60 flex items-center justify-center text-blue-700 dark:text-blue-300">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">New Invoice</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Issue billing with ERP tracking</div>
                  </div>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700/60 my-1" />
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewMeeting(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-amber-50/70 dark:hover:bg-amber-950/40 hover:text-amber-900 dark:hover:text-amber-300 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100/80 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Schedule Google Meet</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Generate secure Meet link</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* High Thinking AI Button */}
        <button
          onClick={onOpenHighThinking}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-[#182138] hover:bg-slate-50 dark:hover:bg-[#202c4b] text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 rounded-full text-xs font-semibold transition-all shadow-2xs group cursor-pointer"
          title="Gemini High Thinking Studio Reasoning"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>High Thinking AI</span>
        </button>

        {/* User Initials Avatar in Warm Tan/Gold with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full bg-[#cca458] text-slate-900 font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 select-none cursor-pointer hover:ring-2 hover:ring-[#cca458]/60 transition-all relative"
            title="Alex Rivera (AN) - Profile & Theme"
          >
            AN
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
          </button>

          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#161e33] border border-slate-200/90 dark:border-slate-700 rounded-3xl shadow-2xl z-50 p-4 text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 origin-top-right transition-all">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-2xl bg-[#cca458] text-slate-950 font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                    AN
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        Alex Rivera
                      </h4>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      alex.rivera@navastra.io
                    </p>
                  </div>
                </div>

                <div className="py-2.5 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onOpenCrmSettings) onOpenCrmSettings();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-left transition-colors flex items-center space-x-2.5 cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Profile Settings</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Manage account & stage configs</div>
                    </div>
                  </button>

                  <div className="pt-1 px-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                        {theme === 'dark' ? <Moon className="w-3 h-3 text-amber-400" /> : <Sun className="w-3 h-3 text-amber-500" />}
                        <span>Theme Option</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {theme}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#0f1525] rounded-xl border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          if (theme === 'dark' && onToggleTheme) onToggleTheme();
                        }}
                        className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sun className="w-3 h-3 text-amber-500" />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (theme === 'light' && onToggleTheme) onToggleTheme();
                        }}
                        className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-white'
                        }`}
                      >
                        <Moon className="w-3 h-3 text-amber-400" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onNavigateToAppsHub) onNavigateToAppsHub();
                    }}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Go to Homepage
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onOpenCrmSettings) onOpenCrmSettings();
                    }}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};


