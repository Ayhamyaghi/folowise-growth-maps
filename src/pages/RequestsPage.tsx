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
  MessageSquare,
  CheckCircle2,
  GitBranch,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  Send,
  LayoutList,
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

function ActionIcon({ action }: { action: string }) {
  switch (action) {
    case 'ADD_TOPIC': return <Plus size={10} strokeWidth={3} />;
    case 'EDIT_TOPIC': return <Edit3 size={10} strokeWidth={3} />;
    case 'DELETE_TOPIC': return <Trash2 size={10} strokeWidth={3} />;
    case 'MOVE_TOPIC': return <GitBranch size={10} strokeWidth={3} />;
    default: return <ChevronRight size={10} strokeWidth={3} />;
  }
}

function actionColors(action: string) {
  switch (action) {
    case 'ADD_TOPIC': return { badge: 'bg-emerald-500 text-white', border: 'border-l-emerald-400', glow: 'shadow-emerald-100' };
    case 'DELETE_TOPIC': return { badge: 'bg-rose-500 text-white', border: 'border-l-rose-400', glow: 'shadow-rose-100' };
    case 'MOVE_TOPIC': return { badge: 'bg-violet-500 text-white', border: 'border-l-violet-400', glow: 'shadow-violet-100' };
    default: return { badge: 'bg-amber-500 text-white', border: 'border-l-amber-400', glow: 'shadow-amber-100' };
  }
}

