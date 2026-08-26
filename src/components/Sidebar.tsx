import React from 'react';
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
  LifeBuoy
} from 'lucide-react';
import { ViewType, NavastraApp } from '../types';
import { ErpLogoBadge } from './Logo';

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
  onNavigateHome
}) => {
  const isSalesInstalled = installedApps.some(a => a.id === 'sales' && a.isInstalled);
  const isInventoryInstalled = installedApps.some(a => a.id === 'inventory' && a.isInstalled);
  const isProjectsInstalled = installedApps.some(a => a.id === 'projects' && a.isInstalled);
  const isHrInstalled = installedApps.some(a => a.id === 'hr' && a.isInstalled);
  const isHelpdeskInstalled = installedApps.some(a => a.id === 'helpdesk' && a.isInstalled);

  const mainNavItems: { id: ViewType; label: string; icon: any; badge?: number | string; badgeColor?: string }[] = [
    { id: 'pipeline', label: 'Pipeline & Deals', icon: Briefcase, badge: activeDealsCount, badgeColor: 'bg-[#cca458] text-slate-900' },
    { id: 'leads', label: 'Leads & Prospects', icon: UserCheck },
    { id: 'dashboard', label: 'CRM Overview', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'accounts', label: 'Accounts & ERP', icon: Building2 },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
  ];

  // Dynamic modules installed
  const installedModuleItems: { id: ViewType; label: string; icon: any }[] = [];
  if (isSalesInstalled) installedModuleItems.push({ id: 'sales_orders', label: 'Sales Orders', icon: TrendingUp });
  if (isInventoryInstalled) installedModuleItems.push({ id: 'inventory_stock', label: 'Inventory & Stock', icon: Package });
  if (isProjectsInstalled) installedModuleItems.push({ id: 'project_tasks', label: 'Projects & Sprints', icon: FolderKanban });
  if (isHrInstalled) installedModuleItems.push({ id: 'hr_employees', label: 'Human Resources', icon: Users });
  if (isHelpdeskInstalled) installedModuleItems.push({ id: 'helpdesk_tickets', label: 'Helpdesk Queue', icon: LifeBuoy });

  const workspaceNavItems: { id: ViewType; label: string; icon: any; badge?: number | string; badgeColor?: string }[] = [
    { id: 'gmail', label: 'Google Mail', icon: Mail, badge: unreadEmailsCount > 0 ? unreadEmailsCount : undefined, badgeColor: 'bg-red-500 text-white' },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar },
    { id: 'meet', label: 'Google Meet', icon: Video },
    { id: 'maps', label: 'Territory Maps', icon: MapPin },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-18' : 'w-60'
      } bg-[#1c2237] border-r border-[#262f4a] flex flex-col h-screen select-none shrink-0 text-slate-300 transition-all duration-250 ease-in-out relative`}
    >
      {/* Brand Header with Navastra ERP Logo Badge & Collapse Toggle */}
      <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'} border-b border-[#27304e]`}>
        <div className="flex items-center space-x-3 min-w-0">
          {/* Official Navastra Geometric ERP Logo - Clickable to redirect to Homepage/Dashboard */}
          <ErpLogoBadge 
            size={38}
            onClick={onNavigateHome || onNavigateToAppsHub}
            title="Navastra ERP Home Dashboard (Click to redirect)"
            className="shrink-0 ring-1 ring-white/10 cursor-pointer hover:scale-105 hover:ring-emerald-400/50 transition-all"
          />
          {!isCollapsed && (
            <div 
              className="min-w-0 cursor-pointer group" 
              onClick={onNavigateHome || onNavigateToAppsHub}
              title="Navastra ERP Home Dashboard (Click to redirect)"
            >
              <div className="font-bold text-white text-base leading-tight tracking-tight flex items-center gap-1.5 truncate group-hover:text-emerald-400 transition-colors">
                <span>Navastra</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#27304e] text-emerald-400 border border-emerald-600/30">
                  ERP
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium truncate group-hover:text-slate-300">
                Modular Cloud Platform
              </div>
            </div>
          )}
        </div>

        {/* Collapse / Expand Toggle Button */}
        {onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#283250] transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-5 scrollbar-thin`}>
        {/* Core CRM & Base Pipeline */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>CRM & Pipeline</span>
              <span className="text-[9px] text-emerald-400 font-bold">Base</span>
            </div>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#293354] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-[#232b45]'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#cca458]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge !== undefined && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#cca458]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Installed Dynamic Modules */}
        {installedModuleItems.length > 0 && (
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Installed Modules
              </div>
            )}
            <nav className="space-y-1">
              {installedModuleItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5'
                    } rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                      isActive
                        ? 'bg-[#293354] text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-[#232b45]'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Google Workspace Suite */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Google Workspace
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-1.5 py-0.2 rounded-full">
                LIVE
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {workspaceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#293354] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-[#232b45]'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge !== undefined && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Gemini AI Intelligence Banner */}
        {!isCollapsed ? (
          <div className="p-3.5 bg-[#242c47] border border-[#313c5e] rounded-2xl space-y-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-lg bg-[#cca458]/20 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#cca458]" />
              </div>
              <div className="text-xs font-bold text-white">Gemini Intelligence</div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              High Thinking AI step reasoning & executive proposal drafting.
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <button
                onClick={openHighThinking}
                className="w-full py-2 px-3 bg-[#cca458] hover:bg-[#b8934b] text-[#1c2237] text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>High Thinking Studio</span>
              </button>
              <button
                onClick={openAiChat}
                className="w-full py-1.5 px-3 bg-[#1c2237] hover:bg-[#161b2d] text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 border border-[#384469] transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Copilot</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 pt-2">
            <button
              onClick={openHighThinking}
              title="Gemini High Thinking Studio"
              className="w-10 h-10 rounded-xl bg-[#cca458] hover:bg-[#b8934b] text-[#1c2237] flex items-center justify-center transition-all shadow-xs cursor-pointer"
            >
              <BrainCircuit className="w-5 h-5" />
            </button>
            <button
              onClick={openAiChat}
              title="Gemini AI Copilot"
              className="w-10 h-10 rounded-xl bg-[#242c47] hover:bg-[#2d3859] text-emerald-400 flex items-center justify-center border border-[#384469] transition-all cursor-pointer"
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* App Store & ERP Settings Nav Buttons */}
        <div className="pt-2 space-y-1">
          {onNavigateToAppStore && (
            <button
              onClick={onNavigateToAppStore}
              title="Navastra App Store"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'space-x-3 px-3.5 py-2.5'
              } rounded-xl text-xs font-semibold ${
                currentView === 'app_store' ? 'bg-[#293354] text-white' : 'text-slate-300 hover:text-white hover:bg-[#232b45]'
              } transition-all cursor-pointer`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              {!isCollapsed && <span>App Store</span>}
            </button>
          )}

          {onOpenCrmSettings && (
            <button
              onClick={onOpenCrmSettings}
              title="ERP Settings & Pipeline Colors"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'space-x-3 px-3.5 py-2.5'
              } rounded-xl text-xs font-semibold ${
                currentView === 'settings' ? 'bg-[#293354] text-white' : 'text-slate-300 hover:text-white hover:bg-[#232b45]'
              } transition-all cursor-pointer`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>ERP Settings</span>}
            </button>
          )}
        </div>
      </div>

      {/* User / Org Footer (Matches Image 1 bottom avatar) */}
      <div className={`p-3.5 border-t border-[#262f4a] bg-[#161c2e] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center space-x-3 min-w-0">
          <div 
            onClick={onOpenCrmSettings}
            className="w-9 h-9 rounded-full bg-[#3b5358] text-slate-100 font-bold text-xs flex items-center justify-center shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-[#cca458]/50"
            title="Alex Rivera (AN)"
          >
            AN
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Alex Rivera</div>
              <div className="text-[10px] text-slate-400 truncate">Enterprise Sales</div>
            </div>
          )}
        </div>
        {!isCollapsed ? (
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Connected" />
        ) : (
          null
        )}
      </div>

      {/* Expand trigger when collapsed */}
      {isCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-[#293354] border border-[#3b476e] text-white flex items-center justify-center shadow-md hover:bg-[#cca458] hover:text-slate-900 transition-all z-20 cursor-pointer"
          title="Expand Sidebar"
        >
          <PanelLeftOpen className="w-3.5 h-3.5" />
        </button>
      )}
    </aside>
  );
};

