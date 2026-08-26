import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface GoogleCalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const GoogleCalendarView: React.FC<GoogleCalendarViewProps> = ({
  events,
  onAddEvent
}) => {
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [viewType, setViewType] = useState<'month' | 'agenda'>('agenda');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-08-26T10:00:00');
  const [endDate, setEndDate] = useState('2026-08-26T11:00:00');
  const [attendees, setAttendees] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<'meeting' | 'demo' | 'review'>('meeting');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const meetLink = `https://meet.google.com/omni-cal-${Math.random().toString(36).substring(2, 6)}`;

    onAddEvent({
      title,
      start: startDate,
      end: endDate,
      location: 'Google Meet',
      attendees: attendees.split(',').map(a => a.trim()).filter(Boolean),
      description,
      meetLink,
      type: eventType
    });

    setIsAddingEvent(false);
    setTitle('');
    setDescription('');
    setAttendees('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col overflow-hidden space-y-4">
      {/* Top Bar with Workspace Synced Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-2xs shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Google Calendar Workspace</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Live 2-Way Synced
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Synchronized schedules for pipeline demos, contract negotiations, and executive reviews.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewType('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewType === 'agenda' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Agenda View
            </button>
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewType === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Month Grid
            </button>
          </div>

          <button
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Calendar Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Content */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs min-h-0">
        {viewType === 'agenda' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Schedule ({events.length} Events)</h3>
              <span className="text-xs text-slate-500 font-medium">Showing August 2026</span>
            </div>

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{event.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        event.type === 'meeting' ? 'bg-indigo-100 text-indigo-800' :
                        event.type === 'demo' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {event.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.attendees.length} Attendees</span>
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-xs text-slate-500 max-w-xl">{event.description}</p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center space-x-2">
                    {event.meetLink && (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-emerald-200/80"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Google Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Month Grid Representation */
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2 h-96">
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dayEvents = events.filter(e => new Date(e.start).getDate() === dayNum);
                return (
                  <div
                    key={i}
                    className="p-2 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-700">{dayNum}</span>
                    <div className="space-y-1">
                      {dayEvents.map(ev => (
                        <div
                          key={ev.id}
                          className="p-1 text-[10px] font-bold bg-blue-100 text-blue-800 rounded truncate"
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Add Google Calendar Event</h3>
              </div>
              <button onClick={() => setIsAddingEvent(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sterling Capital Security Architecture Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attendees (comma separated)</label>
                <input
                  type="text"
                  placeholder="client@apextech.io, cfo@omnicrm.enterprise"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the call agenda..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Sync to Calendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
