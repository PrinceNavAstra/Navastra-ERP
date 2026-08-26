import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  Search, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const ProjectsAppView: React.FC = () => {
  const [tasks] = useState([
    { id: 'TSK-101', title: 'Implement Google Meet direct OAuth token bridge', project: 'Navastra Core v18', assignee: 'Alex Rivera', stage: 'In Progress', priority: 'High', due: 'Tomorrow' },
    { id: 'TSK-102', title: 'Audit Aurora House invoice delivery SLA & ERP webhook', project: 'Client Onboarding', assignee: 'Sarah Chen', stage: 'Done', priority: 'Urgent', due: 'Completed' },
    { id: 'TSK-103', title: 'Multi-warehouse double-entry stock reconciliation', project: 'Inventory Engine', assignee: 'Elena Rostova', stage: 'Review', priority: 'Medium', due: 'Mar 24' },
    { id: 'TSK-104', title: 'Configure Gemini High Thinking step visualization drawer', project: 'AI Studio Copilot', assignee: 'Marcus Vance', stage: 'In Progress', priority: 'High', due: 'Mar 22' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold">
              PROJECTS & TASKS
            </span>
            <span className="text-xs text-slate-400 font-medium">Navastra Agile Work Management</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Project Sprints & Deliverables</h2>
          <p className="text-xs text-slate-500">Track milestone timelines, task status, developer sprint workloads, and deliverable commitments.</p>
        </div>

        <button className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Project Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Backlog', 'In Progress', 'Review', 'Done'].map((col) => {
          const colTasks = tasks.filter(t => 
            col === 'Backlog' ? t.stage === 'Backlog' :
            col === 'In Progress' ? t.stage === 'In Progress' :
            col === 'Review' ? t.stage === 'Review' :
            t.stage === 'Done'
          );

          return (
            <div key={col} className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-xs text-slate-700">{col}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {colTasks.map(t => (
                  <div key={t.id} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-cyan-700">{t.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        t.priority === 'Urgent' ? 'bg-red-50 text-red-700' :
                        t.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 leading-snug">{t.title}</div>
                    
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{t.assignee}</span>
                      <span className="text-slate-600 font-bold">{t.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
