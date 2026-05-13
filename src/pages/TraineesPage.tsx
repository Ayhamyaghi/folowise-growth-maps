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
    <div className="space-y-8 transition-colors duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Trainees</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage and track roadmap progress for all team members</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-100 border border-surface-200 dark:border-zinc-800 rounded-xl flex p-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-surface-50 dark:bg-zinc-800 text-brand shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-surface-50 dark:bg-zinc-800 text-brand shadow-sm" : "text-slate-400 hover:text-slate-600")}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button className="px-5 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
            Add Trainee
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="w-full lg:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-100 border border-surface-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand/40 transition-all shadow-sm"
          />
        </div>

        <div className="flex-1 flex flex-wrap gap-2">
          {["All", ...Object.values(TraineeSpecialization)].map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveTab(spec as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border shrink-0",
                activeTab === spec 
                  ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                  : "bg-surface-100 border-surface-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm"
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
                "group relative card-elevation rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand/5 border border-surface-200 dark:border-zinc-800 bg-surface-100 dark:bg-zinc-900 transition-all duration-300",
                viewMode === "list" && "flex items-center p-3"
              )}
            >
              {viewMode === "grid" ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-surface-50 dark:bg-zinc-800 p-0.5 border border-surface-200 dark:border-zinc-700 relative shadow-sm transition-transform group-hover:scale-105 duration-300">
                      <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover rounded-[calc(1rem-2px)]" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-surface-100 dark:border-zinc-900 rounded-full shadow-sm" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className={cn(
                         "px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border",
                         trainee.roadmapStatus === "Active" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-slate-500/5 text-slate-500 border-slate-500/10"
                       )}>
                         {trainee.roadmapStatus}
                       </span>
                       <button className="text-slate-300 hover:text-brand transition-colors"><MoreVertical size={16}/></button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 truncate">{trainee.name}</h3>
                    <p className="text-[10px] font-black text-brand uppercase tracking-widest mt-1 opacity-80">{trainee.specialization}</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Progress</span>
                        <span className="text-xs font-black text-brand">{trainee.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${trainee.progress}%` }}
                           transition={{ duration: 1 }}
                           className="h-full bg-brand rounded-full shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Active Topic</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate mt-1 leading-tight">{trainee.activeTopic}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Last Update</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 mt-1 leading-tight">{trainee.lastUpdate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-surface-200 dark:border-zinc-800 flex gap-3">
                     <Link to={`/trainee/${trainee.id}`} className="flex-1 py-2.5 rounded-xl border border-surface-200 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-center hover:bg-surface-200 dark:hover:bg-zinc-800 transition-colors">
                       Profile
                     </Link>
                     <Link to={`/roadmap/${trainee.id}`} className="flex-1 py-2.5 rounded-xl bg-brand text-white text-[9px] font-black uppercase tracking-widest text-center hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand/10">
                       View Roadmap
                     </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-50 dark:bg-zinc-800 shrink-0 overflow-hidden border border-surface-200 dark:border-zinc-700">
                    <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 grid grid-cols-5 gap-6 items-center">
                    <div className="col-span-1">
                      <h4 className="text-sm font-bold truncate text-slate-900 dark:text-zinc-100">{trainee.name}</h4>
                      <p className="text-[9px] font-black text-brand uppercase tracking-widest truncate">{trainee.specialization}</p>
                    </div>
                    <div className="flex items-center gap-3 col-span-1">
                      <div className="flex-1 h-1 bg-surface-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${trainee.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black w-8 text-right underline underline-offset-2 decoration-brand/30">{trainee.progress}%</span>
                    </div>
                    <div className="truncate col-span-1 border-l border-surface-200 dark:border-zinc-800 pl-4">
                       <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase">Active Topic</p>
                       <p className="text-[11px] font-bold truncate leading-tight mt-0.5">{trainee.activeTopic}</p>
                    </div>
                    <div className="truncate col-span-1 border-l border-surface-200 dark:border-zinc-800 pl-4">
                       <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase">Last Update</p>
                       <p className="text-[11px] font-bold truncate leading-tight mt-0.5">{trainee.lastUpdate}</p>
                    </div>
                    <div className="flex justify-end gap-2 col-span-1">
                       <Link to={`/trainee/${trainee.id}`} title="Profile" className="p-2 text-slate-400 hover:text-brand transition-colors"><Mail size={16} /></Link>
                       <Link to={`/roadmap/${trainee.id}`} className="bg-brand/5 dark:bg-brand/10 p-2 text-brand rounded-lg hover:bg-brand hover:text-white transition-all">
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-surface-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-300 dark:text-zinc-700 mb-2">
            <Search size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">No trainees matched your criteria</h3>
            <p className="text-slate-500 dark:text-zinc-500 text-sm max-w-xs mx-auto">Try refining your search or specialization selection.</p>
          </div>
          <button onClick={() => { setSearchTerm(""); setActiveTab("All"); }} className="text-brand font-black text-[10px] uppercase tracking-widest mt-4 underline-offset-4 hover:underline">
            Reset Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
