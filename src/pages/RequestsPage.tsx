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
  Info
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
    <div className="space-y-8 transition-colors duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Change Requests</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Review and manage structural roadmap updates proposed by trainees</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-500">
              <History size={18} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Request List */}
        <div className="xl:col-span-5 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {mockChangeRequests.map((request, i) => (
              <motion.div 
                key={request.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedId(request.id)}
                className={cn(
                  "group relative p-4 rounded-2xl cursor-pointer transition-all border",
                  selectedId === request.id 
                    ? "bg-white dark:bg-zinc-800 border-brand shadow-lg dark:shadow-brand/5 ring-1 ring-brand/20" 
                    : "bg-surface-100 dark:bg-zinc-900 border-surface-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shrink-0">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.traineeName}`} alt={request.traineeName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{request.traineeName}</h3>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{request.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border shrink-0",
                        request.action === "Add" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        request.action === "Delete" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                        request.action === "Move" ? "bg-brand/10 text-brand border-brand/20" : 
                        "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      )}>
                        {request.action}
                      </span>
                      <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate">{request.topicName}</p>
                    </div>
                  </div>
                </div>
                {selectedId === request.id && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Side: Detailed Review Panel */}
        <div className="xl:col-span-7 space-y-6 sticky top-8">
           {selectedRequest ? (
             <motion.div 
               key={selectedRequest.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="card-elevation bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm"
             >
                <div className="p-8 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/10">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-800 shadow-xl">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.traineeName}`} alt={selectedRequest.traineeName} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">{selectedRequest.traineeName}</h2>
                            <p className="text-xs font-bold text-brand uppercase tracking-widest mt-1">Pending Change Review</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Tag size={10} /> Request Type
                         </label>
                         <div className={cn(
                            "w-fit px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border",
                            selectedRequest.action === "Add" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                            selectedRequest.action === "Delete" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                            "bg-brand/10 text-brand border-brand/20"
                         )}>
                            {selectedRequest.action}
                         </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar size={10} /> Submitted On
                         </label>
                         <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{selectedRequest.date}</p>
                      </div>
                   </div>
                </div>

                <div className="p-8 space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <Info size={12} /> target Topic
                      </label>
                      <div className="p-5 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-100 dark:border-zinc-800 border-dashed">
                         <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{selectedRequest.topicName}</h4>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <ClipboardList size={12} /> Proposed Modification
                      </label>
                      <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-inner">
                         "{selectedRequest.description}"
                      </p>
                   </div>

                   <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-4">
                      <button className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3">
                         <Check size={18} /> Approve Change
                      </button>
                      <button className="flex-1 py-4 bg-white dark:bg-transparent text-rose-500 border-2 border-rose-100 dark:border-rose-900/30 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 transition-all flex items-center justify-center gap-3">
                         <X size={18} /> Reject Request
                      </button>
                   </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertCircle size={14} className="text-brand" /> Review Checklist
                   </h4>
                   <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {[
                        "Structural consistency",
                        "Specialization alignment",
                        "Prerequisite verification",
                        "Pragmatic topic naming"
                      ].map((guide, i) => (
                        <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                           <div className="w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-[8px] font-black shrink-0 text-brand italic">
                              {i+1}
                           </div>
                           {guide}
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl text-slate-300 dark:text-zinc-800">
                <Search size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">Select a request to review</p>
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
     <div className="space-y-8 transition-colors duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">My Requests</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Status of your proposed structural roadmap modifications</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
              New Request
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        <div className="xl:col-span-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {myRequests.map((request, i) => (
              <motion.div 
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group card-elevation bg-surface-100 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-brand/30 transition-all shadow-sm flex flex-col md:flex-row md:items-center gap-8"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-3 mb-2">
                     <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                        request.action === "Add" ? "bg-emerald-500 text-white border-emerald-600" :
                        request.action === "Delete" ? "bg-rose-500 text-white border-rose-600" : 
                        "bg-brand text-white border-brand-dark"
                      )}>
                        {request.action}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{request.topicName}</h3>
                   </div>
                   <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium italic">"{request.description}"</p>
                   {request.managerNote && (
                      <div className="mt-4 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                         <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1 leading-none">Manager Feedback</p>
                         <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 italic">"{request.managerNote}"</p>
                      </div>
                   )}
                </div>

                {/* Timeline */}
                <div className="min-w-[260px] border-l border-surface-200 dark:border-zinc-800 pl-8">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-5">Approval Flow</p>
                   <div className="flex items-center w-full px-2">
                      <div className="flex flex-col items-center">
                         <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><Check size={10} /></div>
                         <span className="text-[8px] font-black mt-2 text-slate-400 uppercase tracking-widest">Submitted</span>
                      </div>
                      <div className={cn("h-[2px] flex-1 mx-1", request.status !== "Pending" ? "bg-brand" : "bg-surface-200 dark:bg-zinc-800")}></div>
                      <div className="flex flex-col items-center">
                         <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg",
                            request.status === "Pending" ? "bg-brand animate-pulse shadow-brand/20" : 
                            request.status === "Approved" ? "bg-brand shadow-brand/20" : 
                            "bg-rose-500 shadow-rose-500/20"
                         )}>
                            {request.status === "Pending" ? <Clock size={10} /> : 
                             request.status === "Approved" ? <Check size={10} /> : <X size={10} />}
                         </div>
                         <span className={cn("text-[8px] font-black mt-2 uppercase tracking-widest", request.status === "Pending" ? "text-brand" : "text-slate-400")}>Manager</span>
                      </div>
                      <div className={cn("h-[2px] flex-1 mx-1", request.status === "Approved" ? "bg-brand" : "bg-surface-200 dark:bg-zinc-800")}></div>
                      <div className={cn("flex flex-col items-center", request.status !== "Approved" && "opacity-30")}>
                         <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg", request.status === "Approved" ? "bg-emerald-500 shadow-emerald-500/20" : "bg-surface-300 dark:bg-zinc-700")}>
                            {request.status === "Approved" ? <Check size={10} /> : null}
                         </div>
                         <span className="text-[8px] font-black mt-2 text-slate-400 uppercase tracking-widest">Applied</span>
                      </div>
                   </div>
                </div>

                {/* Date Submitted Mob/Tab View */}
                <div className="md:hidden pt-4 border-t border-surface-200 dark:border-zinc-800">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Submitted: {request.date}</p>
                </div>

                {/* Details Button */}
                <div className="flex items-center gap-2 md:pl-4">
                   <button className="p-2.5 text-slate-400 hover:text-brand transition-colors"><MoreHorizontal size={20}/></button>
                </div>
              </motion.div>
            ))}
            
            {myRequests.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-zinc-800">
                  <ClipboardList size={64} className="opacity-20 mb-6" />
                  <p className="text-lg font-bold">No requests found</p>
                  <p className="text-sm font-medium mt-1">Submit a structural change from your roadmap.</p>
               </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Status Feedback */}
        <div className="xl:col-span-1 space-y-6">
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
               <h4 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-emerald-600">
                  <Check size={16} /> Request Info
               </h4>
               <p className="text-[11px] font-bold leading-relaxed text-slate-700 dark:text-zinc-300 opacity-90">
                 Structural changes require manager approval. Topics will update in your roadmap immediately after approval.
               </p>
            </div>
            
            <div className="card-elevation bg-white dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
               <h4 className="font-black text-slate-400 dark:text-zinc-500 uppercase text-[9px] tracking-[0.2em] mb-4">Request FAQ</h4>
               <ul className="space-y-4">
                  {[
                    "Approval average: 24h",
                    "Only pending requests can be edited",
                    "Rejected topics can be resubmitted with notes",
                    "Deleted topics are archived"
                  ].map((guide, i) => (
                    <li key={i} className="flex gap-3 text-[11px] font-bold text-slate-600 dark:text-zinc-400 leading-tight">
                       <Check size={12} className="text-brand shrink-0 mt-0.5" />
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
