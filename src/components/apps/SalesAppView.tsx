import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  Filter, 
  Search, 
  ArrowUpRight,
  MoreVertical,
  Printer,
  Mail,
  Receipt,
  Download
} from 'lucide-react';

export const SalesAppView: React.FC<{
  onOpenNewDeal?: () => void;
  onOpenInvoice?: () => void;
}> = ({ onOpenNewDeal, onOpenInvoice }) => {
  const [quotations, setQuotations] = useState([
    { id: 'SO-0024', customer: 'Aurora House', contact: 'Mina Ellis', amount: 12800, date: '2025-03-18', status: 'Quotation Sent', validity: '30 Days' },
    { id: 'SO-0023', customer: 'Apex Tech Solutions', contact: 'Marcus Vance', amount: 84500, date: '2025-03-16', status: 'Confirmed Order', validity: 'Completed' },
    { id: 'SO-0022', customer: 'Hyperion Logistics', contact: 'Elena Rostova', amount: 48000, date: '2025-03-14', status: 'Quotation Sent', validity: '14 Days' },
    { id: 'SO-0021', customer: 'Novus Health Partners', contact: 'Dr. Sarah Chen', amount: 32500, date: '2025-03-11', status: 'Confirmed Order', validity: 'Completed' },
    { id: 'SO-0020', customer: 'Quantum Financial Group', contact: 'Liam O’Connor', amount: 64000, date: '2025-03-08', status: 'Draft', validity: 'Draft' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuotes = quotations.filter(q => 
    q.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
              SALES MODULE
            </span>
            <span className="text-xs text-slate-400 font-medium">Navastra ERP Commercial Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Sales Orders & Quotations</h2>
          <p className="text-xs text-slate-500">Manage formal quotation proposals, sales contracts, pricing tiers, and delivery confirmations.</p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onOpenNewDeal}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Total Quotations</div>
          <div className="text-xl font-bold text-slate-900">$241,800</div>
          <div className="text-[10px] text-amber-600 font-medium">5 active quotes</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Confirmed Orders</div>
          <div className="text-xl font-bold text-slate-900">$117,000</div>
          <div className="text-[10px] text-emerald-600 font-medium">Ready for Invoicing</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Avg. Margin</div>
          <div className="text-xl font-bold text-slate-900">38.4%</div>
          <div className="text-[10px] text-indigo-600 font-medium">+2.1% vs target</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Conversion Rate</div>
          <div className="text-xl font-bold text-slate-900">64.2%</div>
          <div className="text-[10px] text-slate-500 font-medium">Lead to Quotation</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search quotation #, customer..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-amber-700">{q.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{q.customer}</td>
                  <td className="py-3.5 px-4 text-slate-500">{q.contact}</td>
                  <td className="py-3.5 px-4 text-slate-500">{q.date}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">${q.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      q.status === 'Confirmed Order' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : q.status === 'Quotation Sent'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={onOpenInvoice}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Invoice
                    </button>
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
