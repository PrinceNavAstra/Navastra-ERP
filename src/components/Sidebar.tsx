import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCheck, 
  Users, 
  Building2, 
  Receipt, 
  Mail, 
  Calendar, 
  Video, 
  MapPin, 
  Sparkles, 
  BrainCircuit,
  SlidersHorizontal,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  LayoutGrid,
  ShoppingBag,
  TrendingUp,
  Package,
  FolderKanban,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  Palette,
  Layers
} from 'lucide-react';
import { ViewType, NavastraApp, NavastraAppId, ThemeMode } from '../types';
import { ErpLogoBadge } from './Logo';

interface SubFeature {
  id: ViewType;
  label: string;
  icon: any;
  badge?: number | string;
  badgeColor?: string;
  action?: () => void;
}

interface AppGroup {
  id: NavastraAppId;
  name: string;
  icon: any;
  color: string;
  isBase?: boolean;
  defaultView: ViewType;
  features: SubFeature[];
}

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  openAiChat: () => void;
  openHighThinking: () => void;
  unreadEmailsCount: number;
  activeDealsCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenCrmSettings?: () => void;
  installedApps?: NavastraApp[];
  onNavigateToAppsHub?: () => void;
  onNavigateToAppStore?: () => void;
  onNavigateHome?: () => void;
  theme?: ThemeMode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  openAiChat,
  openHighThinking,
  unreadEmailsCount,
  activeDealsCount,
  isCollapsed = false,
  onToggleCollapse,
  onOpenCrmSettings,
  installedApps = [],
  onNavigateToAppsHub,
  onNavigateToAppStore,
  onNavigateHome,
  theme = 'light'
}) => {
  // Helper to determine which application owns a specific view
  const getViewParentAppId = (view: ViewType): NavastraAppId => {
    switch (view) {
      case 'pipeline':
      case 'leads':
      case 'dashboard':
      case 'contacts':
      case 'accounts':
      case 'ai_studio':
        return 'crm';
      case 'invoices':
        return 'invoicing';
      case 'gmail':
      case 'calendar':
      case 'meet':
      case 'maps':
        return 'google_suite';
      case 'sales_orders':
        return 'sales';
      case 'inventory_stock':
        return 'inventory';
      case 'project_tasks':
        return 'projects';
      case 'hr_employees':
        return 'hr';
      case 'helpdesk_tickets':
        return 'helpdesk';
      case 'settings':
        return 'settings';
      case 'apps_grid':
      case 'app_store':
      default:
        return 'app_store';
    }
  };

  // Keep track of which app is currently expanded.
  // By default, it expands the application of the current active view.
  const [expandedAppId, setExpandedAppId] = useState<NavastraAppId>(() => getViewParentAppId(currentView));

  // Sync expanded app whenever currentView changes
  useEffect(() => {
    const parent = getViewParentAppId(currentView);
    setExpandedAppId(parent);
  }, [currentView]);

  // Check installed status
  const isInstalled = (appId: NavastraAppId) => {
    // Settings and Apps Store are always shown by default
    if (appId === 'settings' || appId === 'app_store' || appId === 'apps_launcher') return true;
    const found = installedApps.find(a => a.id === appId);
    return found ? found.isInstalled : false;
  };

  // Define the Application Groups and their sub-features
  const allAppGroups: AppGroup[] = [
    {
      id: 'crm',
      name: 'CRM & Pipeline',
      icon: Briefcase,
      color: '#00a887',
      isBase: true,
      defaultView: 'pipeline',
      features: [
        { 
          id: 'pipeline', 
          label: 'Pipeline & Deals', 
          icon: Briefcase, 
          badge: activeDealsCount > 0 ? activeDealsCount : undefined, 
          badgeColor: 'bg-[#cca458] text-slate-900' 
        },
        { id: 'leads', label: 'Leads & Prospects', icon: UserCheck },
        { id: 'dashboard', label: 'CRM Overview', icon: LayoutDashboard },
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'accounts', label: 'Accounts & ERP', icon: Building2 },
      ]
    },
    {
      id: 'invoicing',
      name: 'Invoicing & Billing',
      icon: Receipt,
      color: '#2563eb',
      defaultView: 'invoices',
      features: [
        { id: 'invoices', label: 'Invoices & Receipts', icon: Receipt }
      ]
    },
    {
      id: 'google_suite',
      name: 'Google Workspace',
      icon: Video,
      color: '#ea4335',
      defaultView: 'meet',
      features: [
        { 
          id: 'gmail', 
          label: 'Google Mail', 
          icon: Mail, 
          badge: unreadEmailsCount > 0 ? unreadEmailsCount : undefined, 
          badgeColor: 'bg-red-500 text-white' 
        },
        { id: 'calendar', label: 'Google Calendar', icon: Calendar },
        { id: 'meet', label: 'Google Meet', icon: Video },
        { id: 'maps', label: 'Territory Maps', icon: MapPin },
      ]
    },
    {
      id: 'sales',
      name: 'Sales Orders',
      icon: TrendingUp,
      color: '#fa7c17',
      defaultView: 'sales_orders',
      features: [
        { id: 'sales_orders', label: 'Quotations & Orders', icon: TrendingUp }
      ]
    },
    {
      id: 'inventory',
      name: 'Inventory & Stock',
      icon: Package,
      color: '#8b5cf6',
      defaultView: 'inventory_stock',
      features: [
        { id: 'inventory_stock', label: 'Stock & Warehouses', icon: Package }
      ]
    },
    {
      id: 'projects',
      name: 'Project Management',
      icon: FolderKanban,
      color: '#06b6d4',
      defaultView: 'project_tasks',
      features: [
        { id: 'project_tasks', label: 'Tasks & Sprints', icon: FolderKanban }
      ]
    },
    {
      id: 'hr',
      name: 'Human Resources',
      icon: Users,
      color: '#ec4899',
      defaultView: 'hr_employees',
      features: [
        { id: 'hr_employees', label: 'Employee Directory', icon: Users }
      ]
    },
    {
      id: 'helpdesk',
      name: 'Helpdesk & Support',
      icon: LifeBuoy,
      color: '#f59e0b',
      defaultView: 'helpdesk_tickets',
      features: [
        { id: 'helpdesk_tickets', label: 'Support Tickets', icon: LifeBuoy }
      ]
    },
    // Default Apps always shown
    {
      id: 'app_store',
      name: 'Apps & Modules',
      icon: LayoutGrid,
      color: '#4f46e5',
      isBase: true,
      defaultView: 'apps_grid',
      features: [
        { id: 'apps_grid', label: 'App Launcher', icon: LayoutGrid },
        { id: 'app_store', label: 'Install Apps Store', icon: ShoppingBag }
      ]
    },
    {
      id: 'settings',
      name: 'Settings & Config',
      icon: Settings,
      color: '#64748b',
      isBase: true,
      defaultView: 'settings',
      features: [
        { id: 'settings', label: 'System & Stages Config', icon: Settings },
        ...(onOpenCrmSettings ? [{
          id: 'settings' as ViewType,
          label: 'Stage Colors & Presets',
          icon: Palette,
          action: onOpenCrmSettings
        }] : [])
      ]
    }
  ];

  // Filter groups: Only show installed applications, plus default apps ('app_store' and 'settings')
  const visibleAppGroups = allAppGroups.filter(group => isInstalled(group.id));

  const handleAppClick = (app: AppGroup) => {
    if (expandedAppId === app.id) {
      // Toggle or keep expanded
      // Navigate to default view if not already in one of its features
      const parentOfCurrent = getViewParentAppId(currentView);
      if (parentOfCurrent !== app.id) {
        onSelectView(app.defaultView);
      }
    } else {
      setExpandedAppId(app.id);
      onSelectView(app.defaultView);
    }
  };

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-18' : 'w-64'
      } bg-white dark:bg-[#141b2d] border-r border-slate-200 dark:border-[#242c44] flex flex-col h-screen select-none shrink-0 text-slate-700 dark:text-slate-300 transition-all duration-200 ease-in-out relative shadow-xs`}
    >
      {/* Brand Header with Navastra ERP Logo Badge & Collapse Toggle */}
      <div className={`h-18 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4.5'} border-b border-slate-200 dark:border-[#242c44] bg-slate-50/90 dark:bg-[#1a2136] transition-colors`}>
        <div className="flex items-center space-x-3 min-w-0">
          <ErpLogoBadge 
            size={36}
            onClick={onNavigateHome || onNavigateToAppsHub}
            title="Navastra App Launcher (Click to redirect)"
            className="shrink-0 ring-1 ring-slate-300/60 dark:ring-white/10 cursor-pointer hover:scale-105 hover:ring-emerald-400/50 transition-all"
          />
          {!isCollapsed && (
            <div 
              className="min-w-0 cursor-pointer group" 
              onClick={onNavigateHome || onNavigateToAppsHub}
              title="Navastra App Launcher"
            >
              <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight tracking-tight flex items-center gap-1.5 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Navastra</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-[#27304e] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-600/30">
                  ERP
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate group-hover:text-slate-700 dark:group-hover:text-slate-300">
                Modular Applications
              </div>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        {onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#252f4a] transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'} py-3.5 space-y-1 kanban-scroll`}>
        {!isCollapsed && (
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center justify-between">
            <span>Installed Applications</span>
            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700/40 px-1.5 py-0.2 rounded-full">
              {visibleAppGroups.length} Active
            </span>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-1">
          {visibleAppGroups.map((app) => {
            const AppIcon = app.icon;
            const isAppExpanded = expandedAppId === app.id;
            const isAppActive = getViewParentAppId(currentView) === app.id;

            return (
              <div key={app.id} className="rounded-xl transition-all">
                {/* Top-Level Application Row: ONLY THE APPLICATION NAME */}
                <button
                  type="button"
                  id={`app-nav-${app.id}`}
                  onClick={() => handleAppClick(app)}
                  title={isCollapsed ? app.name : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                  } rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                    isAppActive
                      ? 'bg-indigo-50/80 dark:bg-[#252f4c] text-indigo-950 dark:text-white shadow-2xs border border-indigo-100 dark:border-indigo-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-[#1e263d]'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} min-w-0`}>
                    <div 
                      style={{ backgroundColor: `${app.color}22`, borderColor: `${app.color}55` }}
                      className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0"
                    >
                      <AppIcon 
                        style={{ color: app.color }}
                        className="w-4 h-4" 
                      />
                    </div>
                    {!isCollapsed && (
                      <span className="truncate text-left text-xs font-semibold">{app.name}</span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center space-x-1.5 text-slate-400 shrink-0">
                      {app.isBase && (
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/40">
                          BASE
                        </span>
                      )}
                      {isAppExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-Features: SHOWN ONLY UNDER THE CURRENT/EXPANDED APP AS INDENTED */}
                {!isCollapsed && isAppExpanded && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-200 dark:border-[#2f3b5e] my-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    {app.features.map((feature) => {
                      const FeatureIcon = feature.icon;
                      const isFeatureActive = currentView === feature.id && !feature.action;

                      return (
                        <button
                          key={feature.label}
                          type="button"
                          id={`feature-nav-${feature.id}`}
                          onClick={() => {
                            if (feature.action) {
                              feature.action();
                            } else {
                              onSelectView(feature.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isFeatureActive
                              ? 'bg-indigo-100/70 dark:bg-[#2e3b5e] text-indigo-950 dark:text-white font-bold shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#1e263d]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <FeatureIcon className={`w-3.5 h-3.5 shrink-0 ${isFeatureActive ? 'text-indigo-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                            <span className="truncate">{feature.label}</span>
                          </div>

                          {feature.badge !== undefined && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${feature.badgeColor || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                              {feature.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compact AI Assistant Trigger */}
        <div className="pt-3">
          {!isCollapsed ? (
            <div className="p-2.5 bg-slate-100/90 dark:bg-[#1b233a] border border-slate-200 dark:border-[#273252] rounded-xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-[#cca458]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#cca458]" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">Gemini Copilot</div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">High Thinking reasoning</div>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={openHighThinking}
                  title="Open High Thinking Studio"
                  className="p-1.5 rounded-lg bg-[#cca458] hover:bg-[#b8934b] text-[#161c2e] transition-colors cursor-pointer shadow-2xs"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={openAiChat}
                  title="Open AI Chat Drawer"
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#242e4c] hover:bg-slate-300 dark:hover:bg-[#2d395e] text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer shadow-2xs"
                >
                  <Bot className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1.5 pt-1">
              <button
                type="button"
                onClick={openHighThinking}
                title="Gemini High Thinking"
                className="w-8 h-8 rounded-lg bg-[#cca458] hover:bg-[#b8934b] text-[#161c2e] flex items-center justify-center shadow-xs cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={openAiChat}
                title="Gemini AI Copilot"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#242e4c] hover:bg-slate-200 dark:hover:bg-[#2d395e] text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-slate-200 dark:border-[#34426b] cursor-pointer shadow-2xs"
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User / Org Footer */}
      <div className={`p-3 border-t border-slate-200 dark:border-[#242c44] bg-slate-50/90 dark:bg-[#131929] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-colors`}>
        <div className="flex items-center space-x-2.5 min-w-0">
          <div 
            onClick={onOpenCrmSettings}
            className="w-8 h-8 rounded-full bg-slate-700 dark:bg-[#3b5358] text-slate-100 font-bold text-xs flex items-center justify-center shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-[#cca458]/50"
            title="Alex Rivera (AN) - Click for ERP settings"
          >
            AN
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Alex Rivera</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Enterprise Sales</div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-2xs" title="Connected" />
        )}
      </div>

      {/* Expand trigger button when collapsed */}
      {isCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[#252f4c] border border-slate-300 dark:border-[#37446d] text-slate-700 dark:text-white flex items-center justify-center shadow-md hover:bg-slate-100 dark:hover:bg-[#cca458] dark:hover:text-slate-900 transition-all z-20 cursor-pointer"
          title="Expand Sidebar"
        >
          <PanelLeftOpen className="w-3.5 h-3.5" />
        </button>
      )}
    </aside>
  );
};
