import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Calendar, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Search,
  Building,
  DollarSign
} from 'lucide-react';

export const HrAppView: React.FC = () => {
  const [employees] = useState([
    { id: 'EMP-01', name: 'Alex Rivera', role: 'Enterprise Account Executive', dept: 'Sales', email: 'alex.rivera@navastra.io', status: 'Active', location: 'San Francisco, HQ' },
    { id: 'EMP-02', name: 'Sarah Chen', role: 'Solutions Architect Lead', dept: 'Engineering', email: 'sarah.chen@navastra.io', status: 'Active', location: 'New York Office' },
    { id: 'EMP-03', name: 'Marcus Vance', role: 'Chief Revenue Officer', dept: 'Executive', email: 'marcus.vance@navastra.io', status: 'Active', location: 'San Francisco, HQ' },
    { id: 'EMP-04', name: 'Elena Rostova', role: 'Customer Success Manager', dept: 'Support', email: 'elena.rostova@navastra.io', status: 'On Leave', location: 'Remote, London' },
    { id: 'EMP-05', name: 'Liam O’Connor', role: 'ERP Financial Auditor', dept: 'Finance', email: 'liam.oconnor@navastra.io', status: 'Active', location: 'Austin Office' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-bold">
              HUMAN RESOURCES
            </span>
            <span className="text-xs text-slate-400 font-medium">Navastra People & Org Management</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Employee Directory & Attendance</h2>
          <p className="text-xs text-slate-500">Manage employee headcount, departmental hierarchy, leave requests, and payroll tracking.</p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Employee</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Total Headcount</div>
          <div className="text-xl font-bold text-slate-900">42 Team Members</div>
          <div className="text-[10px] text-pink-600 font-medium">5 Departments</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Attendance Today</div>
          <div className="text-xl font-bold text-slate-900">97.6%</div>
          <div className="text-[10px] text-emerald-600 font-medium">41 Checked In</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Pending Leave</div>
          <div className="text-xl font-bold text-slate-900">2 Requests</div>
          <div className="text-[10px] text-amber-600 font-medium">Awaiting Manager</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Next Payroll</div>
          <div className="text-xl font-bold text-slate-900">Mar 31, 2025</div>
          <div className="text-[10px] text-slate-500 font-medium">Direct Deposit Ready</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-pink-100 text-pink-800 font-bold flex items-center justify-center text-sm">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 text-xs truncate">{emp.name}</div>
                <div className="text-[11px] text-slate-500 font-medium truncate">{emp.role}</div>
                <div className="text-[10px] text-pink-600 font-bold">{emp.dept}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {emp.status}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 space-y-1 font-medium">
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3 h-3 text-slate-400" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{emp.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
