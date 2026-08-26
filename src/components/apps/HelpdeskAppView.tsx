import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const HelpdeskAppView: React.FC = () => {
  const [tickets] = useState([
    { id: 'TKT-904', subject: 'Invoice webhook re-trigger request for European subsidiary', client: 'Aurora House', contact: 'Mina Ellis', priority: 'Urgent', status: 'In Progress', sla: '1h 45m left' },
    { id: 'TKT-903', subject: 'Google Meet integration authentication refresh for boardroom', client: 'Apex Tech Solutions', contact: 'Marcus Vance', priority: 'High', status: 'Open', sla: '4h 10m left' },
    { id: 'TKT-902', subject: 'Custom field mapping for logistics bill of lading', client: 'Hyperion Logistics', contact: 'Elena Rostova', priority: 'Medium', status: 'Resolved', sla: 'Closed' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
              HELPDESK MODULE
            </span>
            <span className="text-xs text-slate-400 font-medium">Customer Support & SLA Escalation</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Support Ticket Queue</h2>
          <p className="text-xs text-slate-500">Track client inquiry escalations, automated SLA resolution clocks, and CSAT scores.</p>
        </div>

        <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Client / Contact</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">SLA Countdown</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-700">{t.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.client}</div>
                    <div className="text-[10px] text-slate-400">{t.contact}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{t.subject}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-600">{t.sla}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
