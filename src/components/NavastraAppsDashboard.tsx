import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Settings,
  ShoppingBag,
  Grid,
  Kanban,
  Briefcase,
  Receipt,
  Mail,
  Calendar,
  Video,
  MapPin,
  TrendingUp,
  Package,
  FolderKanban,
  Users,
  LifeBuoy,
  Factory,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  Clock,
  Compass,
  CheckCircle2,
  X,
  Bell,
  Sun,
  Moon,
  User,
  ShieldCheck,
  CheckCheck,
  ChevronDown,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { NavastraApp, NavastraAppId, ViewType, ThemeMode } from '../types';
import { ErpLogoBadge, ErpLogoIcon } from './Logo';

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
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onSetTheme?: (theme: ThemeMode) => void;
}

interface LauncherTile {
  id: string;
  appId: NavastraAppId;
  targetView: ViewType;
  name: string;
  category: string;
  icon: any;
  color: string;
  badge?: string;
  isDefault?: boolean;
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type?: 'system' | 'workspace' | 'security';
}

export const NavastraAppsDashboard: React.FC<NavastraAppsDashboardProps> = ({
  apps,
  onLaunchApp,
  onOpenAppStore,
  onOpenSettings,
  pipelineTotal,
  activeDealsCount,
  theme = 'light',
  onToggleTheme,
  onSetTheme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Header state for system notifications and profile dropdown
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      title: 'Navastra ERP Core Active',
      message: 'Modular enterprise architecture running with all CRM modules ready.',
      time: 'Just now',
      unread: true,
      type: 'system'
    },
    {
      id: 'notif-2',
      title: 'Google Workspace Connected',
      message: 'Gmail, Google Calendar and Google Meet live synchronization active.',
      time: '12m ago',
      unread: true,
      type: 'workspace'
    },
    {
      id: 'notif-3',
      title: 'Enterprise Security Verified',
      message: 'Session authenticated with single sign-on for Alex Rivera.',
      time: '1h ago',
      unread: true,
      type: 'security'
    },
    {
      id: 'notif-4',
      title: 'Database Schema Healthy',
      message: 'Pipeline stage configurations and CRM custom fields backed up.',
      time: '3h ago',
      unread: false,
      type: 'system'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Check which modules are installed
  const isInstalled = (appId: NavastraAppId) => {
    if (appId === 'settings' || appId === 'app_store') return true;
    const found = apps.find(a => a.id === appId);
    return found ? found.isInstalled : false;
  };

  // Build the complete launcher tiles based on user requirements:
  // Settings & Apps are shown by default; installed applications are shown
  const launcherTiles = useMemo<LauncherTile[]>(() => {
    const tiles: LauncherTile[] = [];

    // 1. CRM & Pipeline (Base App)
    if (isInstalled('crm')) {
      tiles.push({
        id: 'crm_pipeline',
        appId: 'crm',
        targetView: 'pipeline',
        name: 'CRM & Pipeline',
        category: 'CRM',
        icon: Kanban,
        color: '#00a887',
        badge: 'Base'
      });
    }

    // 2. Google Workspace apps (Mail, Calendar, Meet, Maps)
    if (isInstalled('google_suite')) {
      tiles.push(
        {
          id: 'google_mail',
          appId: 'google_suite',
          targetView: 'gmail',
          name: 'Gmail',
          category: 'Workspace',
          icon: Mail,
          color: '#ea4335'
        },
        {
          id: 'google_calendar',
          appId: 'google_suite',
          targetView: 'calendar',
          name: 'Google Calendar',
          category: 'Workspace',
          icon: Calendar,
          color: '#1a73e8'
        },
        {
          id: 'google_meet',
          appId: 'google_suite',
          targetView: 'meet',
          name: 'Google Meet',
          category: 'Workspace',
          icon: Video,
          color: '#00832d'
        },
        {
          id: 'google_maps',
          appId: 'google_suite',
          targetView: 'maps',
          name: 'Territory Maps',
          category: 'Workspace',
          icon: MapPin,
          color: '#34a853'
        }
      );
    }

    // 3. Core ERP Modules
    if (isInstalled('sales')) {
      tiles.push({
        id: 'sales_app',
        appId: 'sales',
        targetView: 'sales_orders',
        name: 'CRM & Sales',
        category: 'ERP',
        icon: TrendingUp,
        color: '#fa7c17'
      });
    }

    if (isInstalled('purchase')) {
      tiles.push({
        id: 'purchase_app',
        appId: 'purchase',
        targetView: 'purchase',
        name: 'Purchase',
        category: 'ERP',
        icon: ShoppingBag,
        color: '#10b981'
      });
    }

    if (isInstalled('inventory')) {
      tiles.push({
        id: 'inventory_app',
        appId: 'inventory',
        targetView: 'inventory_stock',
        name: 'Warehouse',
        category: 'ERP',
        icon: Package,
        color: '#8b5cf6'
      });
    }

    if (isInstalled('mrp')) {
      tiles.push({
        id: 'manufacturing_app',
        appId: 'mrp',
        targetView: 'manufacturing',
        name: 'Manufacturing',
        category: 'ERP',
        icon: Factory,
        color: '#f59e0b'
      });
    }

    if (isInstalled('pos')) {
      tiles.push({
        id: 'pos_app',
        appId: 'pos',
        targetView: 'pos',
        name: 'Point of Sale',
        category: 'ERP',
        icon: ShoppingBag,
        color: '#10b981'
      });
    }

    if (isInstalled('accounting')) {
      tiles.push({
        id: 'accounting_app',
        appId: 'accounting',
        targetView: 'accounting',
        name: 'Accounting',
        category: 'ERP',
        icon: Receipt,
        color: '#7c3aed'
      });
    }

    // 4. Default Applications shown always:
    // Apps Application (App Store / Module Hub)
    tiles.push({
      id: 'app_store_app',
      appId: 'app_store',
      targetView: 'app_store',
      name: 'Apps & Store',
      category: 'System',
      icon: ShoppingBag,
      color: '#4f46e5',
      isDefault: true
    });

    // Settings Application
    tiles.push({
      id: 'settings_app',
      appId: 'settings',
      targetView: 'settings',
      name: 'Settings',
      category: 'System',
      icon: Settings,
      color: '#475569',
      isDefault: true
    });

    return tiles;
  }, [apps]);

  // Filtered tiles based on search and quick category chip
  const filteredTiles = useMemo(() => {
    return launcherTiles.filter(tile => {
      const matchesSearch = searchQuery.trim() === '' ||
        tile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tile.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeFilter === 'All' || tile.category === activeFilter;

      return matchesSearch && matchesCategory;
    });
  }, [launcherTiles, searchQuery, activeFilter]);

  const filterChips = [
    { label: 'All', count: launcherTiles.length },
    { label: 'CRM' },
    { label: 'Workspace' },
    { label: 'Finance' },
    { label: 'Operations' },
    { label: 'System' }
  ];

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-gradient-to-b dark:from-[#111827] dark:via-[#1a233a] dark:to-[#0f172a] text-slate-800 dark:text-white select-none transition-colors duration-200 kanban-scroll">

      {/* Subtle atmospheric vignette / backdrop glow */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_top] from-slate-200/50 via-transparent to-transparent dark:from-sky-900/15 dark:via-slate-900/40 dark:to-slate-950 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar on Homepage: Left = System Notifications, Right = Profile Icon */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-5 pb-2 flex items-center justify-between">

        {/* Left: System Notification Icon with Dropdown */}
        <div className="relative">
          <button
            id="homepage-system-notification-btn"
            type="button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className={`relative p-2.5 rounded-2xl transition-all cursor-pointer flex items-center space-x-2 border shadow-xs ${isNotificationsOpen
              ? 'bg-white dark:bg-[#182138] border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
              : 'bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-white/10'
              }`}
            title="System Notifications"
            aria-label="System Notifications"
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold tracking-tight">
              System Notifications
            </span>
          </button>

          {/* System Notifications Popover Dropdown */}
          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute left-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-[#161e33] border border-slate-200/90 dark:border-slate-700 rounded-3xl shadow-2xl z-50 p-4 text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 origin-top-left transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">System Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto kanban-scroll">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`py-2.5 px-2 rounded-xl transition-colors ${notif.unread ? 'bg-slate-50 dark:bg-white/5' : 'opacity-75 hover:opacity-100'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>All services operational</span>
                  </span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearNotifications}
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Profile Icon with Dropdown */}
        <div className="relative">
          <button
            id="homepage-profile-btn"
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className={`flex items-center space-x-2.5 p-1 pr-3 rounded-full border shadow-xs transition-all cursor-pointer group ${isProfileOpen
              ? 'bg-white dark:bg-[#182138] border-[#cca458] ring-2 ring-[#cca458]/30'
              : 'bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border-slate-200/80 dark:border-white/10'
              }`}
            title="User Profile, Profile Settings & Theme"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#cca458] text-slate-900 font-bold text-xs flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all select-none relative">
              AN
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Alex Rivera</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Admin & Settings</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-white dark:bg-[#161e33] border border-slate-200/90 dark:border-slate-700 rounded-3xl shadow-2xl z-50 p-4 text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 origin-top-right transition-all">

                {/* User Info Header */}
                <div className="flex items-center space-x-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-11 h-11 rounded-2xl bg-[#cca458] text-slate-950 font-bold text-base flex items-center justify-center shadow-sm shrink-0">
                    AN
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        Alex Rivera
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      alex.rivera@navastra.io
                    </p>
                  </div>
                </div>

                <div className="py-3 space-y-2">
                  {/* Profile Setting Option */}
                  <button
                    id="profile-dropdown-settings-btn"
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 text-left transition-colors flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Profile Settings</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Configure profile, stage colors & defaults</div>
                    </div>
                  </button>

                  {/* Theme Option directly inside Profile */}
                  <div className="pt-2 pb-1 px-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        <span>Theme & Appearance</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>

                    {/* Segmented Light / Dark Mode Switcher */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#0f1525] rounded-2xl border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => onSetTheme ? onSetTheme('light') : (theme === 'dark' && onToggleTheme?.())}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${theme === 'light'
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSetTheme ? onSetTheme('dark') : (theme === 'light' && onToggleTheme?.())}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${theme === 'dark'
                          ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenAppStore();
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    App Store Modules
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings();
                    }}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>

              </div>
            </>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-4 pb-12 flex-1 flex flex-col items-center">

        {/* Top Google-style Search Bar & Quick Chips */}
        <div className="w-full max-w-2xl flex flex-col items-center space-y-4">

          {/* Main Google-like Search Capsule */}
          <div className="w-full relative group">
            <div className="flex items-center bg-white dark:bg-white/95 text-slate-800 rounded-full shadow-lg dark:shadow-2xl px-4 py-3.5 transition-all duration-200 border border-slate-200/80 dark:border-white/20 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white">

              {/* Google / Navastra Emblem */}
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-3 shadow-xs">
                <ErpLogoIcon size={20} />
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your apps, settings, records, web..."
                className="w-full bg-transparent border-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />

              {/* Clear button if typed */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 mr-2 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Search Icon */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="p-1 rounded-full text-emerald-600 dark:text-sky-600">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter Chips beneath the search bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {filterChips.map(chip => {
              const isActive = activeFilter === chip.label;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setActiveFilter(chip.label)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                    : 'bg-white/80 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-200 border border-slate-200/80 dark:border-transparent'
                    }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacious, Beautiful App Launcher Grid */}
        <div className="w-full mt-10 sm:mt-12">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4 sm:gap-x-6 justify-items-center">
            {filteredTiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.id}
                  onClick={() => onLaunchApp(tile.appId, tile.targetView)}
                  className="group flex flex-col items-center text-center space-y-2.5 cursor-pointer max-w-[105px] select-none transform hover:-translate-y-1.5 transition-all duration-200"
                >
                  {/* Round / Squircle App Icon Tile */}
                  <div
                    style={{
                      backgroundColor: tile.color,
                      boxShadow: `0 8px 24px -4px ${tile.color}50`
                    }}
                    className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[22px] flex items-center justify-center text-white transition-all duration-200 group-hover:scale-108 group-hover:shadow-2xl group-active:scale-95 relative"
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-xs" />

                    {tile.badge && (
                      <span className="absolute -top-1 -right-1 bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-900 shadow-xs">
                        {tile.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean App Label beneath icon */}
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-1 drop-shadow-xs tracking-tight">
                    {tile.name}
                  </span>
                </div>
              );
            })}

            {/* "+ Install Apps" Tile */}
            <div
              onClick={onOpenAppStore}
              className="group flex flex-col items-center text-center space-y-2.5 cursor-pointer max-w-[105px] select-none transform hover:-translate-y-1.5 transition-all duration-200"
            >
              <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[22px] border-2 border-dashed border-slate-300 dark:border-white/30 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white/70 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-200 group-hover:scale-108 shadow-xs">
                <Plus className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1 drop-shadow-xs tracking-tight">
                Install Apps
              </span>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-auto pt-10 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-700 dark:bg-white shadow-xs" />
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/30" />
        </div>

      </div>

    </div>
  );
};
