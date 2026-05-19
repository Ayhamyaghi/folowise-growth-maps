/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  MoreVertical,
  ShieldAlert,
  Clock
} from "lucide-react";
import { traineeApi, TraineeListItemResponse } from "../lib/apiClient";
import { cn } from "../lib/utils";

export default function TraineeProfilePage() {
  const { id } = useParams();
  const [trainee, setTrainee] = useState<TraineeListItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    traineeApi.getById(id)
      .then(setTrainee)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-tertiary text-sm font-bold uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  if (error || !trainee) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link to="/trainees" className="inline-flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-text-tertiary hover:text-brand transition-all group px-2 mb-8">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          RETURN TO REGISTRY
        </Link>
        <p className="text-status-danger font-bold">{error ?? 'Trainee not found'}</p>
      </div>
    );
  }

  const avatarSrc = trainee.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trainee.traineeName)}`;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-0">
      <Link to="/trainees" className="inline-flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-text-tertiary hover:text-brand transition-all group px-2">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        RETURN TO REGISTRY
      </Link>

      <div className="card-elevation rounded-[3rem] bg-white border border-border-subtle overflow-hidden shadow-2xl shadow-black/[0.03]">
        <div className="h-64 bg-gradient-to-br from-slate-50 to-white relative border-b border-border-subtle">
           <div className="absolute inset-0 opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
           <div className="absolute top-10 right-10 flex gap-4">
              <button className="p-4 bg-white/90 hover:bg-white backdrop-blur-md rounded-2xl transition-all border border-border-subtle text-text-tertiary shadow-sm hover:text-brand focus:ring-4 focus:ring-brand/[0.05]">
                 <MoreVertical size={24} />
              </button>
           </div>
        </div>

        <div className="px-8 md:px-16 pb-16">
          <div className="relative flex flex-col md:flex-row items-end gap-10 -mt-20 mb-16">
            <div className="w-48 h-48 rounded-[3.5rem] bg-white p-2.5 shadow-2xl relative border border-border-subtle transition-all hover:scale-[1.02] duration-700">
               <img src={avatarSrc} alt={trainee.traineeName} className="w-full h-full object-cover rounded-[3rem] border border-border-subtle shadow-inner" />
               <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white border-8 border-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                 <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
               </div>
            </div>
            <div className="flex-1 pb-6 text-center md:text-left">
               <h1 className="text-5xl font-display font-black tracking-tight text-text-primary">{trainee.traineeName}</h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-4 gap-x-10 mt-5">
                  <span className="flex items-center gap-3 text-brand font-black text-xs uppercase tracking-[0.2em] bg-brand/5 px-6 py-2.5 rounded-2xl border border-brand/10 shadow-sm shadow-brand/5 leading-none">
                     <Award size={18} strokeWidth={2.5} /> {trainee.specialization} Unit
                  </span>
                  <span className="flex items-center gap-3 text-text-tertiary text-xs font-bold uppercase tracking-wider leading-none">
                     <Mail size={18} className="opacity-40" /> {trainee.traineeEmail}
                  </span>
                  <span className="flex items-center gap-3 text-text-tertiary text-xs font-bold uppercase tracking-wider leading-none">
                     <Calendar size={18} className="opacity-40" /> <span className="opacity-80">{trainee.roadmapTitle ?? 'No active roadmap'}</span>
                  </span>
               </div>
            </div>
            <div className="flex gap-4 pb-6 w-full md:w-auto">
               <button className="flex-1 md:flex-none px-10 py-5 bg-white border border-border-subtle rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-text-secondary">
                  <MessageSquare size={20} className="opacity-40" /> Message
               </button>
               {trainee.roadmapId ? (
                 <Link to={`/roadmap/${trainee.roadmapId}`} className="flex-1 md:flex-none px-10 py-5 bg-brand text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/30">
                   <ExternalLink size={20} /> View Roadmap
                 </Link>
               ) : (
                 <span className="flex-1 md:flex-none px-10 py-5 bg-surface-soft text-text-tertiary rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-border-subtle opacity-50 cursor-not-allowed">
                   <ExternalLink size={20} /> No Roadmap
                 </span>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
             <div className="lg:col-span-2 space-y-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                   <div className="bg-slate-50/30 p-12 rounded-[3.5rem] border border-border-subtle shadow-sm group hover:border-brand/20 transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -mr-16 -mt-16" />
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp size={28} strokeWidth={2.5} />
                         </div>
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-3 font-display relative z-10 opacity-70">Momentum</h4>
                      <div className="flex items-baseline gap-4 relative z-10">
                         <span className="text-5xl font-display font-black text-text-primary tracking-tighter">{trainee.progressPercentage}%</span>
                         <span className="text-[11px] font-black text-text-tertiary uppercase tracking-widest leading-none opacity-60">Completion Rate</span>
                      </div>
                   </div>

                   <div className="bg-slate-50/30 p-12 rounded-[3.5rem] border border-border-subtle shadow-sm group hover:border-amber-200 transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 blur-3xl rounded-full -mr-16 -mt-16 opacity-40" />
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 border border-amber-100">
                            <Award size={28} className="text-amber-500" strokeWidth={2.5} />
                         </div>
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-3 font-display relative z-10 opacity-70">Completed Topics</h4>
                      <div className="flex items-baseline gap-4 relative z-10">
                         <span className="text-4xl font-display font-black text-text-primary tracking-tight">{trainee.completedCount}/{trainee.totalCount}</span>
                      </div>
                   </div>
                </div>

                {trainee.activeTopic && (
                  <div className="bg-white border border-border-subtle rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden group">
                     <div className="absolute -right-12 -top-12 text-brand/5 opacity-40 group-hover:rotate-12 transition-transform duration-1000">
                          <Award size={250} />
                     </div>
                     <h4 className="text-xl font-bold mb-10 text-text-primary flex items-center gap-4">
                        Active Progression Node
                     </h4>
                     <div className="flex items-center gap-10 bg-slate-50/50 p-10 rounded-[2.5rem] border border-border-subtle relative z-10 group-hover:bg-brand/[0.02] transition-colors">
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl text-brand border border-border-subtle group-hover:scale-110 transition-transform duration-500">
                           <Award size={40} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-2xl font-black text-text-primary leading-tight mb-3 uppercase tracking-tighter">{trainee.activeTopic}</p>
                        </div>
                        {trainee.roadmapId && (
                          <Link to={`/roadmap/${trainee.roadmapId}`} className="p-4 bg-white rounded-2xl border border-border-subtle text-brand hover:bg-brand hover:text-white transition-all shadow-sm active:scale-95 group/link">
                             <ExternalLink size={24} />
                          </Link>
                        )}
                     </div>
                  </div>
                )}

                <div className="bg-white border border-border-subtle rounded-[3.5rem] p-12 shadow-sm">
                   <h4 className="text-xl font-bold mb-10 text-text-primary">Historical Footprint</h4>
                   <div className="flex items-center justify-center py-8 text-text-tertiary">
                     <div className="text-center">
                       <Clock size={32} className="mx-auto mb-3 opacity-20" />
                       <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Activity log coming soon</p>
                     </div>
                   </div>
                </div>
             </div>

             <div className="space-y-16">
                {trainee.attentionReason && (
                  <div className="bg-rose-50/50 border border-rose-100 p-12 rounded-[3.5rem] shadow-2xl shadow-rose-500/5 group">
                     <h4 className="flex items-center gap-4 text-rose-500 font-black text-xs uppercase tracking-[0.3em] mb-8">
                        <ShieldAlert size={24} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} /> Attention Required
                     </h4>
                     <p className="text-base font-bold text-rose-700/80 leading-relaxed mb-10 uppercase tracking-tight">
                        {trainee.attentionReason}
                     </p>
                     <Link to="/requests" className="w-full py-6 bg-rose-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-rose-500/30 hover:brightness-110 active:scale-95 transition-all">
                        GO TO REQUESTS
                     </Link>
                  </div>
                )}

                <div className="card-elevation bg-white border border-border-subtle p-12 rounded-[3.5rem] shadow-sm">
                   <h4 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-10 opacity-60">Internal Dossier</h4>
                   <div className="space-y-8">
                      <div className="bg-slate-50/50 p-8 rounded-[2rem] text-sm font-bold leading-relaxed italic text-text-secondary border border-border-subtle shadow-inner relative overflow-hidden">
                        <div className="absolute -top-2 -right-2 text-brand/5 select-none pointer-events-none">
                            <MessageSquare size={80} strokeWidth={2.5} />
                        </div>
                         <p className="text-text-tertiary opacity-60 not-italic text-[11px] font-black uppercase tracking-[0.3em]">No notes yet</p>
                      </div>
                      <button className="w-full py-5 text-[11px] font-black text-brand hover:bg-brand/5 rounded-[1.5rem] border border-brand/20 transition-all uppercase tracking-[0.4em] shadow-sm shadow-brand/5">
                         ADD PRIVATE ENTRY
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
