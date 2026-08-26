import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Sparkles, 
  DollarSign, 
  Users, 
  Globe, 
  MapPin, 
  Activity, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { Account } from '../types';

interface AccountsViewProps {
  accounts: Account[];
  onOpenNewAccount: () => void;
  onLocateOnMap: (address: string) => void;
  onRunAiAccountAudit: (account: Account) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onOpenNewAccount,
  onLocateOnMap,
  onRunAiAccountAudit
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = accounts.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts by name, industry, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <button
          id="accounts-new-btn"
          onClick={onOpenNewAccount}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Account</span>
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    account.tier === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                    account.tier === 'Mid-Market' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {account.tier}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{account.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{account.industry}</p>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Annual Rev.</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    ${(account.annualRevenue / 1000000).toFixed(1)}M ARR
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Employees</span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {account.employees.toLocaleString()} staff
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Health Score</span>
                  <div className="font-bold text-emerald-600 mt-0.5 flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>{account.healthScore}/100</span>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Active Deals</span>
                  <div className="font-bold text-indigo-600 mt-0.5">
                    {account.activeDealsCount} pipeline
                  </div>
                </div>
              </div>

              {/* Location & primary contact */}
              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center space-x-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{account.city}, {account.country}</span>
                </div>
                <div className="flex items-center space-x-1.5 truncate">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Contact: <strong>{account.primaryContact}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onLocateOnMap(account.address)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Map</span>
                </button>

                <button
                  onClick={() => onRunAiAccountAudit(account)}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Expansion Audit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
