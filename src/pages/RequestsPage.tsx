/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  X, 
  Clock, 
  ArrowRight, 
  History, 
  Search,
  MoreHorizontal,
  AlertCircle,
  ClipboardList,
  User,
  Calendar,
  Tag,
  Info,
  MessageSquare
} from "lucide-react";
import { mockChangeRequests } from "../data/mockData";
import { cn } from "../lib/utils";

import { useAuth } from "../App";

export default function RequestsPage() {
  const { role } = useAuth();
  
  if (role === "manager") {
    return <ManagerRequestsView />;
  }
  
  return <TraineeRequestsView />;
}

function ManagerRequestsView() {
  const [selectedId, setSelectedId] = useState<string | null>(mockChangeRequests[0]?.id || null);
  const selectedRequest = mockChangeRequests.find(r => r.id === selectedId) || mockChangeRequests[0];

  return (
    <div className="space-y-10 pb-20 px-4 md:px-0">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">Change Requests</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Review and manage structural roadmap updates proposed by trainees</p>
        </div>
        <div className="flex gap-4">
           <button className="p-4 bg-white border border-border-subtle rounded-2xl hover:bg-slate-50 transition-all shadow-sm text-text-tertiary hover:text-brand focus:ring-4 focus:ring-brand/[0.05]">
              <History size={22} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left Side: Request List */}
        <div className="xl:col-span-5 space-y-4">
          <AnimatePresence mode="popLayout">
            {mockChangeRequests.map((request, i) => (
              <motion.div 
                key={request.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedId(request.id)}
                className={cn(
                  "group relative p-6 rounded-[2.5rem] cursor-pointer transition-all duration-500 border",
                  selectedId === request.id 
                    ? "bg-white border-brand shadow-2xl shadow-brand/10 ring-4 ring-brand/5 scale-[1.02] z-10" 
                    : "bg-white border-border-subtle hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                )}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border-subtle bg-surface-soft shrink-0 shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.traineeName}`} alt={request.traineeName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-text-primary group-hover:text-brand transition-colors truncate tracking-tight">{request.traineeName}</h3>
                      <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] opacity-60 leading-none">{request.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-xl border shrink-0 shadow-sm",
                        request.action === "Add" ? "bg-bg-success text-status-success border-border-subtle" :
                        request.action === "Delete" ? "bg-bg-danger text-status-danger border-border-subtle" :
                        request.action === "Move" ? "bg-bg-brand-soft text-brand border-border-subtle" : 
                        "bg-bg-warning text-status-warning border-border-subtle"
                      )}>
                        {request.action}
                      </span>
                      <p className="text-sm font-bold text-text-secondary truncate tracking-tight">{request.topicName}</p>
                    </div>
                  </div>
                </div>
                {selectedId === request.id && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Side: Detailed Review Panel */}
        <div className="xl:col-span-7 space-y-8 sticky top-10">
           {selectedRequest ? (
             <motion.div 
                key={selectedRequest.id}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="card-elevation bg-white border border-border-subtle rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/[0.03]"
             >
                <div className="p-8 border-b border-border-subtle bg-surface-soft relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-40 pointer-events-none" />
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-card">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.traineeName}`} alt={selectedRequest.traineeName} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <h2 className="text-xl font-display font-black tracking-tight text-text-primary leading-tight">{selectedRequest.traineeName}</h2>
                            <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mt-1.5">Request Review Protocol</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-bg-warning text-status-warning rounded-xl border border-border-subtle shadow-control">
                         <div className="w-2.5 h-2.5 rounded-full bg-status-warning animate-pulse shadow-[0_0_10px_rgba(247,144,9,0.4)]" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Awaiting Decision</span>
                      </div>
                   </div>
 
                   <div className="grid grid-cols-2 gap-8 relative z-10">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2.5 opacity-60">
                            <Tag size={14} className="text-brand opacity-60" /> Operation Type
                         </label>
                         <div className={cn(
                            "w-fit px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm",
                            selectedRequest.action === "Add" ? "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/10" :
                            selectedRequest.action === "Delete" ? "bg-rose-500 text-white border-rose-600 shadow-rose-500/10" :
                            "bg-brand text-white border-brand shadow-brand/10"
                         )}>
                            {selectedRequest.action}
                         </div>
                      </div>
                      <div className="space-y-2 text-right">
                         <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center justify-end gap-2.5 opacity-60">
                            <Calendar size={14} className="text-brand opacity-60" /> Ingress Date
                         </label>
                         <p className="text-base font-black text-text-primary tracking-tight">{selectedRequest.date}</p>
                      </div>
                   </div>
                </div>
 
                <div className="p-8 space-y-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                         <Info size={16} className="text-brand opacity-60" /> Target Curriculum Node
                      </label>
                      <div className="p-6 bg-surface-soft rounded-3xl border-2 border-border-subtle border-dashed relative group">
                         <div className="absolute top-3 right-5 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                            <ClipboardList size={60} />
                         </div>
                         <h4 className="text-xl font-display font-black text-text-primary leading-tight tracking-tight">{selectedRequest.topicName}</h4>
                         <div className="flex items-center gap-2.5 mt-2.5">
                            <span className="w-2 h-2 rounded-full bg-brand" />
                            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Architectural Node Alignment Required</span>
                         </div>
                      </div>
                   </div>
 
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                         <ClipboardList size={16} className="text-brand opacity-60" /> Implementation Rationale
                      </label>
                      <div className="relative">
                        <div className="absolute -top-4 -left-1 text-brand/5 select-none pointer-events-none">
                            <MessageSquare size={80} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-bold leading-relaxed text-text-secondary italic bg-white p-6 rounded-3xl border border-border-subtle shadow-xl shadow-black/[0.01] relative z-10 pl-14 border-l-brand/30 border-l-4">
                           "{selectedRequest.description}"
                        </p>
                      </div>
                   </div>
 
                   <div className="pt-8 border-t border-border-subtle flex items-center gap-4">
                      <button className="flex-[1.5] py-4.5 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-brand/30 flex items-center justify-center gap-3">
                         <Check size={20} strokeWidth={3} /> Approve Change
                      </button>
                      <button className="flex-1 py-4.5 bg-white text-rose-500 border border-border-subtle rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm shadow-black/[0.01]">
                         <X size={20} strokeWidth={3} /> Reject
                      </button>
                   </div>
                </div>
 
                 <div className="p-8 bg-surface-soft border-t border-border-subtle relative">
                   <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em] mb-4 flex items-center gap-3 opacity-60">
                      <AlertCircle size={16} className="text-brand opacity-80" /> Operational Guardrails
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {[
                        "Structural path consistency",
                        "Specialization core alignment",
                        "Prerequisite hierarchy verification",
                        "Standardized nomenclature"
                      ].map((guide, i) => (
                        <div key={i} className="flex items-center gap-5 text-xs font-bold text-text-secondary tracking-tight">
                           <div className="w-7 h-7 rounded-2xl bg-white border border-border-subtle flex items-center justify-center text-[10px] font-black shrink-0 text-brand shadow-control ring-4 ring-bg-brand-soft/20">
                              {i+1}
                           </div>
                           {guide}
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <History size={48} className="opacity-20 translate-x-1" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Select a request queue</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function TraineeRequestsView() {
  const me = "Trainee" // In prototype terms
  // Find my requests - for prototype we'll just filter by a static name from mockData or assume first
  const myName = "Alex Rivera"; // First trainee in mockData
  const myRequests = mockChangeRequests.filter(r => r.traineeName === myName);
  
  return (
     <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">My Requests</h1>
          <p className="text-slate-500 mt-1">Status of your proposed structural roadmap modifications</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
              New Request
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        <div className="xl:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {myRequests.map((request, i) => (
              <motion.div 
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group card-elevation bg-white border border-slate-100 rounded-3xl p-7 hover:border-brand/30 transition-all shadow-sm flex flex-col md:flex-row md:items-center gap-10"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-4 mb-3">
                     <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm",
                        request.action === "Add" ? "bg-status-success text-white border-border-subtle" :
                        request.action === "Delete" ? "bg-status-danger text-white border-border-subtle" : 
                        "bg-brand text-white border-brand/20"
                      )}>
                        {request.action}
                      </span>
                      <h3 className="text-base font-bold text-text-primary">{request.topicName}</h3>
                   </div>
                   <p className="text-sm text-text-secondary leading-relaxed italic">"{request.description}"</p>
                   {request.managerNote && (
                      <div className="mt-5 p-4 bg-bg-danger rounded-2xl border border-border-subtle">
                         <p className="text-[9px] font-black text-status-danger uppercase tracking-widest mb-1.5 leading-none">Manager Feedback</p>
                         <p className="text-sm font-bold text-text-secondary italic">"{request.managerNote}"</p>
                      </div>
                   )}
                </div>

                 {/* Timeline */}
                <div className="min-w-[280px] border-l border-border-subtle pl-10">
                   <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-6">Approval Flow</p>
                   <div className="flex items-center w-full px-2">
                      <div className="flex flex-col items-center">
                         <div className="w-7 h-7 rounded-full bg-status-success flex items-center justify-center text-white shadow-card shadow-status-success/20"><Check size={12} /></div>
                         <span className="text-[9px] font-black mt-3 text-text-tertiary uppercase tracking-widest">Submitted</span>
                      </div>
                      <div className={cn("h-[2px] flex-1 mx-2", request.status !== "Pending" ? "bg-brand/20" : "bg-surface-secondary")}></div>
                      <div className="flex flex-col items-center">
                         <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-white shadow-card transition-all",
                            request.status === "Pending" ? "bg-brand animate-pulse shadow-brand/20 scale-110" : 
                            request.status === "Approved" ? "bg-brand shadow-brand/20" : 
                            "bg-status-danger shadow-status-danger/20"
                         )}>
                            {request.status === "Pending" ? <Clock size={12} /> : 
                             request.status === "Approved" ? <Check size={12} /> : <X size={12} />}
                         </div>
                         <span className={cn("text-[9px] font-black mt-3 uppercase tracking-widest", request.status === "Pending" ? "text-brand" : "text-text-tertiary")}>Manager</span>
                      </div>
                      <div className={cn("h-[2px] flex-1 mx-2", request.status === "Approved" ? "bg-brand/20" : "bg-surface-secondary")}></div>
                      <div className={cn("flex flex-col items-center", request.status !== "Approved" && "opacity-30")}>
                         <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white shadow-card", request.status === "Approved" ? "bg-status-success shadow-status-success/20" : "bg-surface-soft")}>
                            {request.status === "Approved" ? <Check size={12} /> : null}
                         </div>
                         <span className="text-[9px] font-black mt-3 text-text-tertiary uppercase tracking-widest">Applied</span>
                      </div>
                   </div>
                </div>

                {/* Date Submitted Mob/Tab View */}
                <div className="md:hidden pt-4 border-t border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted: {request.date}</p>
                </div>

                {/* Details Button */}
                <div className="flex items-center gap-2 md:pl-6">
                   <button className="p-3 text-slate-300 hover:text-brand transition-all hover:bg-slate-50 rounded-xl"><MoreHorizontal size={22}/></button>
                </div>
              </motion.div>
            ))}
            
            {myRequests.length === 0 && (
               <div className="flex flex-col items-center justify-center py-32 text-slate-200">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <ClipboardList size={48} className="opacity-20" />
                  </div>
                  <p className="text-xl font-bold text-slate-900">No requests found</p>
                  <p className="text-sm text-slate-500 mt-2">Submit a structural change from your roadmap.</p>
               </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Status Feedback */}
        <div className="xl:col-span-1 space-y-8">
            <div className="bg-brand/5 p-8 rounded-[2rem] border border-brand/10 relative overflow-hidden">
               <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand/10 rounded-full blur-2xl" />
               <h4 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-brand">
                  <Info size={16} /> Request Policy
               </h4>
               <p className="text-xs font-bold leading-relaxed text-slate-600 opacity-90">
                 Structural changes require manager review. Approved topics update your roadmap immediately.
               </p>
            </div>
            
            <div className="card-elevation bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
               <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-6">Request FAQ</h4>
               <ul className="space-y-5">
                  {[
                    "Approval average: 24h",
                    "Only pending requests can be edited",
                    "Rejected topics can be resubmitted with notes",
                    "Deleted topics are archived"
                  ].map((guide, i) => (
                    <li key={i} className="flex gap-4 text-[11px] font-bold text-slate-600 leading-tight">
                       <Check size={14} className="text-brand shrink-0 mt-0.5" />
                       {guide}
                    </li>
                  ))}
               </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
