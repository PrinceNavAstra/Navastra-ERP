import React from 'react';
import { Factory, Plus, PackageCheck, TimerReset, Wrench, ArrowRight } from 'lucide-react';

export const ManufacturingAppView: React.FC = () => {
    const productionOrders = [
        { id: 'MO-1042', product: 'Smart Gateway Assembly', qty: 35, stage: 'In Progress', due: 'Today', efficiency: '91%' },
        { id: 'MO-1045', product: 'AI Compute Rack', qty: 18, stage: 'Planned', due: 'Tomorrow', efficiency: '86%' },
        { id: 'MO-1048', product: 'Biometric Device Kit', qty: 42, stage: 'Quality Check', due: '2 days', efficiency: '94%' },
    ];

    const bomSummary = [
        { label: 'Open Work Orders', value: '12' },
        { label: 'Ready to Start', value: '4' },
        { label: 'Avg. Cycle Time', value: '5.8h' },
        { label: 'Capacity Utilization', value: '82%' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121a2b] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                            MANUFACTURING
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Odoo-style production flow</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Production Planning & Work Orders</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bills of materials, capacity planning, and work-order execution across warehouses and shops.</p>
                </div>

                <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>New Work Order</span>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bomSummary.map((item) => (
                    <div key={item.label} className="bg-white dark:bg-[#121a2b] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
                <div className="bg-white dark:bg-[#121a2b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <Factory className="w-4 h-4 text-amber-500" />
                            Production Orders
                        </div>
                        <button className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer">View all</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-[#172132] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">Order</th>
                                    <th className="py-3 px-4">Product</th>
                                    <th className="py-3 px-4">Qty</th>
                                    <th className="py-3 px-4">Stage</th>
                                    <th className="py-3 px-4">Due</th>
                                    <th className="py-3 px-4">Efficiency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                                {productionOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-[#162033] transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-amber-700 dark:text-amber-300">{order.id}</td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{order.product}</td>
                                        <td className="py-3.5 px-4">{order.qty}</td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                {order.stage}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">{order.due}</td>
                                        <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{order.efficiency}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-[#121a2b] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
                            <PackageCheck className="w-4 h-4 text-emerald-500" />
                            Manufacturing Status
                        </div>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between"><span>Materials Available</span><span className="font-bold text-emerald-600">92%</span></div>
                            <div className="flex items-center justify-between"><span>Labor Capacity</span><span className="font-bold text-amber-600">82%</span></div>
                            <div className="flex items-center justify-between"><span>Quality Yield</span><span className="font-bold text-sky-600">96%</span></div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#121a2b] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
                            <TimerReset className="w-4 h-4 text-sky-500" />
                            Maintenance & WIP
                        </div>
                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#172132] px-3 py-2"><span>Machine 3</span><span className="font-bold text-amber-600">Maintenance</span></div>
                            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#172132] px-3 py-2"><span>WIP Value</span><span className="font-bold">$384k</span></div>
                            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#172132] px-3 py-2"><span>Tooling</span><span className="font-bold text-emerald-600">Ready</span></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] text-white p-4 rounded-3xl border border-slate-700 shadow-2xs">
                        <div className="flex items-center gap-2 text-sm font-bold mb-2">
                            <Wrench className="w-4 h-4 text-amber-300" />
                            Capacity Insight
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            The next production batch is expected to complete 18% faster after material prep and queue balancing.
                        </p>
                        <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 cursor-pointer">
                            Open recommendations <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
