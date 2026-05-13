/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Activity, 
  Search, 
  Calendar, 
  Download, 
  Filter,
} from "lucide-react";
import { mockActivity } from "../data/mockData";
import { cn } from "../lib/utils";

export default function ActivityPage() {
  return (
     <div className="space-y-8 max-w-5xl mx-auto pb-20 px-4 md:px-0">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
           <h1 className="text-3xl font-display font-black tracking-tight text-text-primary">Activity Log</h1>
           <p className="text-text-secondary mt-1 text-sm font-medium">Audit-ready historical record of all roadmap events</p>
         </div>
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border-subtle rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm text-text-secondary active:scale-95">
               <Download size={16} className="text-brand opacity-60" strokeWidth={3} /> EXPORT
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border-subtle rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm text-text-secondary active:scale-95">
               <Calendar size={16} className="text-brand opacity-60" strokeWidth={3} /> DATES
            </button>
         </div>
       </header>
 
       <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary" strokeWidth={3} />
            <input 
             type="text" 
             placeholder="Search activity..." 
             className="w-full pl-12 pr-6 py-3.5 bg-white border border-border-subtle rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand/[0.03] transition-all shadow-sm"
            />
         </div>
         <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-border-subtle rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm text-text-secondary active:scale-95">
            <Filter size={18} className="text-brand opacity-60" strokeWidth={3} /> FILTERS
         </button>
       </div>
 
       <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-border-subtle">
         <div className="overflow-x-auto custom-scrollbar">
           <table className="w-full border-collapse">
             <thead>
               <tr className="bg-surface-soft border-b border-border-standard text-text-tertiary">
                 <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Classification</th>
                 <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Lead</th>
                 <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Event</th>
                 <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Target</th>
                 <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Time</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border-subtle">
               {mockActivity.map((event, i) => (
                 <tr key={event.id} className="group hover:bg-slate-50/50 transition-all">
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className={cn(
                       "inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-border-subtle shadow-sm",
                       event.type === "progress" ? "bg-bg-success text-status-success" :
                       event.type === "approval" ? "bg-bg-brand-soft text-brand" :
                       event.type === "rejection" ? "bg-bg-danger text-status-danger" :
                       "bg-surface-soft text-text-tertiary"
                     )}>
                       {event.type}
                     </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap font-display font-black text-sm text-text-primary tracking-tight">{event.user}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-[9px] text-text-tertiary uppercase font-black tracking-[0.1em]">{event.action}</td>
                   <td className="px-6 py-4 font-bold text-sm text-text-secondary tracking-tight truncate max-w-[200px]">{event.target}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-right text-[11px] text-text-tertiary font-bold tabular-nums opacity-60">{event.time}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
       
       <div className="flex justify-center pt-6">
          <button className="flex items-center gap-3 px-8 py-4 bg-white border border-border-subtle rounded-2xl text-[10px] font-black text-text-tertiary hover:text-brand uppercase tracking-[0.4em] transition-all opacity-40 hover:opacity-100 active:scale-95">
             <Activity size={16} /> SCAN RECORDS
          </button>
       </div>
     </div>
  );
}
