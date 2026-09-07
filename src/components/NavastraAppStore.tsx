import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Check, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
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
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NavastraApp, NavastraAppCategory, NavastraAppId, ViewType } from '../types';

interface NavastraAppStoreProps {
  apps: NavastraApp[];
  onInstallApp: (appId: NavastraAppId) => void;
  onUninstallApp: (appId: NavastraAppId) => void;
  onLaunchApp: (appId: NavastraAppId, targetView?: ViewType) => void;
  onBackToDashboard: () => void;
}

export const NavastraAppStore: React.FC<NavastraAppStoreProps> = ({
  apps,
  onInstallApp,
  onUninstallApp,
  onLaunchApp,
  onBackToDashboard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NavastraAppCategory>('All');
  const [filterType, setFilterType] = useState<'all' | 'installed' | 'available'>('all');
  const [installingAppId, setInstallingAppId] = useState<NavastraAppId | null>(null);
  const [installProgress, setInstallProgress] = useState(0);

  const categories: NavastraAppCategory[] = [
    'All',
    'Sales & CRM',
    'Services',
    'Accounting',
    'Inventory & MRP',
    'Human Resources',
    'Productivity & AI',
    'System'
  ];

  // Filtering
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;

    const matchesFilter = filterType === 'all' ? true :
                          filterType === 'installed' ? app.isInstalled :
                          !app.isInstalled;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const handleInstallClick = (appId: NavastraAppId) => {
    setInstallingAppId(appId);
    setInstallProgress(15);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            onInstallApp(appId);
            setInstallingAppId(null);
            setInstallProgress(0);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const getAppIcon = (iconName: string) => {
    const props = { className: "w-7 h-7 text-white" };
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

  const installedCount = apps.filter(a => a.isInstalled).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 text-slate-800 dark:text-slate-100">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#182138] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#202c4b] text-slate-700 dark:text-slate-200 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Back to App Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Navastra</span>
              <span>/</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">App Store & Modules</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Module Registry
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#182138] border border-slate-200 dark:border-slate-700 shadow-2xs">
            <strong className="text-emerald-700 dark:text-emerald-400">{installedCount}</strong> of {apps.length} Modules Installed
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1c2237] via-[#242d4a] to-[#161c2e] p-6 lg:p-8 rounded-3xl text-white shadow-xl border border-slate-700/50 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Odoo-Compatible Modular Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Scale your business with on-demand ERP apps
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Install specialized modules like Inventory, Sales Orders, Human Resources, Helpdesk, and MRP. All apps natively share customer data, accounting ledgers, and Gemini AI insights.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">1-Click Live Install</div>
            <div className="text-[11px] text-slate-300">Instant schema activation & zero reboot</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apps by name, category, or workflow..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#182138] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-[#182138] p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#1c2237] dark:bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({apps.length})
            </button>
            <button
              onClick={() => setFilterType('installed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'installed'
                  ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Installed ({installedCount})
            </button>
            <button
              onClick={() => setFilterType('available')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'available'
                  ? 'bg-indigo-700 dark:bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Available ({apps.length - installedCount})
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 kanban-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#182138] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#202c4b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => {
          const isCurrentlyInstalling = installingAppId === app.id;

          return (
            <div
              key={app.id}
              className="bg-white dark:bg-[#141b2d] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start space-x-3.5">
                <div 
                  style={{ backgroundColor: app.color }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform"
                >
                  {getAppIcon(app.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {app.name}
                    </h3>
                    {app.isBase && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-bold shrink-0">
                        Base CRM
                      </span>
                    )}
                    {app.badge && !app.isBase && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 text-[10px] font-bold shrink-0">
                        {app.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                    {app.tagline}
                  </p>

                  <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    <span>{app.author}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{app.rating}</span>
                    </div>
                    <span>•</span>
                    <span>v{app.version}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {app.description}
              </p>

              {/* Progress Bar during installation */}
              {isCurrentlyInstalling && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span>Installing {app.name} schema...</span>
                    <span>{installProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-200"
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Card Footer / Action Button */}
              {!isCurrentlyInstalling && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {app.category}
                  </span>

                  <div className="flex items-center space-x-2">
                    {app.isInstalled ? (
                      <>
                        <button
                          onClick={() => onLaunchApp(app.id, app.defaultView)}
                          className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Open</span>
                        </button>

                        {!app.isBase && (
                          <button
                            onClick={() => onUninstallApp(app.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                            title="Uninstall app"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleInstallClick(app.id)}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Install</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
