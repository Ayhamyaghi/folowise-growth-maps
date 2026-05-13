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
  CheckCircle2,
  Clock,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { mockActivity } from "../data/mockData";
import { cn } from "../lib/utils";

export default function ActivityPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto transition-colors duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Activity Log</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Audit-ready historical record of all Folowise roadmap events</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-100 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-50 transition-all shadow-sm">
              <Download size={14} /> EXPORT CSV
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-100 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-50 transition-all shadow-sm">
              <Calendar size={14} /> DATE RANGE
           </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
           <input 
            type="text" 
            placeholder="Search activity..." 
            className="w-full pl-12 pr-4 py-3 bg-surface-100 border border-surface-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all shadow-sm"
           />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-surface-100 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-50 transition-all shadow-sm">
           <Filter size={18} /> FILTERS
        </button>
      </div>

      <div className="card-elevation rounded-3xl overflow-hidden shadow-sm border border-surface-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-50 dark:bg-zinc-950 border-b border-surface-200 dark:border-zinc-800 text-slate-400">
                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">Actor</th>
                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">Action</th>
                <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">Entity</th>
                <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody>
              {mockActivity.map((event, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={event.id} 
                  className="group hover:bg-surface-50 dark:hover:bg-zinc-800/30 transition-colors border-b border-surface-100 dark:border-zinc-800 last:border-0"
                >
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      event.type === "progress" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                      event.type === "approval" ? "bg-brand/10 text-brand border border-brand/20" :
                      event.type === "rejection" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20" :
                      "bg-slate-500/10 text-slate-500 dark:text-zinc-400 border border-slate-500/20"
                    )}>
                      {event.type}
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-[13px] font-bold text-slate-900 dark:text-zinc-100">{event.user}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-[13px] text-slate-500 uppercase font-black text-[10px] tracking-tight">{event.action}</td>
                  <td className="px-8 py-4 text-[13px] font-bold truncate max-w-xs text-slate-800 dark:text-zinc-200">{event.target}</td>
                  <td className="px-8 py-4 whitespace-nowrap text-right text-[11px] text-slate-400 font-bold tabular-nums">{event.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-center py-6">
         <button className="text-[10px] font-black text-slate-400 hover:text-brand uppercase tracking-[0.2em] transition-all">Load More Activity</button>
      </div>
    </div>
  );
}

function X({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
