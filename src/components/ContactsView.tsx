import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Video, 
  MapPin, 
  Building2, 
  Sparkles, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Contact } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onOpenNewContact: () => void;
  onComposeEmail: (email: string, name: string) => void;
  onLaunchMeeting: (name: string, email: string, title: string) => void;
  onLocateOnMap: (address: string) => void;
  onGenerateDossier: (contact: Contact) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onOpenNewContact,
  onComposeEmail,
  onLaunchMeeting,
  onLocateOnMap,
  onGenerateDossier
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contacts by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <button
          id="contacts-new-btn"
          onClick={onOpenNewContact}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Grid of Contact Cards */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header Profile */}
              <div className="flex items-start space-x-3.5">
                <img
                  src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=6366f1&color=fff`}
                  alt={contact.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium truncate">{contact.role}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-0.5 truncate">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{contact.company}</span>
                  </p>
                </div>
              </div>

              {/* Contact Info details */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.city}, {contact.country}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onComposeEmail(contact.email, contact.name)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Send Google Mail"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onLaunchMeeting(contact.name, contact.email, `Sync with ${contact.name}`)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Launch Google Meet"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onLocateOnMap(contact.address)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Locate on Google Maps"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onGenerateDossier(contact)}
                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
