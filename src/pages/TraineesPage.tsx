/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar, 
  TrendingUp,
  Grid,
  List as ListIcon,
  ChevronRight
} from "lucide-react";
import { mockTrainees, TraineeSpecialization } from "../data/mockData";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

export default function TraineesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TraineeSpecialization | "All">("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTrainees = mockTrainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || trainee.specialization === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">Trainees</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Manage and track roadmap progress for all team members</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-border-subtle rounded-2xl flex p-1.5 shadow-sm transition-all">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2.5 rounded-xl transition-all", viewMode === "grid" ? "bg-slate-50 text-brand shadow-sm border border-slate-100" : "text-text-tertiary hover:text-text-primary")}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2.5 rounded-xl transition-all", viewMode === "list" ? "bg-slate-50 text-brand shadow-sm border border-slate-100" : "text-text-tertiary hover:text-text-primary")}
            >
              <ListIcon size={20} />
            </button>
          </div>
          <button className="px-7 py-3.5 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/20">
            Add New Trainee
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:w-96 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-border-subtle rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-brand/[0.03] focus:border-brand/30 transition-all shadow-sm group-hover:border-slate-200"
          />
        </div>

        <div className="flex-1 flex flex-wrap gap-2.5">
          {["All", ...Object.values(TraineeSpecialization)].map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveTab(spec as any)}
              className={cn(
                "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all border shrink-0",
                activeTab === spec 
                  ? "bg-brand border-brand text-white shadow-xl shadow-brand/10" 
                  : "bg-white border-border-subtle text-text-tertiary hover:border-slate-300 shadow-sm"
              )}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Trainee Grid */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-3"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredTrainees.map((trainee, idx) => (
            <motion.div
              layout
              key={trainee.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={cn(
                "group relative card-elevation rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-brand/5 border border-slate-100 bg-white transition-all duration-300",
                viewMode === "list" && "flex items-center p-3"
              )}
            >
              {viewMode === "grid" ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white p-1 border border-border-subtle relative shadow-md transition-transform group-hover:scale-105 duration-500">
                      <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover rounded-[1.25rem]" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg shadow-emerald-500/20" />
                    </div>
                    <div className="flex flex-col items-end gap-2.5">
                       <span className={cn(
                         "px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border shadow-sm",
                         trainee.roadmapStatus === "Active" ? "bg-bg-success text-status-success border-border-subtle" : "bg-surface-soft text-text-tertiary border-border-subtle"
                       )}>
                         {trainee.roadmapStatus}
                       </span>
                       <button className="text-text-tertiary hover:text-brand transition-colors p-1.5 bg-slate-50 rounded-lg"><MoreVertical size={16}/></button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-brand transition-colors truncate tracking-tight">{trainee.name}</h3>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5 opacity-60">{trainee.specialization}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest leading-none opacity-60">Overall Path Progress</span>
                        <div className="flex items-center gap-1.5">
                           <TrendingUp size={11} className="text-brand opacity-40" />
                           <span className="text-sm font-black text-brand leading-none">{trainee.progress}%</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-surface-secondary rounded-full overflow-hidden p-0.5 border border-border-subtle shadow-inner">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${trainee.progress}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className="h-full bg-brand rounded-full shadow-xl shadow-brand/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.1em] opacity-60">Focus Topic</p>
                        <p className="text-[11px] font-bold text-text-secondary truncate mt-1.5 leading-tight py-1.5 px-3 bg-surface-soft rounded-xl border border-border-subtle">{trainee.activeTopic}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.1em] opacity-60">Last sync</p>
                        <p className="text-[11px] font-bold text-text-secondary mt-1.5 leading-tight py-1.5 px-3 bg-surface-soft rounded-xl border border-border-subtle">{trainee.lastUpdate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border-subtle flex gap-3">
                     <Link to={`/trainee/${trainee.id}`} className="flex-1 py-2.5 rounded-xl border border-border-subtle text-[10px] font-black uppercase tracking-[0.2em] text-center text-text-secondary hover:bg-slate-50 transition-all shadow-sm">
                       Details
                     </Link>
                     <Link to={`/roadmap/${trainee.id}`} className="flex-1 py-2.5 rounded-xl bg-brand text-white text-[10px] font-black uppercase tracking-[0.2em] text-center hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
                       Roadmap
                     </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-5 px-6 py-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white shrink-0 overflow-hidden border border-slate-100 shadow-sm">
                    <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 grid grid-cols-5 gap-8 items-center">
                    <div className="col-span-1 min-w-0">
                      <h4 className="text-sm font-bold truncate text-slate-900">{trainee.name}</h4>
                      <p className="text-[9px] font-black text-brand uppercase tracking-widest truncate">{trainee.specialization}</p>
                    </div>
                    <div className="flex items-center gap-4 col-span-1">
                      <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${trainee.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black w-8 text-right text-slate-400">{trainee.progress}%</span>
                    </div>
                    <div className="col-span-1 min-w-0 hidden md:block">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Topic</p>
                       <p className="text-[11px] font-bold truncate mt-1 text-slate-700">{trainee.activeTopic}</p>
                    </div>
                    <div className="col-span-1 min-w-0 hidden lg:block">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update</p>
                       <p className="text-[11px] font-bold truncate mt-1 text-slate-700">{trainee.lastUpdate}</p>
                    </div>
                    <div className="flex justify-end gap-3 col-span-1">
                       <Link to={`/trainee/${trainee.id}`} className="p-2 text-slate-300 hover:text-brand transition-colors"><Mail size={18} /></Link>
                       <Link to={`/roadmap/${trainee.id}`} className="bg-brand/5 p-2 text-brand rounded-xl hover:bg-brand hover:text-white transition-all">
                         <ChevronRight size={18} />
                       </Link>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTrainees.length === 0 && (
        <motion.div 
           initial={{ opacity: 0, y: 10 }} 
           animate={{ opacity: 1, y: 0 }} 
           className="py-32 flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No trainees found</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">We couldn't find any team members matching your current filters or search term.</p>
          <button 
             onClick={() => { setSearchTerm(""); setActiveTab("All"); }} 
             className="mt-8 px-6 py-2.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-all"
          >
            Clear Search & Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
