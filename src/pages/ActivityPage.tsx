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
    <div className="space-y-12 max-w-6xl mx-auto pb-24 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">Activity Log</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Audit-ready historical record of all Folowise roadmap events</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-white border border-border-subtle rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-text-secondary active:scale-95">
              <Download size={18} className="text-brand opacity-60" strokeWidth={2.5} /> EXPORT CSV
           </button>
           <button className="flex items-center gap-3 px-8 py-4 bg-white border border-border-subtle rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-text-secondary active:scale-95">
              <Calendar size={18} className="text-brand opacity-60" strokeWidth={2.5} /> DATE RANGE
           </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
           <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" strokeWidth={2.5} />
           <input 
            type="text" 
            placeholder="Search activity records..." 
            className="w-full pl-16 pr-8 py-5 bg-white border border-border-subtle rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand/[0.03] focus:border-brand/30 transition-all shadow-sm placeholder:text-text-tertiary/40 text-text-primary"
           />
        </div>
        <button className="flex items-center gap-3 px-10 py-5 bg-white border border-border-subtle rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-text-secondary active:scale-95">
           <Filter size={20} className="text-brand opacity-60" strokeWidth={2.5} /> ADVANCED FILTERS
        </button>
      </div>

      <div className="card-elevation rounded-[3rem] overflow-hidden shadow-2xl shadow-black/[0.02] border border-border-subtle bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-soft border-b border-border-standard text-text-tertiary">
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Classification</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Strategy Lead</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Event Type</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Target Entity</th>
                <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Chronology</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {mockActivity.map((event, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  key={event.id} 
                  className="group hover:bg-slate-50/50 transition-all"
                >
                  <td className="px-10 py-6 whitespace-nowrap">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border",
                      event.type === "progress" ? "bg-bg-success text-status-success border-border-subtle" :
                      event.type === "approval" ? "bg-bg-brand-soft text-brand border-border-subtle" :
                      event.type === "rejection" ? "bg-bg-danger text-status-danger border-border-subtle" :
                      "bg-surface-soft text-text-tertiary border-border-subtle"
                    )}>
                      {event.type}
                    </div>
                  </td>
                  <td className="px-10 py-6 whitespace-nowrap font-display font-black text-text-primary tracking-tight">{event.user}</td>
                  <td className="px-10 py-6 whitespace-nowrap text-[10px] text-text-tertiary uppercase font-black tracking-[0.1em]">{event.action}</td>
                  <td className="px-10 py-6 font-bold truncate max-w-xs text-text-secondary tracking-tight">{event.target}</td>
                  <td className="px-10 py-6 whitespace-nowrap text-right text-xs text-text-tertiary font-bold tabular-nums opacity-60">{event.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-center pt-8">
         <button className="flex items-center gap-4 px-12 py-5 bg-white border border-border-subtle rounded-[2.5rem] text-[11px] font-black text-text-tertiary hover:text-brand hover:border-brand/20 uppercase tracking-[0.5em] transition-all shadow-xl shadow-black/[0.02] opacity-40 hover:opacity-100 active:scale-95 leading-none">
            <Activity size={18} /> SCAN STRATEGIC RECORDS
         </button>
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