function statusConfig(status: string) {
  if (status === 'APPROVED') return {
    label: 'Approved',
    icon: CheckCircle2,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  };
  if (status === 'REJECTED') return {
    label: 'Rejected',
    icon: X,
    classes: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  };
  return {
    label: 'Pending',
    icon: Clock,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-pulse">
      <div className="xl:col-span-4 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border-subtle p-4 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-soft shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="h-3 bg-surface-soft rounded-full w-3/4" />
              <div className="h-2.5 bg-surface-soft rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="xl:col-span-8">
        <div className="bg-white rounded-3xl border border-border-subtle overflow-hidden">
          <div className="p-6 bg-surface-soft border-b border-border-subtle space-y-4">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-xl bg-white border border-border-subtle" />
              <div className="space-y-2">
                <div className="h-4 bg-white rounded-full w-32 border border-border-subtle" />
                <div className="h-2.5 bg-white rounded-full w-20 border border-border-subtle" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="h-16 bg-surface-soft rounded-xl" />
            <div className="h-20 bg-surface-soft rounded-xl" />
            <div className="h-16 bg-surface-soft rounded-xl" />
            <div className="h-10 bg-surface-soft rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      showToast('Request approved and applied to roadmap', 'success');
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
      showToast('Request rejected', 'error');
    } catch (err: any) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 pb-20 px-4 md:px-0">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-surface-soft rounded-lg animate-pulse" />
            <div className="h-3.5 w-80 bg-surface-soft rounded-lg animate-pulse" />
          </div>
        </div>
        <LoadingSkeleton />
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
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-700">{requests.length} pending</span>
          </div>
          <button className="p-2.5 bg-white border border-border-subtle rounded-xl hover:bg-slate-50 transition-all shadow-sm text-text-tertiary hover:text-brand">
            <History size={16} />
          </button>
        </div>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-700 flex items-center gap-3"
        >
          <div className="p-1.5 bg-rose-100 rounded-lg"><AlertCircle size={14} /></div>
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Request List */}
        <div className="xl:col-span-4 space-y-2.5">
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border-subtle rounded-3xl bg-surface-soft/30"
            >
              <div className="w-16 h-16 bg-white border border-border-subtle rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <ClipboardList size={28} className="text-text-tertiary opacity-40" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary opacity-60">All clear</p>
              <p className="text-xs font-medium text-text-tertiary opacity-40 mt-1">No pending requests</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {requests.map((request, i) => {
                const colors = actionColors(request.action);
                return (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16, scale: 0.96 }}
                    transition={{ delay: i * 0.04, type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={() => { setSelectedId(request.id); setRejectingId(null); setRejectNote(''); }}
                    className={cn(
                      "group relative p-3.5 rounded-2xl cursor-pointer transition-all border-l-[3px] border border-border-subtle",
                      colors.border,
                      selectedId === request.id
                        ? "bg-white shadow-card ring-2 ring-brand/10 scale-[1.01] z-10 border-border-subtle"
                        : "bg-white hover:bg-slate-50/80 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[0.6rem] overflow-hidden border border-border-subtle bg-surface-soft shrink-0 shadow-sm">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.requestedByDisplayName}`}
                          alt={request.requestedByDisplayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-[13px] font-bold text-text-primary group-hover:text-brand transition-colors truncate tracking-tight">
                            {request.requestedByDisplayName}
                          </h3>
                          <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-60 shrink-0 ml-2">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md shrink-0",
                            colors.badge
                          )}>
                            <ActionIcon action={request.action} />
                            {actionLabel(request.action)}
                          </span>
                          <p className="text-[11px] font-medium text-text-secondary truncate">
                            {request.proposedTitle ?? request.description}
                          </p>
                        </div>
                      </div>
                      {selectedId === request.id && (
                        <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand shadow-sm shadow-brand/40" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Right Side: Detailed Review Panel */}
        <div className="xl:col-span-8 space-y-5 lg:sticky lg:top-6">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="bg-white border border-border-subtle rounded-3xl overflow-hidden shadow-card"
              >
                {/* Panel Header */}
                <div className="p-5 border-b border-border-subtle bg-gradient-to-br from-surface-soft to-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/[0.03] rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white shadow-card shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest.requestedByDisplayName}`}
                          alt={selectedRequest.requestedByDisplayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-base font-display font-black tracking-tight text-text-primary leading-tight">
                          {selectedRequest.requestedByDisplayName}
                        </h2>
                        <p className="text-[9px] font-black text-brand uppercase tracking-[0.2em] mt-0.5 opacity-70">
                          Awaiting Review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-amber-700">Pending Decision</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <div className="bg-white rounded-xl border border-border-subtle p-3 shadow-sm">
                      <label className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2 opacity-60">
                        <Tag size={9} className="text-brand" /> Operation
                      </label>
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                        actionColors(selectedRequest.action).badge
                      )}>
                        <ActionIcon action={selectedRequest.action} />
                        {actionLabel(selectedRequest.action)}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-border-subtle p-3 shadow-sm">
                      <label className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2 opacity-60">
                        <Calendar size={9} className="text-brand" /> Submitted
                      </label>
                      <p className="text-xs font-black text-text-primary">{formatDate(selectedRequest.createdAt)}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-border-subtle p-3 shadow-sm">
                      <label className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 mb-2 opacity-60">
                        <LayoutList size={9} className="text-brand" /> Countable
                      </label>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">
                        {selectedRequest.proposedCountable ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Panel Body */}
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                      <Info size={11} className="text-brand" /> Target Node
                    </label>
                    <div className="p-4 bg-surface-soft rounded-xl border border-border-subtle">
                      <h4 className="text-[15px] font-display font-black text-text-primary leading-tight tracking-tight">
                        {selectedRequest.proposedTitle ?? '—'}
                      </h4>
                      {selectedRequest.proposedParentTitle && (
                        <p className="text-[11px] text-text-secondary mt-1.5 font-medium flex items-center gap-1.5">
                          <GitBranch size={10} className="text-brand" />
                          Under: <span className="font-bold text-text-primary">{selectedRequest.proposedParentTitle}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedRequest.proposedDescription && (
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                        <MessageSquare size={11} className="text-brand" /> Description
                      </label>
                      <p className="text-[13px] font-medium leading-relaxed text-text-secondary bg-surface-soft p-4 rounded-xl border border-border-subtle">
                        {selectedRequest.proposedDescription}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                      <ClipboardList size={11} className="text-brand" /> Trainee Rationale
                    </label>
                    <blockquote className="text-[13px] font-medium leading-relaxed text-text-secondary italic bg-white p-4 rounded-xl border border-l-[3px] border-brand/20 border-l-brand/40">
                      "{selectedRequest.description}"
                    </blockquote>
                  </div>

                  {/* Action Area */}
                  <AnimatePresence mode="wait">
                    {rejectingId === selectedRequest.id ? (
                      <motion.div
                        key="reject-form"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-3 pt-2"
                      >
                        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <X size={14} className="text-rose-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] font-bold text-rose-700 leading-relaxed">
                            Optionally provide a reason. The trainee will see this note.
                          </p>
                        </div>
                        <textarea
                          className="w-full p-3.5 text-[13px] border border-border-standard rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all bg-white"
                          rows={2}
                          placeholder="Reason for rejection..."
                          value={rejectNote}
                          onChange={e => setRejectNote(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoading}
                            onClick={() => void handleReject(selectedRequest.id)}
                            className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-100"
                          >
                            {actionLoading
                              ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              : <X size={14} strokeWidth={3} />}
                            Confirm Reject
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => { setRejectingId(null); setRejectNote(''); }}
                            className="px-5 py-3 bg-white border border-border-standard rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="action-buttons"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="pt-4 border-t border-border-subtle flex items-center gap-3"
                      >
                        <button
                          disabled={actionLoading}
                          onClick={() => void handleApprove(selectedRequest.id)}
                          className="flex-1 py-3.5 bg-brand text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {actionLoading
                            ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Check size={16} strokeWidth={3} />}
                          Approve & Apply
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => setRejectingId(selectedRequest.id)}
                          className="flex-1 py-3.5 bg-white text-rose-500 border border-border-subtle rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 hover:border-rose-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                          <X size={16} strokeWidth={3} /> Reject
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-border-subtle rounded-3xl bg-surface-soft/20"
              >
                <div className="w-20 h-20 bg-white border border-border-subtle rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 size={36} className="text-status-success opacity-30" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-text-tertiary opacity-50">All requests reviewed</p>
                <p className="text-xs font-medium text-text-tertiary opacity-30 mt-1">No pending items remain</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={cn(
              "fixed bottom-8 left-1/2 px-5 py-3 rounded-2xl shadow-elevated z-[300] flex items-center gap-3 border backdrop-blur-md",
              toast.type === 'success'
                ? "bg-white border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            )}
          >
            {toast.type === 'success'
              ? <CheckCircle2 size={16} className="text-emerald-500" />
              : <AlertCircle size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
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

  const pending = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-surface-soft rounded-lg animate-pulse" />
            <div className="h-3.5 w-72 bg-surface-soft rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-surface-soft rounded-2xl" />)}
        </div>
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-surface-soft rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">My Requests</h1>
          <p className="text-text-secondary mt-1 text-xs font-medium">Status of your proposed structural roadmap modifications</p>
        </div>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-700 flex items-center gap-3"
        >
          <div className="p-1.5 bg-rose-100 rounded-lg"><AlertCircle size={14} /></div>
          {error}
        </motion.div>
      )}

      {/* Summary Stats */}
      {requests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Total', value: requests.length, color: 'text-text-primary', bg: 'bg-white', border: 'border-border-subtle' },
            { label: 'Pending', value: pending, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Approved', value: approved, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          ].map((stat) => (
            <div key={stat.label} className={cn("p-4 rounded-2xl border shadow-sm", stat.bg, stat.border)}>
              <p className="text-[8px] font-black uppercase tracking-[0.25em] text-text-tertiary mb-1.5">{stat.label}</p>
              <p className={cn("text-2xl font-display font-black leading-none", stat.color)}>{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        <div className="xl:col-span-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {requests.map((request, i) => {
              const sc = statusConfig(request.status);
              const StatusIcon = sc.icon;
              const colors = actionColors(request.action);
              const isApproved = request.status === 'APPROVED';
              const isRejected = request.status === 'REJECTED';
              const isPending = request.status === 'PENDING';

              return (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ delay: i * 0.04, type: 'spring', damping: 28, stiffness: 300 }}
                  className={cn(
                    "bg-white border-l-[3px] border border-border-subtle rounded-2xl p-5 transition-all shadow-sm",
                    colors.border
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0",
                        colors.badge
                      )}>
                        <ActionIcon action={request.action} />
                        {actionLabel(request.action)}
                      </div>
                      <h3 className="text-sm font-bold text-text-primary tracking-tight truncate">
                        {request.proposedTitle ?? request.description}
                      </h3>
                    </div>
                    {/* Status Badge */}
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shrink-0",
                      sc.classes
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                      <StatusIcon size={10} strokeWidth={3} />
                      {sc.label}
                    </div>
                  </div>

                  {request.proposedDescription && (
                    <p className="text-xs text-text-secondary leading-relaxed italic opacity-80 mb-4">
                      "{request.proposedDescription}"
                    </p>
                  )}

                  {request.managerNote && isRejected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 p-3.5 bg-rose-50 rounded-xl border border-rose-100 flex gap-3"
                    >
                      <div className="p-1.5 bg-rose-100 rounded-lg shrink-0 self-start">
                        <MessageSquare size={11} className="text-rose-500" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest mb-1">Manager Note</p>
                        <p className="text-[12px] font-medium text-rose-900 leading-relaxed">"{request.managerNote}"</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Timeline */}
                  <div className="pt-4 border-t border-border-subtle">
                    <p className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-3 opacity-60">Approval Flow</p>
                    <div className="flex items-center">
                      {/* Step 1: Submitted */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest whitespace-nowrap">Submitted</span>
                      </div>
                      {/* Connector */}
                      <div className={cn("h-[2px] flex-1 mx-2 rounded-full", !isPending ? "bg-brand/30" : "bg-border-subtle")} />
                      {/* Step 2: Manager review */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm transition-all",
                          isPending ? "bg-amber-400 shadow-amber-100" :
                          isApproved ? "bg-brand shadow-brand/20" : "bg-rose-500 shadow-rose-100"
                        )}>
                          {isPending ? <Clock size={12} strokeWidth={3} className="animate-pulse" /> :
                           isApproved ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                        </div>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest whitespace-nowrap",
                          isPending ? "text-amber-600" : "text-text-tertiary"
                        )}>Review</span>
                      </div>
                      {/* Connector */}
                      <div className={cn("h-[2px] flex-1 mx-2 rounded-full", isApproved ? "bg-brand/30" : "bg-border-subtle")} />
                      {/* Step 3: Applied */}
                      <div className={cn("flex flex-col items-center gap-1.5", !isApproved && "opacity-30")}>
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shadow-sm",
                          isApproved ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-surface-soft text-text-tertiary"
                        )}>
                          {isApproved ? <CheckCircle2 size={12} strokeWidth={3} /> : null}
                        </div>
                        <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest whitespace-nowrap">Applied</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle/60">
                    <span className="text-[9px] font-bold text-text-tertiary opacity-50 flex items-center gap-1.5">
                      <Calendar size={10} /> {formatDate(request.createdAt)}
                    </span>
                    {isPending && (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Clock size={10} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Awaiting manager</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {requests.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-border-subtle rounded-3xl bg-surface-soft/20"
            >
              <div className="w-20 h-20 bg-white border border-border-subtle rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Send size={28} className="text-text-tertiary opacity-30" />
              </div>
              <p className="text-sm font-black text-text-primary">No requests yet</p>
              <p className="text-xs font-medium text-text-tertiary mt-1.5 text-center max-w-[280px] leading-relaxed">
                Submit a structural change from your roadmap to get started.
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-brand/[0.04] p-5 rounded-2xl border border-brand/10 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-brand/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-[9px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-brand">
              <Info size={13} /> Request Policy
            </h4>
            <p className="text-[11px] font-medium leading-relaxed text-text-secondary opacity-90">
              Structural changes require manager review. Approved requests update your roadmap immediately.
            </p>
          </div>

          {rejected > 0 && (
            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100">
              <h4 className="text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 text-rose-600">
                <AlertCircle size={13} /> {rejected} Rejected
              </h4>
              <p className="text-[11px] font-medium leading-relaxed text-rose-700 opacity-80">
                Rejected requests can be revised and resubmitted from your roadmap.
              </p>
            </div>
          )}

          <div className="bg-white border border-border-subtle p-5 rounded-2xl shadow-sm">
            <h4 className="font-black text-text-tertiary uppercase text-[8px] tracking-[0.25em] mb-4">Quick Guide</h4>
            <ul className="space-y-3.5">
              {[
                "Approval average: 24h",
                "Only pending requests can be revised",
                "Rejected requests can be resubmitted",
              ].map((guide, i) => (
                <li key={i} className="flex gap-3 text-[10px] font-bold text-text-secondary leading-tight">
                  <div className="w-4 h-4 rounded-full bg-surface-soft border border-border-subtle flex items-center justify-center text-[7px] font-black text-brand shrink-0 mt-0.5">
                    {i + 1}
                  </div>
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
