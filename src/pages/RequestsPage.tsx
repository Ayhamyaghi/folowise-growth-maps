/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  Clock,
  History,
  AlertCircle,
  ClipboardList,
  Calendar,
  Tag,
  Info,
  MessageSquare
} from "lucide-react";
import { changeRequestApi, ChangeRequestResponse } from "../lib/apiClient";
import { cn } from "../lib/utils";
import { useAuth } from "../App";

function actionLabel(action: string): string {
  switch (action) {
    case 'ADD_TOPIC': return 'Add';
    case 'EDIT_TOPIC': return 'Edit';
    case 'DELETE_TOPIC': return 'Delete';
    case 'MOVE_TOPIC': return 'Move';
    default: return action;
  }
}

function statusLabel(status: string): "Pending" | "Approved" | "Rejected" {
  if (status === 'APPROVED') return 'Approved';
  if (status === 'REJECTED') return 'Rejected';
  return 'Pending';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RequestsPage() {
  const { role } = useAuth();

  if (role === "manager") {
    return <ManagerRequestsView />;
  }

  return <TraineeRequestsView />;
}

function ManagerRequestsView() {
  const [requests, setRequests] = useState<ChangeRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        const data = await changeRequestApi.getPending();
        setRequests(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (err: any) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedRequest = requests.find(r => r.id === selectedId) ?? requests[0] ?? null;

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await changeRequestApi.approve(id);
      const remaining = requests.filter(r => r.id !== id);
      setRequests(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    } catch (err: any) {
      setError(err.message || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await changeRequestApi.reject(id, { managerNote: rejectNote.trim() || undefined });
      const remaining = requests.filter(r => r.id !== id);
      setRequests(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      setRejectingId(null);
      setRejectNote('');
    } catch (err: any) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 px-4 md:px-0">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">Change Requests</h1>
          <p className="text-text-secondary mt-1 text-xs font-medium">Review and manage structural roadmap updates proposed by trainees</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2.5 bg-white border border-border-subtle rounded-xl hover:bg-slate-50 transition-all shadow-sm text-text-tertiary hover:text-brand">
              <History size={16} />
           </button>
        </div>
      </header>

      {error && (
        <div className="p-3 bg-bg-danger border border-border-subtle rounded-xl text-xs font-bold text-status-danger flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Request List */}
        <div className="xl:col-span-4 space-y-2.5">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl text-slate-200">
              <ClipboardList size={40} className="opacity-20 mb-4" />
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">No pending requests</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {requests.map((request, i) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setSelectedId(request.id); setRejectingId(null); setRejectNote(''); }}
                  className={cn(
                    "group relative p-3.5 rounded-2xl cursor-pointer transition-all border",
                    selectedId === request.id
                      ? "bg-white border-brand shadow-xl ring-4 ring-brand/5 scale-[1.01] z-10"
                      : "bg-white border-border-subtle hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[0.6rem] overflow-hidden border border-border-subtle bg-surface-soft shrink-0 shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.requestedByDisplayName}`} alt={request.requestedByDisplayName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className="text-[13px] font-bold text-text-primary group-hover:text-brand transition-colors truncate tracking-tight">{request.requestedByDisplayName}</h3>
                        <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-60 leading-none">{formatDate(request.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border shrink-0 shadow-sm",
                          request.action === "ADD_TOPIC" ? "bg-bg-success text-status-success border-border-subtle" :
                          request.action === "DELETE_TOPIC" ? "bg-bg-danger text-status-danger border-border-subtle" :
                          request.action === "MOVE_TOPIC" ? "bg-bg-brand-soft text-brand border-border-subtle" :
                          "bg-bg-warning text-status-warning border-border-subtle"
                        )}>
                          {actionLabel(request.action)}
                        </span>
                        <p className="text-[11px] font-bold text-text-secondary truncate tracking-tight">{request.proposedTitle ?? request.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

         {/* Right Side: Detailed Review Panel */}
        <div className="xl:col-span-8 space-y-5 lg:sticky lg:top-6">
           {selectedRequest ? (
             <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-border-subtle rounded-3xl overflow-hidden shadow-xl"
             >
                <div className="p-5 border-b border-border-subtle bg-surface-soft relative overflow-hidden">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-card">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.requestedByDisplayName}`} alt={selectedRequest.requestedByDisplayName} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <h2 className="text-base font-display font-black tracking-tight text-text-primary leading-tight">{selectedRequest.requestedByDisplayName}</h2>
                            <p className="text-[8px] font-black text-brand uppercase tracking-[0.2em] mt-0.5">Review Protocol</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-bg-warning text-status-warning rounded-lg border border-border-subtle scale-95 origin-right">
                         <div className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse" />
                         <span className="text-[8px] font-black uppercase tracking-widest leading-none">Awaiting</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 relative z-10">
                      <div className="space-y-0.5">
                         <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60 mb-1">
                            <Tag size={10} className="text-brand opacity-60" /> Operation
                         </label>
                         <div className={cn(
                            "w-fit px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
                            selectedRequest.action === "ADD_TOPIC" ? "bg-emerald-500 text-white border-emerald-600" :
                            selectedRequest.action === "DELETE_TOPIC" ? "bg-rose-500 text-white border-rose-600" :
                            "bg-brand text-white border-brand"
                         )}>
                            {actionLabel(selectedRequest.action)}
                         </div>
                      </div>
                      <div className="space-y-0.5 text-right">
                         <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center justify-end gap-2 opacity-60 mb-1">
                            <Calendar size={10} className="text-brand opacity-60" /> Ingress
                         </label>
                         <p className="text-xs font-black text-text-primary tracking-tight">{formatDate(selectedRequest.createdAt)}</p>
                      </div>
                   </div>
                </div>

                <div className="p-5 space-y-5">
                   <div className="space-y-2">
                      <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                         <Info size={12} className="text-brand opacity-60" /> Target Node
                      </label>
                      <div className="p-3.5 bg-surface-soft rounded-xl border border-border-subtle border-dashed">
                         <h4 className="text-[14px] font-display font-black text-text-primary leading-tight tracking-tight">
                           {selectedRequest.proposedTitle ?? '—'}
                         </h4>
                         {selectedRequest.proposedParentTitle && (
                           <p className="text-[11px] text-text-secondary mt-1 font-medium">
                             Under: {selectedRequest.proposedParentTitle}
                           </p>
                         )}
                      </div>
                   </div>

                   {selectedRequest.proposedDescription && (
                     <div className="space-y-2">
                       <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                         <Info size={12} className="text-brand opacity-60" /> Description
                       </label>
                       <p className="text-[13px] font-medium leading-relaxed text-text-secondary bg-white p-3.5 rounded-xl border border-border-subtle">
                         {selectedRequest.proposedDescription}
                       </p>
                     </div>
                   )}

                   <div className="space-y-2">
                      <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                         <ClipboardList size={12} className="text-brand opacity-60" /> Rationale
                      </label>
                      <p className="text-[13px] font-medium leading-relaxed text-text-secondary italic bg-white p-3.5 rounded-xl border border-border-subtle border-l-brand/30 border-l-4">
                         "{selectedRequest.description}"
                      </p>
                   </div>

                   {rejectingId === selectedRequest.id ? (
                     <div className="space-y-3">
                       <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                         <MessageSquare size={12} className="text-rose-500 opacity-80" /> Manager Note (optional)
                       </label>
                       <textarea
                         className="w-full p-3 text-[13px] border border-border-subtle rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                         rows={2}
                         placeholder="Reason for rejection..."
                         value={rejectNote}
                         onChange={e => setRejectNote(e.target.value)}
                       />
                       <div className="flex gap-2">
                         <button
                           disabled={actionLoading}
                           onClick={() => void handleReject(selectedRequest.id)}
                           className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                         >
                           {actionLoading ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <X size={14} strokeWidth={3} />}
                           Confirm Reject
                         </button>
                         <button
                           disabled={actionLoading}
                           onClick={() => { setRejectingId(null); setRejectNote(''); }}
                           className="px-4 py-2.5 bg-white border border-border-subtle rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all disabled:opacity-50"
                         >
                           Cancel
                         </button>
                       </div>
                     </div>
                   ) : (
                     <div className="pt-4 border-t border-border-subtle flex items-center gap-2.5">
                        <button
                          disabled={actionLoading}
                          onClick={() => void handleApprove(selectedRequest.id)}
                          className="flex-1 py-3 bg-brand text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {actionLoading ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Check size={16} strokeWidth={3} />}
                          Approve
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => setRejectingId(selectedRequest.id)}
                          className="flex-1 py-3 bg-white text-rose-500 border border-border-subtle rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <X size={16} strokeWidth={3} /> Reject
                        </button>
                     </div>
                   )}
                </div>

                  <div className="p-6 bg-surface-soft border-t border-border-subtle relative">
                   <h4 className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.3em] mb-3 flex items-center gap-2 opacity-60">
                      <AlertCircle size={14} className="text-brand opacity-80" /> Operational Guardrails
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {[
                        "Structural path consistency",
                        "Specialization core alignment",
                        "Prerequisite hierarchy verification",
                        "Standardized nomenclature"
                      ].map((guide, i) => (
                        <div key={i} className="flex items-center gap-3.5 text-[11px] font-bold text-text-secondary tracking-tight">
                           <div className="w-5 h-5 rounded-lg bg-white border border-border-subtle flex items-center justify-center text-[9px] font-black shrink-0 text-brand shadow-sm">
                              {i+1}
                           </div>
                           {guide}
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <History size={48} className="opacity-20 translate-x-1" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">No pending requests</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function TraineeRequestsView() {
  const [requests, setRequests] = useState<ChangeRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await changeRequestApi.getMy();
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
     <div className="space-y-6 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900">My Requests</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Status of your proposed structural roadmap modifications</p>
        </div>
      </header>

      {error && (
        <div className="p-3 bg-bg-danger border border-border-subtle rounded-xl text-xs font-bold text-status-danger flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        <div className="xl:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {requests.map((request, i) => {
              const sl = statusLabel(request.status);
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group card-elevation bg-white border border-slate-100 rounded-2xl p-5 hover:border-brand/30 transition-all shadow-sm flex flex-col md:flex-row md:items-center gap-6"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-2">
                       <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm",
                          request.action === "ADD_TOPIC" ? "bg-status-success text-white border-border-subtle" :
                          request.action === "DELETE_TOPIC" ? "bg-status-danger text-white border-border-subtle" :
                          "bg-brand text-white border-brand/20"
                        )}>
                          {actionLabel(request.action)}
                        </span>
                        <h3 className="text-sm font-bold text-text-primary tracking-tight">{request.proposedTitle ?? request.description}</h3>
                     </div>
                     {request.proposedDescription && (
                       <p className="text-xs text-text-secondary leading-relaxed italic opacity-80">"{request.proposedDescription}"</p>
                     )}
                     {request.managerNote && (
                        <div className="mt-4 p-3 bg-bg-danger rounded-xl border border-border-subtle">
                           <p className="text-[8px] font-black text-status-danger uppercase tracking-widest mb-1.5 leading-none">Manager Feedback</p>
                           <p className="text-xs font-bold text-text-secondary italic">"{request.managerNote}"</p>
                        </div>
                     )}
                  </div>

                   {/* Timeline */}
                  <div className="min-w-[240px] md:border-l border-border-subtle md:pl-8">
                     <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-4 opacity-60">Approval Flow</p>
                     <div className="flex items-center w-full px-2">
                        <div className="flex flex-col items-center">
                           <div className="w-6 h-6 rounded-full bg-status-success flex items-center justify-center text-white shadow-card shadow-status-success/20"><Check size={10} /></div>
                           <span className="text-[8px] font-black mt-2 text-text-tertiary uppercase tracking-widest">Submitted</span>
                        </div>
                        <div className={cn("h-[1.5px] flex-1 mx-2", sl !== 'Pending' ? "bg-brand/20" : "bg-surface-secondary")}></div>
                        <div className="flex flex-col items-center">
                           <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-white shadow-card transition-all",
                              sl === "Pending" ? "bg-brand animate-pulse shadow-brand/20 scale-110" :
                              sl === "Approved" ? "bg-brand shadow-brand/20" :
                              "bg-status-danger shadow-status-danger/20"
                           )}>
                              {sl === "Pending" ? <Clock size={10} /> :
                               sl === "Approved" ? <Check size={10} /> : <X size={10} />}
                           </div>
                           <span className={cn("text-[8px] font-black mt-2 uppercase tracking-widest", sl === "Pending" ? "text-brand" : "text-text-tertiary")}>Manager</span>
                        </div>
                        <div className={cn("h-[1.5px] flex-1 mx-2", sl === "Approved" ? "bg-brand/20" : "bg-surface-secondary")}></div>
                        <div className={cn("flex flex-col items-center", sl !== "Approved" && "opacity-30")}>
                           <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white shadow-card", sl === "Approved" ? "bg-status-success shadow-status-success/20" : "bg-surface-soft")}>
                              {sl === "Approved" ? <Check size={10} /> : null}
                           </div>
                           <span className="text-[8px] font-black mt-2 text-text-tertiary uppercase tracking-widest">Applied</span>
                        </div>
                     </div>
                  </div>

                  {/* Date Submitted Mob/Tab View */}
                  <div className="md:hidden pt-4 border-t border-slate-50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted: {formatDate(request.createdAt)}</p>
                  </div>
                </motion.div>
              );
            })}

            {requests.length === 0 && (
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
        <div className="xl:col-span-1 space-y-6">
            <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10 relative overflow-hidden">
               <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand/10 rounded-full blur-2xl" />
               <h4 className="text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-brand">
                  <Info size={14} /> Request Policy
               </h4>
               <p className="text-[11px] font-bold leading-relaxed text-slate-600 opacity-90 tracking-tight">
                 Structural changes require manager review. Approved topics update your roadmap immediately.
               </p>
            </div>

            <div className="card-elevation bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
               <h4 className="font-black text-slate-400 uppercase text-[9px] tracking-[0.2em] mb-4">Request FAQ</h4>
               <ul className="space-y-4">
                  {[
                    "Approval average: 24h",
                    "Only pending requests can be edited",
                    "Rejected topics can be resubmitted with notes",
                    "Deleted topics are archived"
                  ].map((guide, i) => (
                    <li key={i} className="flex gap-3 text-[10px] font-bold text-slate-600 leading-tight tracking-tight">
                       <Check size={12} className="text-brand shrink-0" />
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
