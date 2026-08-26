import React, { useState } from 'react';
import { 
  Kanban, 
  TrendingUp, 
  Receipt, 
  Package, 
  FolderKanban, 
  Users, 
  LifeBuoy, 
  Video, 
  Factory, 
  CreditCard, 
  Grid, 
  Settings, 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  HardDrive,
  Mail,
  Calendar,
  Layers,
  ShoppingBag,
  Clock,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { NavastraApp, NavastraAppId, ViewType } from '../types';

interface NavastraAppsDashboardProps {
  apps: NavastraApp[];
  onLaunchApp: (appId: NavastraAppId, targetView?: ViewType) => void;
  onOpenAppStore: () => void;
  onOpenSettings: () => void;
  onOpenNewLead: () => void;
  onOpenNewDeal: () => void;
  onOpenNewInvoice: () => void;
  pipelineTotal: number;
  activeDealsCount: number;
}

export const NavastraAppsDashboard: React.FC<NavastraAppsDashboardProps> = ({
  apps,
  onLaunchApp,
  onOpenAppStore,
  onOpenSettings,
  onOpenNewLead,
  onOpenNewDeal,
  onOpenNewInvoice,
  pipelineTotal,
  activeDealsCount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Installed apps
  const installedApps = apps.filter(app => app.isInstalled);
  
  // Filtered by search and category
  const displayedApps = installedApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Icon mapping helper
  const getAppIcon = (iconName: string) => {
    const props = { className: "w-8 h-8 text-white" };
    switch (iconName) {
      case 'Kanban': return <Kanban {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Receipt': return <Receipt {...props} />;
      case 'Package': return <Package {...props} />;
      case 'FolderKanban': return <FolderKanban {...props} />;
      case 'Users': return <Users {...props} />;
      case 'LifeBuoy': return <LifeBuoy {...props} />;
      case 'Video': return <Video {...props} />;
      case 'Factory': return <Factory {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'Grid': return <Grid {...props} />;
      case 'Settings': return <Settings {...props} />;
      default: return <Grid {...props} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner with Odoo-Style App Hub Branding & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#14192b] via-[#1a2238] to-[#121727] p-6 lg:p-8 rounded-3xl text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-wide uppercase flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Navastra Enterprise Cloud</span>
            </span>
            <span className="text-slate-400 text-xs font-medium">v18.4 • Active Enterprise Node</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span>Navastra Application Hub</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Modular enterprise operations. Launch installed modules, configure workflow rules, or install new specialized applications from the App Store.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenAppStore}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-2xl text-xs shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Install Apps Store</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl text-xs border border-white/20 transition-all hover:border-white/40 active:scale-95 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#d4a853]" />
            <span>ERP Settings</span>
          </button>
        </div>
      </div>

      {/* Quick Status Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Installed Modules</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{installedApps.length} Apps Active</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>CRM Core Base Ready</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pipeline Value</span>
          </div>
          <div className="text-xl font-bold text-slate-900">${(pipelineTotal).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 font-medium">{activeDealsCount} Active Deals in Stage</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1.5">
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>Google Workspace</span>
          </div>
          <div className="text-xl font-bold text-slate-900">Synchronized</div>
          <div className="text-[11px] text-emerald-600 font-medium">Gmail • Meet • Calendar</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4a853]" />
            <span>Gemini Intelligence</span>
          </div>
          <div className="text-xl font-bold text-slate-900">High Thinking AI</div>
          <div className="text-[11px] text-indigo-600 font-medium">Copilot Active on Screen</div>
        </div>
      </div>

      {/* App Matrix Controls (Search & Quick Category filter) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apps by name or workflow..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 w-full sm:w-auto justify-between sm:justify-end">
          <span>{displayedApps.length} applications found</span>
          <button
            onClick={onOpenAppStore}
            className="flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
          >
            <span>Browse All Modules</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Odoo-Style App Icons Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <span>Installed Applications</span>
          <div className="h-px flex-1 bg-slate-200/80" />
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayedApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onLaunchApp(app.id, app.defaultView)}
              className="group bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300/90 transition-all duration-200 flex flex-col items-center text-center space-y-3 cursor-pointer transform hover:-translate-y-1 active:scale-95 select-none relative overflow-hidden"
            >
              {/* Top Base or Enterprise Badge */}
              {app.isBase && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                  BASE
                </div>
              )}
              {app.badge && !app.isBase && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-bold">
                  {app.badge}
                </div>
              )}

              {/* Large Odoo-Style App Tile Icon */}
              <div 
                style={{ backgroundColor: app.color }}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-108 transition-all duration-200 group-hover:shadow-lg`}
              >
                {getAppIcon(app.iconName)}
              </div>

              {/* Title & Tagline */}
              <div className="space-y-0.5 w-full">
                <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {app.name}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 font-medium">
                  {app.tagline}
                </div>
              </div>

              {/* Bottom Quick Indicator */}
              {app.metrics && (
                <div className="w-full pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                  <span>{app.metrics.label}</span>
                  <span className="font-bold text-slate-700">{app.metrics.value}</span>
                </div>
              )}
            </div>
          ))}

          {/* "+ Install New Apps" Card in the Grid */}
          <div
            onClick={onOpenAppStore}
            className="group bg-slate-50/80 hover:bg-emerald-50/50 rounded-3xl p-5 border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-all duration-200 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transform hover:-translate-y-1 active:scale-95 select-none min-h-[160px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 shadow-2xs group-hover:scale-108 transition-all duration-200">
              <Plus className="w-7 h-7" />
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-xs sm:text-sm text-slate-700 group-hover:text-emerald-800 transition-colors">
                Install Apps
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Add Inventory, Sales, HR...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Workflow Accelerators Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-slate-900">Quick Workflow Actions</h3>
            <p className="text-xs text-slate-500">Fast triggers to create records or launch operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenNewLead}
            className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/40 text-left transition-all flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">New Lead Dossier</div>
              <div className="text-[10px] text-slate-500 truncate">Open full profile like Aurora House</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 ml-auto" />
          </button>

          <button
            onClick={onOpenNewDeal}
            className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/40 text-left transition-all flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Kanban className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">Create Pipeline Deal</div>
              <div className="text-[10px] text-slate-500 truncate">Add deal card to Kanban columns</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 ml-auto" />
          </button>

          <button
            onClick={onOpenNewInvoice}
            className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/40 text-left transition-all flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900">Generate Invoice</div>
              <div className="text-[10px] text-slate-500 truncate">Issue billing with ERP tax balance</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto" />
          </button>
        </div>
      </div>

    </div>
  );
};
