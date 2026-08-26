import React, { useState } from 'react';
import { UserCheck, Sparkles, Flame } from 'lucide-react';
import { Lead, LeadTemperature } from '../../types';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onCreateLead
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [temperature, setTemperature] = useState<LeadTemperature>('Hot');
  const [estimatedValue, setEstimatedValue] = useState(90000);
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('USA');
  const [source, setSource] = useState('Website Inbound');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) return;

    onCreateLead({
      name,
      company,
      title: title || 'Executive Decision Maker',
      email,
      phone: phone || '+1 (555) 019-2834',
      status: 'New',
      score: temperature === 'Hot' ? 92 : temperature === 'Warm' ? 70 : 45,
      temperature,
      source,
      estimatedValue: Number(estimatedValue),
      city,
      country,
      lat: 37.7749,
      lng: -122.4194,
      assignedTo: 'Alex Rivera',
      notes,
      aiInsights: 'Inbound enterprise prospect qualified via OmniCRM.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Add Inbound Prospect / Lead</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="Samantha Ray"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company *</label>
              <input
                type="text"
                required
                placeholder="Quantum Dynamics AI"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="samantha@quantumdynamics.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                placeholder="+1 (415) 890-3412"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Temperature</label>
              <select
                value={temperature}
                onChange={(e) => setTemperature(e.target.value as LeadTemperature)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">⚡ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Est. Value ($)</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lead Notes & Inbound Context</label>
            <textarea
              rows={3}
              placeholder="Requirements mentioned by lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
