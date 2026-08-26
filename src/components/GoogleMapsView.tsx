import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  Users, 
  Sparkles, 
  Video, 
  Mail, 
  ExternalLink, 
  Flame, 
  DollarSign, 
  Car, 
  Check, 
  Route
} from 'lucide-react';
import { Account, Lead, Contact } from '../types';

interface GoogleMapsViewProps {
  accounts: Account[];
  leads: Lead[];
  contacts: Contact[];
  onComposeEmail: (email: string, name: string) => void;
  onLaunchMeeting: (name: string, email: string, title: string) => void;
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  accounts,
  leads,
  contacts,
  onComposeEmail,
  onLaunchMeeting,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<Account | Lead | null>(accounts[0] || null);
  const [filterType, setFilterType] = useState<'all' | 'accounts' | 'leads'>('all');
  
  // Route Planner State
  const [routeStops, setRouteStops] = useState<string[]>(['Apex Technologies Corp', 'Hyperion Manufacturing']);
  const [optimizedPlan, setOptimizedPlan] = useState<string | null>(null);
  const [isOptimizingRoute, setIsOptimizingRoute] = useState(false);

  // Combine entities with coordinates
  const mapEntities = [
    ...accounts.map(a => ({ ...a, entityType: 'account' as const })),
    ...leads.map(l => ({ ...l, entityType: 'lead' as const }))
  ].filter(e => {
    if (filterType === 'accounts' && e.entityType !== 'account') return false;
    if (filterType === 'leads' && e.entityType !== 'lead') return false;
    return true;
  });

  const toggleRouteStop = (name: string) => {
    if (routeStops.includes(name)) {
      setRouteStops(routeStops.filter(s => s !== name));
    } else {
      setRouteStops([...routeStops, name]);
    }
  };

