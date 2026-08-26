import React, { useState } from 'react';
import { Users, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Contact } from '../../types';

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateContact: (contact: Omit<Contact, 'id'>) => void;
}

export const NewContactModal: React.FC<NewContactModalProps> = ({
  isOpen,
  onClose,
  onCreateContact
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('USA');
  const [address, setAddress] = useState('');
  const [tagsInput, setTagsInput] = useState('Executive, Decision Maker');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) return;

    onCreateContact({
      name,
      email,
      phone: phone || '+1 (555) 012-4921',
      company,
      role: role || 'Business Leader',
      city,
      country,
      address: address || `${city}, ${country}`,
      lat: 37.7749,
      lng: -122.4194,
      lastContacted: new Date().toISOString().split('T')[0],
      totalDealsValue: 50000,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      notes: 'Added to OmniCRM contact directory.'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Add Enterprise Contact</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Role / Title</label>
              <input
                type="text"
                placeholder="Chief Technology Officer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company *</label>
              <input
                type="text"
                required
                placeholder="Apex Technologies Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="sarah.j@apextech.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (650) 430-8910"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City & Country</label>
              <input
                type="text"
                placeholder="San Francisco, USA"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Address (For Google Maps Territory)</label>
            <input
              type="text"
              placeholder="500 Howard Street, Suite 400, San Francisco, CA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="Executive Sponsor, Cloud Champion"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
