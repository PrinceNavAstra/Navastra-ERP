import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Warehouse, 
  AlertTriangle, 
  Search, 
  Barcode, 
  CheckCircle2, 
  Layers,
  Truck
} from 'lucide-react';

export const InventoryAppView: React.FC = () => {
  const [items, setItems] = useState([
    { sku: 'NAV-SRV-01', name: 'Enterprise Cloud Gateway Appliance', category: 'Hardware', onHand: 42, incoming: 15, location: 'Warehouse Alpha (SF)', minQty: 10, status: 'In Stock' },
    { sku: 'NAV-SRV-02', name: 'Dedicated AI Compute Module rack', category: 'Compute', onHand: 8, incoming: 20, location: 'Warehouse Beta (NY)', minQty: 5, status: 'In Stock' },
    { sku: 'NAV-SEC-09', name: 'Biometric Access Keycard Node', category: 'Security', onHand: 140, incoming: 0, location: 'Warehouse Alpha (SF)', minQty: 50, status: 'In Stock' },
    { sku: 'NAV-CAB-12', name: 'High-Speed Fiber Optical Link 100G', category: 'Cabling', onHand: 4, incoming: 50, location: 'Warehouse Gamma (TX)', minQty: 15, status: 'Low Stock' },
    { sku: 'NAV-PWR-44', name: 'Redundant Power Distribution Unit', category: 'Power', onHand: 19, incoming: 10, location: 'Warehouse Beta (NY)', minQty: 8, status: 'In Stock' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
              INVENTORY MODULE
            </span>
            <span className="text-xs text-slate-400 font-medium">Multi-Warehouse ERP Stock Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Inventory & Stock Operations</h2>
          <p className="text-xs text-slate-500">Real-time stock valuation, internal inventory moves, delivery orders, and automatic reordering rules.</p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Receive Products</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Total Stock Value</div>
          <div className="text-xl font-bold text-slate-900">$1,248,500</div>
          <div className="text-[10px] text-purple-600 font-medium">3 Active Warehouses</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Incoming Deliveries</div>
          <div className="text-xl font-bold text-slate-900">95 Units</div>
          <div className="text-[10px] text-emerald-600 font-medium">En route this week</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Low Stock Alerts</div>
          <div className="text-xl font-bold text-amber-600">1 Item Low</div>
          <div className="text-[10px] text-amber-600 font-medium">Reorder triggered</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Stock Turnover</div>
          <div className="text-xl font-bold text-slate-900">6.8x</div>
          <div className="text-[10px] text-slate-500 font-medium">Annualized velocity</div>
        </div>
      </div>

      {/* Product Stock Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search SKU, product, warehouse..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Warehouse</th>
                <th className="py-3 px-4">On Hand</th>
                <th className="py-3 px-4">Incoming</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-purple-700">{item.sku}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.location}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.onHand} units</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-semibold">+{item.incoming}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'Low Stock' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer">
                      Transfer
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