  const handleOptimizeRoute = async () => {
    if (routeStops.length < 2) return;
    setIsOptimizingRoute(true);
    try {
      const selectedEntities = mapEntities.filter(e => routeStops.includes(e.name));
      const res = await fetch('/api/ai/fast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick_summary',
          payload: {
            data: selectedEntities,
            prompt: `You are a Google Maps Field Sales Logistics Optimizer. 
Generate an optimal visiting itinerary for these ${selectedEntities.length} client locations:
${selectedEntities.map(e => `${e.name} in ${e.city}, ${e.country} (${'address' in e ? e.address : `${e.city}, ${e.country}`})`).join('\n')}

Output:
1. Recommended Visit Order (Stop 1, Stop 2, etc.)
2. Estimated driving/travel schedule
3. Key executive objective for each stop`
          }
        })
      });
      const data = await res.json();
      if (data.result) {
        setOptimizedPlan(data.result);
      }
    } catch (err) {
      console.error('Failed to optimize route', err);
    } finally {
      setIsOptimizingRoute(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Google Maps Territory & Field Dispatch Intelligence</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Interactive Global Radar
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Visualize customer concentrations, plan executive field visits, and optimize multi-stop itineraries.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Locations ({mapEntities.length})</option>
            <option value="accounts">Enterprise Accounts</option>
            <option value="leads">Inbound Leads</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Map Stage, Right Entity Inspector & Route Planner */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Map Stage (Interactive Visualization) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden relative flex flex-col border border-slate-800 shadow-md">
          {/* Simulated High-Definition Google Maps Canvas */}
          <div className="flex-1 relative bg-radial from-slate-900 via-slate-950 to-slate-950 p-6 flex flex-col justify-between">
            {/* Map Overlay Header */}
            <div className="flex items-center justify-between z-10">
              <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs text-white flex items-center space-x-2 shadow-md">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold">Global Sales Territory Radar</span>
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>Accounts</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block ml-2" />
                <span>Hot Leads</span>
              </div>
            </div>

            {/* Pins on Canvas with interactive selection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-auto py-6 z-10">
              {mapEntities.map((entity) => {
                const isSelected = selectedEntity?.name === entity.name;
                const isAccount = entity.entityType === 'account';
                const inRoute = routeStops.includes(entity.name);

                return (
                  <div
                    key={entity.id}
                    onClick={() => setSelectedEntity(entity)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border backdrop-blur-md ${
                      isSelected
                        ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg scale-105'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isAccount ? 'bg-blue-400' : 'bg-red-400'}`} />
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{entity.name}</span>
                      </div>
                      {inRoute && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/40">
                          Route
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{entity.city}, {entity.country}</span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-700/60">
                      <span className="text-slate-400 font-medium">
                        {isAccount ? 'Enterprise' : 'Lead'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleRouteStop(entity.name); }}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                          inRoute ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {inRoute ? '✓ In Route' : '+ Add Stop'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Google Maps Branding & Status */}
            <div className="flex items-center justify-between z-10 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-emerald-400" />
                <span>Selected Route Stops: <strong>{routeStops.length} stops selected</strong></span>
              </div>
              <span>Google Maps Platform Grounded</span>
            </div>
          </div>
        </div>

        {/* Right Drawer: Selected Location Details & Route Optimizer */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          {/* Top Tabs / Header */}
          <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span>Location Inspector</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {selectedEntity ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-slate-900">{selectedEntity.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {'tier' in selectedEntity ? selectedEntity.tier : 'Lead'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{'address' in selectedEntity ? selectedEntity.address : `${selectedEntity.city}, ${selectedEntity.country}`}</span>
                  </p>
                </div>

                {/* Entity metrics */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                  {'annualRevenue' in selectedEntity && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-500">Annual Revenue:</span>
                      <strong className="text-slate-900">${(selectedEntity.annualRevenue / 1000000).toFixed(1)}M ARR</strong>
                    </div>
                  )}
                  {'estimatedValue' in selectedEntity && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-500">Pipeline Est. Value:</span>
                      <strong className="text-emerald-600">${selectedEntity.estimatedValue.toLocaleString()}</strong>
                    </div>
                  )}
                  {'primaryContact' in selectedEntity && (
                    <div className="flex justify-between text-slate-700">
                      <span className="text-slate-500">Primary Contact:</span>
                      <strong className="text-slate-900">{selectedEntity.primaryContact}</strong>
                    </div>
                  )}
                  {'email' in selectedEntity && (
                    <div className="flex justify-between text-slate-700 truncate">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-indigo-600 font-medium truncate">{selectedEntity.email}</span>
                    </div>
                  )}
                </div>

                {/* Direct Google Workspace Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onLaunchMeeting(selectedEntity.name, 'client@apextech.io', `Field Visit Prep: ${selectedEntity.name}`)}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-emerald-200/80"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Google Meet</span>
                  </button>
                  <button
                    onClick={() => onComposeEmail('client@apextech.io', selectedEntity.name)}
                    className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-red-200/80"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Google Mail</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-6">Select a customer pin on the map to inspect details</div>
            )}

            {/* Field Sales Route Planner Section */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Route className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Route Optimizer</h4>
                </div>
                <button
                  onClick={handleOptimizeRoute}
                  disabled={isOptimizingRoute || routeStops.length < 2}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isOptimizingRoute ? 'Optimizing...' : 'Calculate Route'}</span>
                </button>
              </div>

              {/* Selected stops list */}
              <div className="space-y-1.5">
                {routeStops.map((stop, idx) => (
                  <div key={stop} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs border border-slate-100">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {stop}
                    </span>
                    <button
                      onClick={() => toggleRouteStop(stop)}
                      className="text-slate-400 hover:text-red-600 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Optimized AI Itinerary Result */}
              {optimizedPlan && (
                <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed space-y-2">
                  <div className="font-bold text-indigo-900 flex items-center space-x-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Gemini Field Dispatch Itinerary:</span>
                  </div>
                  <div>{optimizedPlan}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
