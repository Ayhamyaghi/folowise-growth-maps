/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  Award, 
  TrendingUp, 
  ExternalLink,
  MessageSquare,
  MoreVertical,
  ShieldAlert
} from "lucide-react";
import { mockTrainees } from "../data/mockData";

export default function TraineeProfilePage() {
  const { id } = useParams();
  const trainee = mockTrainees.find(t => t.id === id) || mockTrainees[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 transition-colors duration-500">
      <Link to="/trainees" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        BACK TO ALL TRAINEES
      </Link>

      <div className="card-elevation rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent relative border-b border-surface-200 dark:border-transparent">
           <div className="absolute inset-0 opacity-[0.03] dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <button className="absolute top-6 right-8 p-2.5 bg-surface-100/40 hover:bg-surface-100/60 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md rounded-2xl transition-all border border-white/20 text-slate-600 dark:text-white shadow-sm">
              <MoreVertical size={20} />
           </button>
        </div>

        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 mb-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-surface-100 dark:bg-zinc-950 p-1.5 shadow-2xl relative border border-surface-200 dark:border-transparent transition-transform hover:scale-[1.02] duration-500">
               <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover rounded-[2.1rem] border border-surface-200 dark:border-zinc-800 shadow-sm" />
               <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-surface-100 dark:bg-zinc-950 border-4 border-surface-100 dark:border-zinc-950 rounded-full flex items-center justify-center">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               </div>
            </div>
            <div className="flex-1 pb-2">
               <h1 className="text-4xl font-display font-black tracking-tight">{trainee.name}</h1>
               <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-2">
                  <span className="flex items-center gap-2 text-brand font-bold text-sm">
                     <Award size={16} /> {trainee.specialization}
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                     <Mail size={16} /> {trainee.email}
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                     <Calendar size={16} /> Joined April 2026
                  </span>
               </div>
            </div>
            <div className="flex gap-3 pb-2">
               <button className="px-6 py-3 bg-surface-100 dark:bg-zinc-800 border border-surface-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-surface-50 dark:hover:bg-zinc-750 transition-all shadow-sm">
                  <MessageSquare size={16} /> COMMUNICATE
               </button>
               <Link to={`/roadmap/${trainee.id}`} className="px-6 py-3 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-brand/20">
                  <ExternalLink size={16} /> ROADMAP
               </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-slate-50 dark:bg-zinc-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} />
                         </div>
                         <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+4.2% wk</span>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Roadmap Progress</h4>
                      <div className="flex items-end gap-3 translate-y-1">
                         <span className="text-3xl font-display font-black">{trainee.progress}%</span>
                         <span className="text-xs font-bold text-slate-400 mb-1">/ 100% Path</span>
                      </div>
                   </div>

                   <div className="bg-slate-50 dark:bg-zinc-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-zinc-800">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                            <Calendar size={20} />
                         </div>
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">Est. Completion</h4>
                      <div className="flex items-end gap-3 translate-y-1">
                         <span className="text-2xl font-display font-black truncate">August 2026</span>
                      </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-8">
                   <h4 className="text-lg font-bold mb-6 italic font-display">Active Focus Area</h4>
                   <div className="flex items-center gap-6 bg-slate-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-700">
                      <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm text-brand border border-slate-100 dark:border-zinc-800">
                         <Award size={24} />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold">{trainee.activeTopic}</p>
                         <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Part of Core Curriculum - Module 4</p>
                      </div>
                      <Link to={`/roadmap/${trainee.id}`} className="text-xs font-bold text-brand hover:underline">Track Node</Link>
                   </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2rem] p-8">
                   <h4 className="text-lg font-bold mb-6 italic font-display">Recent Activity</h4>
                   <div className="space-y-6">
                      {[
                        { action: "Marked Node as Completed", target: "Spring Data JPA", date: "2 hours ago" },
                        { action: "Started Deep learning", target: "Transformers 101", date: "Yesterday" },
                        { action: "Structural Change Requested", target: "Add Cloud deployment", date: "2 days ago" }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                           <div className="w-2 h-2 rounded-full bg-brand mt-1.5 shadow-[0_0_5px_rgba(99,102,241,1)]" />
                           <div className="flex-1">
                              <p className="text-sm font-medium">{item.action}: <span className="font-bold">"{item.target}"</span></p>
                              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase mt-1 tracking-widest">{item.date}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 p-8 rounded-[2rem]">
                   <h4 className="flex items-center gap-2 text-red-500 font-bold mb-4">
                      <ShieldAlert size={20} /> Attention Required
                   </h4>
                   <p className="text-sm font-medium text-red-600/80 leading-relaxed mb-6">
                      The current roadmap path for this trainee has 2 pending structural requests awaiting your final approval.
                   </p>
                   <Link to="/requests" className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">
                      GO TO REQUESTS
                   </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-[2rem]">
                   <h4 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-6">Internal Notes</h4>
                   <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-zinc-800 p-4 rounded-xl text-xs font-medium italic text-slate-600 dark:text-zinc-400">
                         "Trainee shows high aptitude for backend logic but needs to improve focus on documentation protocols."
                         <div className="mt-2 text-[10px] font-bold text-slate-400 not-italic uppercase tracking-wider">— Manager • May 04</div>
                      </div>
                      <button className="w-full py-2.5 text-xs font-bold text-brand hover:bg-brand/5 rounded-xl border border-brand/20 transition-all">
                         ADD PRIVATE NOTE
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
