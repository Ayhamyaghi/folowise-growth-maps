/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MoreVertical,
  TrendingUp,
  Grid,
  List as ListIcon,
  ChevronRight,
  Mail,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";
import { traineeApi, TraineeListItemResponse, CreateTraineeRequest } from "../lib/apiClient";

const SPECIALIZATIONS = [
  'Software Development',
  'QA Engineering',
  'AI Engineering',
  'Product Design',
  'Marketing',
];

interface CreateTraineeModalProps {
  onClose: () => void;
  onCreated: (trainee: TraineeListItemResponse) => void;
}

function CreateTraineeModal({ onClose, onCreated }: CreateTraineeModalProps) {
  const [form, setForm] = useState<CreateTraineeRequest>({
    displayName: '',
    email: '',
    password: '',
    specializationName: SPECIALIZATIONS[0],
    roadmapTitle: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof CreateTraineeRequest, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: CreateTraineeRequest = {
        ...form,
        roadmapTitle: form.roadmapTitle?.trim() || undefined,
      };
      const created = await traineeApi.create(payload);
      onCreated(created);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create trainee');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-subtle">
          <h2 className="text-base font-display font-black tracking-tight text-text-primary">New Trainee</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-tertiary hover:bg-slate-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1.5">Display Name *</label>
            <input
              type="text"
              required
              value={form.displayName}
              onChange={e => handleChange('displayName', e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1.5">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="trainee@example.com"
              className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1.5">Password *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              placeholder="Temporary password"
              className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1.5">Specialization *</label>
            <select
              required
              value={form.specializationName}
              onChange={e => handleChange('specializationName', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/30 transition-all"
            >
              {SPECIALIZATIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1.5">Roadmap Title <span className="opacity-50 normal-case font-bold">(optional)</span></label>
            <input
              type="text"
              value={form.roadmapTitle ?? ''}
              onChange={e => handleChange('roadmapTitle', e.target.value)}
              placeholder={`${form.displayName || 'Trainee'} Roadmap`}
              className="w-full px-3 py-2 bg-white border border-border-subtle rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/30 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-status-danger bg-bg-danger px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border-subtle text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-brand text-white text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Trainee'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function formatRelative(dateString: string | null): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function avatarUrl(trainee: TraineeListItemResponse): string {
  return trainee.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trainee.traineeName)}`;
}

export default function TraineesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [trainees, setTrainees] = useState<TraineeListItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    traineeApi.listAll()
      .then(setTrainees)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  function handleTraineeCreated(trainee: TraineeListItemResponse) {
    setTrainees(prev => [trainee, ...prev]);
    setIsModalOpen(false);
  }

  const specializations = ['All', ...Array.from(new Set(trainees.map(t => t.specialization)))];

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.traineeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || trainee.specialization === activeTab;
    return matchesSearch && matchesTab;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-tertiary text-sm font-bold uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-status-danger text-sm font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <AnimatePresence>
        {isModalOpen && (
          <CreateTraineeModal
            onClose={() => setIsModalOpen(false)}
            onCreated={handleTraineeCreated}
          />
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">Trainees</h1>
          <p className="text-text-secondary mt-1 text-xs font-medium">Manage and track roadmap progress for all team members</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-border-subtle rounded-xl flex p-1 shadow-sm transition-all">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded-lg transition-all", viewMode === "grid" ? "bg-slate-50 text-brand shadow-sm border border-slate-100" : "text-text-tertiary hover:text-text-primary")}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-lg transition-all", viewMode === "list" ? "bg-slate-50 text-brand shadow-sm border border-slate-100" : "text-text-tertiary hover:text-text-primary")}
            >
              <ListIcon size={16} />
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-brand text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20"
          >
            Add New entry
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="w-full lg:w-72 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand/[0.03] focus:border-brand/30 transition-all shadow-sm group-hover:border-slate-200"
          />
        </div>

        <div className="flex-1 flex flex-wrap gap-1.5">
          {specializations.map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveTab(spec)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all border shrink-0",
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
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-2.5"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredTrainees.map((trainee, idx) => (
            <motion.div
              layout
              key={trainee.traineeId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={cn(
                "group relative card-elevation rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/5 border border-slate-100 bg-white transition-all duration-300",
                viewMode === "list" && "flex items-center p-2"
              )}
            >
              {viewMode === "grid" ? (
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-white p-0.5 border border-border-subtle relative shadow-md transition-transform group-hover:scale-105 duration-500">
                      <img src={avatarUrl(trainee)} alt={trainee.traineeName} className="w-full h-full object-cover rounded-md" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-lg shadow-emerald-500/20" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                       <span className={cn(
                         "px-2 py-0.5 text-[7px] font-black uppercase tracking-widest rounded-lg border shadow-sm",
                         trainee.roadmapStatus === "ACTIVE" ? "bg-bg-success text-status-success border-border-subtle" : "bg-surface-soft text-text-tertiary border-border-subtle"
                       )}>
                         {trainee.roadmapStatus ?? 'No Roadmap'}
                       </span>
                       <button className="text-text-tertiary hover:text-brand transition-colors p-1 bg-slate-50 rounded-lg"><MoreVertical size={12}/></button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-[15px] font-bold text-text-primary group-hover:text-brand transition-colors truncate tracking-tight">{trainee.traineeName}</h3>
                    <p className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-0.5 opacity-60">{trainee.specialization}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                         <span className="text-[7px] font-black text-text-tertiary uppercase tracking-widest leading-none opacity-60">Path Progress</span>
                        <div className="flex items-center gap-1">
                           <TrendingUp size={10} className="text-brand opacity-40" />
                           <span className="text-[11px] font-black text-brand leading-none">{trainee.progressPercentage}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-surface-secondary rounded-full overflow-hidden p-px border border-border-subtle shadow-inner">
                        <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${trainee.progressPercentage}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className="h-full bg-brand rounded-full shadow-lg shadow-brand/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.1em] opacity-60">Focus Topic</p>
                        <p className="text-[10px] font-bold text-text-secondary truncate mt-1 leading-tight py-1 px-2 bg-surface-soft rounded-lg border border-border-subtle">{trainee.activeTopic ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.1em] opacity-60">Last sync</p>
                        <p className="text-[10px] font-bold text-text-secondary mt-1 leading-tight py-1 px-2 bg-surface-soft rounded-lg border border-border-subtle">{formatRelative(trainee.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border-subtle flex gap-2">
                     <Link to={`/trainee/${trainee.traineeId}`} className="flex-1 py-1.5 rounded-lg border border-border-subtle text-[8px] font-black uppercase tracking-[0.2em] text-center text-text-secondary hover:bg-slate-50 transition-all shadow-sm">
                       Details
                     </Link>
                     {trainee.roadmapId ? (
                       <Link to={`/roadmap/${trainee.roadmapId}`} className="flex-1 py-1.5 rounded-lg bg-brand text-white text-[8px] font-black uppercase tracking-[0.2em] text-center hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
                         Roadmap
                       </Link>
                     ) : (
                       <span className="flex-1 py-1.5 rounded-lg bg-surface-soft text-[8px] font-black uppercase tracking-[0.2em] text-center text-text-tertiary border border-border-subtle opacity-50 cursor-not-allowed">
                         No Roadmap
                       </span>
                     )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-white shrink-0 overflow-hidden border border-slate-100 shadow-sm">
                    <img src={avatarUrl(trainee)} alt={trainee.traineeName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-1 min-w-0">
                      <h4 className="text-[12px] font-bold truncate text-slate-900">{trainee.traineeName}</h4>
                      <p className="text-[7px] font-black text-brand uppercase tracking-widest truncate">{trainee.specialization}</p>
                    </div>
                    <div className="flex items-center gap-2 col-span-1">
                      <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${trainee.progressPercentage}%` }}></div>
                      </div>
                      <span className="text-[8px] font-black w-6 text-right text-slate-400">{trainee.progressPercentage}%</span>
                    </div>
                    <div className="col-span-1 min-w-0 hidden md:block">
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Topic</p>
                       <p className="text-[10px] font-bold truncate mt-0.5 text-slate-700">{trainee.activeTopic ?? '—'}</p>
                    </div>
                    <div className="col-span-1 min-w-0 hidden lg:block">
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Update</p>
                       <p className="text-[10px] font-bold truncate mt-0.5 text-slate-700">{formatRelative(trainee.lastUpdated)}</p>
                    </div>
                    <div className="flex justify-end gap-1.5 col-span-1">
                       <Link to={`/trainee/${trainee.traineeId}`} className="p-1 text-slate-300 hover:text-brand transition-colors"><Mail size={14} /></Link>
                       {trainee.roadmapId ? (
                         <Link to={`/roadmap/${trainee.roadmapId}`} className="bg-brand/5 p-1 text-brand rounded-lg hover:bg-brand hover:text-white transition-all">
                           <ChevronRight size={14} />
                         </Link>
                       ) : (
                         <span className="bg-surface-soft p-1 text-text-tertiary rounded-lg opacity-40 cursor-not-allowed">
                           <ChevronRight size={14} />
                         </span>
                       )}
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
