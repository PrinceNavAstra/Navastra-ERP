import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Mail, 
  Video, 
  MapPin, 
  ArrowRight, 
  Building2, 
  Phone, 
  Flame, 
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Lead, LeadTemperature } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onOpenNewLead: () => void;
  onOpenLeadDetail: (lead: Lead) => void;
  onConvertLeadToDeal: (lead: Lead) => void;
  onComposeEmail: (email: string, name: string) => void;
  onLaunchMeeting: (name: string, email: string, title: string) => void;
  onLocateOnMap: (company: string) => void;
  onEnrichLeadWithAi: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onOpenNewLead,
  onOpenLeadDetail,
  onConvertLeadToDeal,
  onComposeEmail,
  onLaunchMeeting,
  onLocateOnMap,
  onEnrichLeadWithAi
}) => {
  const [filterTemp, setFilterTemp] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchLead, setSearchLead] = useState('');

  const filteredLeads = leads.filter(l => {
    if (filterTemp !== 'all' && l.temperature !== filterTemp) return false;
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    if (searchLead && !l.name.toLowerCase().includes(searchLead.toLowerCase()) && !l.company.toLowerCase().includes(searchLead.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-[#fbf9f4]">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, company..."
              value={searchLead}
              onChange={(e) => setSearchLead(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
            />
          </div>

          {/* Temperature filter */}
          <div className="relative">
            <select
              value={filterTemp}
              onChange={(e) => setFilterTemp(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 focus:outline-none shadow-2xs cursor-pointer hover:bg-slate-50"
            >
              <option value="all">All Temperatures</option>
              <option value="Hot">🔥 Hot Velocity</option>
              <option value="Warm">⚡ Warm Interest</option>
              <option value="Cold">❄️ Cold Prospect</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          id="leads-new-btn"
          onClick={onOpenNewLead}
          className="flex items-center space-x-1.5 px-4 py-2 bg-[#1c2237] hover:bg-[#28304c] text-white rounded-full text-xs font-semibold transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Leads Table Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col shadow-2xs">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f7f5ed] border-b border-slate-200 sticky top-0 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Lead / Company</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">AI Score & Intent</th>
                <th className="py-3.5 px-5">Est. Value</th>
                <th className="py-3.5 px-5">Stage / Status</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const avatarBg = lead.avatarBg || '#d4a853';
                const avatarInitials = lead.avatarInitials || lead.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'ME';

                return (
                  <tr 
                    key={lead.id} 
                    onClick={() => onOpenLeadDetail(lead)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div 
                          style={{ backgroundColor: avatarBg }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm shrink-0 shadow-2xs"
                        >
                          {avatarInitials}
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-slate-900 group-hover:text-[#2d7d56] transition-colors">
                            {lead.company}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{lead.name} · {lead.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="text-xs text-slate-800 font-medium">{lead.email}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{lead.phone}</div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          lead.temperature === 'Hot' ? 'bg-red-50 text-red-700 border border-red-200' :
                          lead.temperature === 'Warm' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {lead.temperature === 'Hot' && <Flame className="w-3 h-3 text-red-500 mr-0.5" />}
                          <span>{lead.temperature} ({lead.score}/100)</span>
                        </span>
                      </div>
                      {lead.aiInsights && (
                        <div className="text-[11px] text-slate-600 mt-1 line-clamp-1 max-w-xs">
                          {lead.aiInsights}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-5 font-bold text-slate-900 text-sm">
                      ${lead.estimatedValue.toLocaleString()}
                    </td>

                    <td className="py-4 px-5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e6f4ed] text-[#2d7d56]">
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-slate-600 text-xs">
                      {lead.city}, {lead.country}
                    </td>

                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onComposeEmail(lead.email, lead.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Send Google Mail"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onLaunchMeeting(lead.name, lead.email, `Intro: ${lead.company}`)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Schedule Google Meet"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onLocateOnMap(lead.company)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View on Google Maps"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenLeadDetail(lead)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold text-[11px] transition-colors"
                        >
                          View Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
