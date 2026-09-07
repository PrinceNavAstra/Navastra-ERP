import React, { useState } from 'react';
import {
    Landmark,
    Plus,
    Search,
    FileSpreadsheet,
    Wallet,
    Banknote,
    CreditCard,
    Scale
} from 'lucide-react';

export const AccountingAppView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const accountingEntries = [
        { id: 'COA-101', doc: 'Chart of Accounts', item: 'Cash in Hand', balance: 184200, type: 'Asset' },
        { id: 'JV-204', doc: 'Journal Voucher', item: 'Office rent accrual', balance: 45000, type: 'Expense' },
        { id: 'BNK-315', doc: 'Bank Reconciliation', item: 'HBL Current A/c', balance: 128950, type: 'Bank' },
        { id: 'CN-901', doc: 'Credit Note', item: 'Customer adjustment', balance: 12350, type: 'Revenue' },
        { id: 'DN-774', doc: 'Debit Note', item: 'Vendor chargeback', balance: 8700, type: 'Expense' },
        { id: 'P&L-66', doc: 'P&L', item: 'Operating profit', balance: 324000, type: 'Report' },
    ];

    const filtered = accountingEntries.filter(item =>
        item.doc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111627] p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wide">
                        <span className="px-2.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                            Accounting Module
                        </span>
                        <span className="text-slate-400">ERP Finance</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Accounting & Financial Reports</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        COA, journal vouchers, bank reconciliation, debit/credit notes, ledgers, P&L, cashbook and balance sheet.
                    </p>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0">
                    <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>New JV</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">COA</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">120</div>
                    <div className="text-[10px] text-violet-600 font-medium">Active accounts</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">P&L</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">$324k</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Net profit</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Balance Sheet</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">$1.4M</div>
                    <div className="text-[10px] text-blue-600 font-medium">Assets</div>
                </div>
                <div className="bg-white dark:bg-[#111627] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Cashbook</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">$184k</div>
                    <div className="text-[10px] text-slate-500 font-medium">Available</div>
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
                            placeholder="Search COA, JV, report..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="py-3 px-4">Document</th>
                                <th className="py-3 px-4">Item</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Balance</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="py-3.5 px-4 font-bold text-violet-700 dark:text-violet-400">{item.id}</td>
                                    <td className="py-3.5 px-4">
                                        <div className="font-semibold text-slate-900 dark:text-white">{item.doc}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.item}</div>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{item.type}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">${item.balance.toLocaleString()}</td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer">
                                            View
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
