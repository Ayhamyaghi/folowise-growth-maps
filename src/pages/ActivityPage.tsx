/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Search,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { activityApi, ActivityEventResponse } from "../lib/apiClient";
import { cn } from "../lib/utils";

function mapEventType(eventType: string): "progress" | "approval" | "rejection" | "system" {
  switch (eventType) {
    case 'REQUEST_APPROVED': return 'approval';
    case 'REQUEST_REJECTED': return 'rejection';
    case 'SYSTEM':
    case 'ROADMAP_CREATED':
    case 'ROADMAP_COPIED':
      return 'system';
    default:
      return 'progress';
  }
}

function formatEventType(eventType: string): string {
  return eventType.toLowerCase().replace(/_/g, ' ');
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityPage() {
  const [events, setEvents] = useState<ActivityEventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    activityApi.listEvents()
      .then(setEvents)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
     <div className="space-y-6 max-w-5xl mx-auto pb-20 px-4 md:px-0">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">Activity Log</h1>
           <p className="text-text-secondary mt-1 text-xs font-medium">Audit-ready historical record of all roadmap events</p>
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm text-text-secondary active:scale-95">
               <Download size={14} className="text-brand opacity-60" strokeWidth={3} /> EXPORT
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm text-text-secondary active:scale-95">
               <Calendar size={14} className="text-brand opacity-60" strokeWidth={3} /> DATES
            </button>
         </div>
       </header>

       <div className="flex flex-col md:flex-row gap-3">
         <div className="flex-1 relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" strokeWidth={3} />
            <input
             type="text"
             placeholder="Search activity..."
             className="w-full pl-11 pr-5 py-2.5 bg-white border border-border-subtle rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-brand/[0.03] transition-all shadow-sm"
            />
         </div>
         <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border-subtle rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm text-text-secondary active:scale-95">
            <Filter size={16} className="text-brand opacity-60" strokeWidth={3} /> FILTERS
         </button>
       </div>

       <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-border-subtle">
         {isLoading ? (
           <div className="p-12 text-center text-text-tertiary text-[9px] font-black uppercase tracking-widest opacity-60">Loading...</div>
         ) : error ? (
           <div className="p-12 text-center text-status-danger text-sm font-bold">{error}</div>
         ) : events.length === 0 ? (
           <div className="p-12 text-center">
             <Activity size={32} className="mx-auto mb-3 text-text-tertiary opacity-20" />
             <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-40">No activity recorded yet</p>
           </div>
         ) : (
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full border-collapse">
               <thead>
                 <tr className="bg-surface-soft border-b border-border-standard text-text-tertiary">
                   <th className="px-5 py-3.5 text-left text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Classification</th>
                   <th className="px-5 py-3.5 text-left text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Lead</th>
                   <th className="px-5 py-3.5 text-left text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Event</th>
                   <th className="px-5 py-3.5 text-left text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Description</th>
                   <th className="px-5 py-3.5 text-right text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle">
                 {events.map((event) => {
                   const type = mapEventType(event.eventType);
                   return (
                     <tr key={event.id} className="group hover:bg-slate-50/50 transition-all">
                       <td className="px-5 py-3 whitespace-nowrap">
                         <div className={cn(
                           "inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] border border-border-subtle shadow-sm",
                           type === "progress" ? "bg-bg-success text-status-success" :
                           type === "approval" ? "bg-bg-brand-soft text-brand" :
                           type === "rejection" ? "bg-bg-danger text-status-danger" :
                           "bg-surface-soft text-text-tertiary"
                         )}>
                           {type}
                         </div>
                       </td>
                       <td className="px-5 py-3 whitespace-nowrap font-display font-black text-[13px] text-text-primary tracking-tight">{event.actorName ?? 'System'}</td>
                       <td className="px-5 py-3 whitespace-nowrap text-[8px] text-text-tertiary uppercase font-black tracking-[0.1em]">{formatEventType(event.eventType)}</td>
                       <td className="px-5 py-3 font-bold text-[13px] text-text-secondary tracking-tight truncate max-w-[200px]">{event.summary}</td>
                       <td className="px-5 py-3 whitespace-nowrap text-right text-[10px] text-text-tertiary font-bold tabular-nums opacity-60">{formatTime(event.createdAt)}</td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
       </div>

       <div className="flex justify-center pt-4">
          <button className="flex items-center gap-2.5 px-6 py-3 bg-white border border-border-subtle rounded-xl text-[9px] font-black text-text-tertiary hover:text-brand uppercase tracking-[0.4em] transition-all opacity-40 hover:opacity-100 active:scale-95">
             <Activity size={14} /> SCAN RECORDS
          </button>
       </div>
     </div>
  );
}
