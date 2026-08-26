import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Receipt, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Printer, 
  Download,
  Building2
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  onOpenNewInvoice: () => void;
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  onAuditInvoiceWithAi: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onOpenNewInvoice,
  onUpdateInvoiceStatus,
  onAuditInvoiceWithAi
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    if (searchTerm && !inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) && !inv.company.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalBilled = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Top Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-slate-500">Total Invoiced</span>
          <div className="text-xl font-bold text-slate-900 mt-1">${totalBilled.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-emerald-600">Collected Revenue</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] uppercase font-bold text-red-600">Overdue AR</span>
          <div className="text-xl font-bold text-red-600 mt-1">${totalOverdue.toLocaleString()}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice # or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Sent">Sent</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <button
          id="invoices-new-btn"
          onClick={onOpenNewInvoice}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create ERP Invoice</span>
        </button>
      </div>

      {/* Invoices List Table */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Company & Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-indigo-600">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{inv.company}</div>
                    <div className="text-[11px] text-slate-500">{inv.customerName} ({inv.customerEmail})</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{inv.issueDate}</td>
                  <td className="py-3.5 px-4 text-slate-600">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ${inv.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      inv.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[11px] transition-colors flex items-center space-x-1"
                        title="View / Print Printable Invoice"
                      >
                        <Printer className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => onAuditInvoiceWithAi(inv)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Gemini Financial & AR Audit"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-semibold text-[11px] transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Printable / Preview Modal */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-6">
              <div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">OmniCRM Enterprise Solutions</div>
                <div className="text-xs text-slate-500 mt-1">100 Tech Highway, Suite 900 • San Francisco, CA 94107</div>
                <div className="text-xs text-slate-500">billing@omnicrm.enterprise</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600">INVOICE</div>
                <div className="text-xs font-bold text-slate-800 mt-1">{selectedInvoiceForPrint.invoiceNumber}</div>
                <div className="text-xs text-slate-500">Status: <strong>{selectedInvoiceForPrint.status}</strong></div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Billed To:</div>
                <div className="font-bold text-slate-900 mt-1">{selectedInvoiceForPrint.company}</div>
                <div className="text-slate-600">{selectedInvoiceForPrint.customerName}</div>
                <div className="text-slate-500">{selectedInvoiceForPrint.customerEmail}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-500">Issue Date: <strong>{selectedInvoiceForPrint.issueDate}</strong></div>
                <div className="text-slate-500 mt-1">Payment Due: <strong>{selectedInvoiceForPrint.dueDate}</strong></div>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-xs">
              <thead className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoiceForPrint.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 text-slate-800 font-medium">{item.description}</td>
                    <td className="py-2.5 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-2.5 text-right text-slate-600">${item.unitPrice.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>${selectedInvoiceForPrint.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({(selectedInvoiceForPrint.taxRate * 100).toFixed(1)}%):</span>
                  <span>${selectedInvoiceForPrint.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total Due:</span>
                  <span className="text-indigo-600">${selectedInvoiceForPrint.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
