import React, { useState } from 'react';
import {
    ShoppingCart,
    Plus,
    Search,
    ArrowDownLeft,
    FileText,
    PackageCheck,
    ReceiptText,
    CreditCard
} from 'lucide-react';

export const PurchaseAppView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const purchaseFlow = [
        { id: 'RFQ-1042', doc: 'Request for Quotation', vendor: 'Prime Industrial Supply', amount: 18250, date: '2026-09-06', status: 'Awaiting Quote' },
        { id: 'PO-2081', doc: 'Purchase Order', vendor: 'Sigma Components', amount: 46800, date: '2026-09-05', status: 'Approved' },
        { id: 'GRN-501', doc: 'GRN / Receipt', vendor: 'NorthStar Logistics', amount: 23750, date: '2026-09-03', status: 'Received' },
        { id: 'PINV-998', doc: 'Purchase Invoice', vendor: 'TechWorks Ltd.', amount: 31900, date: '2026-09-02', status: 'Pending Payment' },
        { id: 'PAY-447', doc: 'Payment', vendor: 'BluePeak Traders', amount: 12480, date: '2026-09-01', status: 'Paid' },
    ];

    const filtered = purchaseFlow.filter(item =>
        item.doc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111627] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wide">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                            Purchase Module
                        </span>
                        <span className="text-slate-400">ERP Procurement</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Purchase Workflow</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage RFQs, purchase orders, goods receipt, vendor invoices, and payment tracking.
                    </p>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0">
                    <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>New RFQ</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">RFQ</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">08</div>
                    <div className="text-[10px] text-amber-600 font-medium">Review</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">PO</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">12</div>
                    <div className="text-[10px] text-indigo-600 font-medium">Approved</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">GRN</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">06</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Received</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Invoices</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">$94k</div>
                    <div className="text-[10px] text-blue-600 font-medium">Due</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Payments</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">$62k</div>
                    <div className="text-[10px] text-slate-500 font-medium">This month</div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#111627] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search RFQ, PO, invoice..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="py-3 px-4">Document</th>
                                <th className="py-3 px-4">Vendor</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">{item.id}</td>
                                    <td className="py-3.5 px-4">
                                        <div className="font-semibold text-slate-900 dark:text-white">{item.doc}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.vendor}</div>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{item.date}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${item.amount.toLocaleString()}</td>
                                    <td className="py-3.5 px-4">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer">
                                            Open
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
