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
  Settings,
  LayoutGrid,
  ShoppingBag,
  TrendingUp,
  Package,
  FolderKanban,
  Users,
  LifeBuoy,
  Home
} from 'lucide-react';
import { ViewType, NavastraApp, NavastraAppId, Deal, Lead } from '../types';
import { ErpLogoBadge } from './Logo';

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
  onNavigateHome
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);

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
          { label: 'Navastra', onClick: handleHomeRedirect, title: 'Navastra Homepage' },
          { label: 'ERP Settings', isCurrent: true }
        ];
      case 'app_store':
        return [
          { label: 'Navastra', onClick: handleHomeRedirect, title: 'Navastra Homepage' },
          { label: 'Enterprise App Store', isCurrent: true }
        ];
      case 'apps_grid':
      default:
        return [
          { label: 'Navastra', onClick: handleHomeRedirect, title: 'Navastra Homepage' },
          { label: 'All Applications Hub', isCurrent: true }
        ];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 bg-[#fbf9f4] px-5 lg:px-8 flex items-center justify-between z-10 shrink-0 select-none border-b border-slate-200/60 gap-4">
      {/* Left: Logo & Interactive Breadcrumbs */}
      <div className="flex items-center space-x-3.5 min-w-0">
        {/* Clickable Navastra Logo Badge - Redirects to Homepage / Dashboard */}
        <div className="flex items-center space-x-2">
          <ErpLogoBadge 
            size={38}
            onClick={handleHomeRedirect}
            title="Click to redirect to Homepage / Dashboard"
            className="shrink-0 cursor-pointer shadow-2xs hover:scale-105 transition-transform"
          />

          {/* Odoo App Launcher 9-dot Icon */}
          <button
            onClick={() => onNavigateToAppsHub ? onNavigateToAppsHub() : setShowAppSwitcher(!showAppSwitcher)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
              currentView === 'apps_grid' 
                ? 'bg-[#1c2237] text-emerald-400 ring-2 ring-emerald-500/30' 
                : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300'
            }`}
            title="Navastra App Launcher (All Applications)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Breadcrumbs (e.g. CRM / Lead / Aurora House) */}
        <div className="flex flex-col justify-center min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs lg:text-sm font-sans min-w-0">
            {breadcrumbs.map((crumb, index) => {
              const isLast = crumb.isCurrent || index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-slate-300 font-light text-xs shrink-0 select-none">/</span>
                  )}
                  {isLast ? (
                    <span 
                      id={`breadcrumb-current-page`}
                      className="font-serif text-base lg:text-xl font-bold text-slate-900 truncate tracking-tight"
                      title={crumb.label}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      id={`breadcrumb-crumb-${index}`}
                      onClick={crumb.onClick}
                      title={crumb.title || `Go to ${crumb.label}`}
                      className="text-xs lg:text-sm font-bold text-emerald-700 hover:text-emerald-900 uppercase tracking-wide hover:underline cursor-pointer transition-colors whitespace-nowrap"
                    >
                      {crumb.label}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
            India time · {dateString}
          </p>
        </div>
      </div>

      {/* Right Controls (Matches Image 1) */}
      <div className="flex items-center space-x-2.5 shrink-0">
        {/* App Store Shortcut */}
        {onNavigateToAppStore && (
          <button
            onClick={onNavigateToAppStore}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-full text-xs font-semibold shadow-2xs hover:border-emerald-400 hover:text-emerald-800 transition-all cursor-pointer"
            title="Install New Modules"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>App Store</span>
          </button>
        )}

        {/* + New Lead Dark Pill Button with Dropdown */}
        <div className="relative flex items-center">
          <div className="flex items-center bg-[#1c2237] hover:bg-[#28304c] text-white rounded-full shadow-xs transition-all divide-x divide-slate-700">
            <button
              id="header-new-lead-btn"
              onClick={onOpenNewLead}
              className="flex items-center space-x-1.5 pl-3.5 pr-2.5 py-2 text-xs font-semibold hover:text-emerald-400 transition-colors cursor-pointer"
              title="Add & Redirect to New Lead Dossier"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New lead</span>
            </button>
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="px-2 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 py-2 text-slate-700 animate-in fade-in zoom-in-95 duration-150 origin-top-right transition-all">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Quick Create
                </div>
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewLead(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-emerald-50/70 hover:text-emerald-900 flex items-center space-x-2.5 text-slate-700 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">New Lead (Full Dossier)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Open full dossier like Aurora House</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewDeal(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-indigo-50/70 hover:text-indigo-900 flex items-center space-x-2.5 text-slate-700 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-100/80 flex items-center justify-center text-indigo-700">
                    <Kanban className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">New Deal / Opportunity</div>
                    <div className="text-[10px] text-slate-500 font-normal">Add straight to pipeline stages</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewInvoice(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-blue-50/70 hover:text-blue-900 flex items-center space-x-2.5 text-slate-700 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">New Invoice</div>
                    <div className="text-[10px] text-slate-500 font-normal">Issue billing with ERP tracking</div>
                  </div>
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { setShowQuickMenu(false); onOpenNewMeeting(); }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-amber-50/70 hover:text-amber-900 flex items-center space-x-2.5 text-slate-700 transition-colors duration-150 rounded-xl mx-auto cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-700">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold">Schedule Google Meet</div>
                    <div className="text-[10px] text-slate-500 font-normal">Generate secure Meet link</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* CRM Settings Button */}
        {onOpenCrmSettings && (
          <button
            onClick={onOpenCrmSettings}
            className="w-8 h-8 rounded-full border border-slate-300/80 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="ERP Settings & Pipeline Colors"
          >
            <Settings className="w-4 h-4 text-slate-600" />
          </button>
        )}

        {/* High Thinking AI Button */}
        <button
          onClick={onOpenHighThinking}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 rounded-full text-xs font-semibold transition-all shadow-2xs group cursor-pointer"
          title="Gemini High Thinking Studio Reasoning"
        >
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span>High Thinking AI</span>
        </button>

        {/* User Initials Avatar in Warm Tan/Gold */}
        <div 
          onClick={onOpenCrmSettings}
          className="w-8 h-8 rounded-full bg-[#cca458] text-slate-900 font-bold text-xs flex items-center justify-center shadow-2xs shrink-0 select-none cursor-pointer hover:ring-2 hover:ring-slate-900/20 transition-all"
          title="Alex Rivera (AN) · Click for ERP Settings"
        >
          AN
        </div>
      </div>
    </header>
  );
};


