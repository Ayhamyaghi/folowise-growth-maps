/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight,
  Search,
  AlertCircle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  dashboardApi,
  ManagerDashboardResponse,
  TraineeDashboardResponse,
} from "../lib/apiClient";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuth } from "../App";

const chartData = [
  { name: "Mon", progress: 40 },
  { name: "Tue", progress: 45 },
  { name: "Wed", progress: 42 },
  { name: "Thu", progress: 50 },
  { name: "Fri", progress: 55 },
  { name: "Sat", progress: 58 },
  { name: "Sun", progress: 62 },
];

const specData = [
  { name: "Developer", count: 8, color: "#6366f1" },
  { name: "AI Engineer", count: 4, color: "#8b5cf6" },
  { name: "QA", count: 3, color: "#ec4899" },
  { name: "Marketing", count: 2, color: "#f59e0b" },
];

function actionLabel(action: string): string {
  switch (action) {
    case 'ADD_TOPIC': return 'Add';
    case 'EDIT_TOPIC': return 'Edit';
    case 'DELETE_TOPIC': return 'Delete';
    case 'MOVE_TOPIC': return 'Move';
    default: return action;
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'PENDING': return 'Review';
    case 'APPROVED': return 'Approved';
    case 'REJECTED': return 'Rejected';
    default: return status;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === "manager") {
    return <ManagerDashboard />;
  }

  return <TraineeDashboard />;
}

function ManagerDashboard() {
  const [data, setData] = useState<ManagerDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const result = await dashboardApi.getManager();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
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

  if (error || !data) {
    return (
      <div className="flex items-center gap-3 p-4 bg-bg-danger border border-border-subtle rounded-xl text-sm font-bold text-status-danger">
        <AlertCircle size={16} /> {error ?? 'Failed to load dashboard'}
      </div>
    );
  }

  const traineesNeedingAttention = data.traineeProgressSummaries
    .filter(t => t.attentionReason)
    .slice(0, 5);

  return (
    <div className="space-y-5 pb-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">Dashboard Overview</h1>
          <p className="text-text-secondary mt-1 text-xs font-medium opacity-80">Real-time oversight of trainee roadmap progression</p>
        </div>
        <div className="flex gap-3">
          <Link to="/trainees" className="px-5 py-2.5 bg-brand text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-lg">
            Add New Trainee
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { label: "Total Trainees", value: data.totalTrainees, icon: Users, color: "text-status-info", bg: "bg-bg-info", border: "border-border-subtle" },
          { label: "Average Progress", value: `${data.averageProgress}%`, icon: TrendingUp, color: "text-brand", bg: "bg-bg-brand-soft", border: "border-border-subtle" },
          { label: "Pending Requests", value: data.pendingChangeRequests, icon: Clock, color: "text-status-pending", bg: "bg-bg-pending", border: "border-border-subtle" },
          { label: "Topics Completed", value: data.completedTopicsThisWeek, icon: CheckCircle2, color: "text-status-success", bg: "bg-bg-success", border: "border-border-subtle", suffix: "This Week" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "card-elevation p-4 rounded-2xl hover:shadow-xl relative overflow-hidden group border",
              stat.border
            )}
          >
            <div className={stat.bg + " absolute top-0 right-0 w-20 h-20 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-700 blur-2xl opacity-40"} />

            <div className="relative z-10">
              <div className={stat.color + " mb-2.5 flex items-center justify-between"}>
                <div className={cn("p-1.5 rounded-lg bg-white shadow-sm border", stat.border)}>
                  <stat.icon size={16} className="opacity-90" />
                </div>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-40 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-text-tertiary text-[8px] font-black uppercase tracking-[0.15em]">
                {stat.label}
              </h3>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="text-xl font-display font-black tracking-tighter text-text-primary">{stat.value}</p>
                {stat.suffix && <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-60">{stat.suffix}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trainees Requiring Attention */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card-elevation p-5 rounded-2xl shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-text-primary">Trainees needing attention</h3>
              <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mt-0.5 opacity-60">Critical status alerts</p>
            </div>
            <button className="p-1.5 text-text-tertiary hover:text-brand transition-colors"><MoreHorizontal size={16}/></button>
          </div>

          <div className="space-y-2.5">
            {traineesNeedingAttention.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                <CheckCircle2 size={32} className="opacity-30 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">All trainees on track</p>
              </div>
            ) : traineesNeedingAttention.map((trainee) => (
              <div key={trainee.traineeId} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border-subtle transition-all hover:bg-slate-50/50 group hover:border-brand/20 shadow-sm shadow-black/[0.01]">
                <div className="w-9 h-9 rounded-lg border-2 border-white overflow-hidden shadow-sm shrink-0">
                   <img src={trainee.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${trainee.traineeName}`} alt={trainee.traineeName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors tracking-tight">{trainee.traineeName}</h4>
                   <div className="flex items-center gap-2 mt-0.5">
                       <span className="flex items-center gap-1 text-[8px] font-black bg-bg-danger text-status-danger px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-rose-100 shadow-sm">
                           <Clock size={10} /> {trainee.attentionReason}
                       </span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <p className="text-sm font-black text-text-primary tracking-tight font-display">{trainee.progressPercentage}%</p>
                   <p className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mt-0.5 opacity-50">
                     {trainee.lastUpdated ? formatDate(trainee.lastUpdated) : '—'}
                   </p>
                </div>
                {trainee.roadmapId && (
                  <Link to={`/roadmap/${trainee.roadmapId}`} className="p-1.5 text-text-tertiary hover:text-brand transition-all hover:translate-x-0.5 ml-1 bg-slate-50 rounded-lg border border-border-subtle">
                     <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <Link to="/trainees" className="mt-6 text-center text-[8px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-brand transition-all group flex items-center justify-center gap-2">
             <span className="w-6 h-[1px] bg-border-subtle group-hover:bg-brand/20 transition-colors" />
             View All Trainees
             <span className="w-6 h-[1px] bg-border-subtle group-hover:bg-brand/20 transition-colors" />
          </Link>
        </motion.div>

        {/* Recent Activity — placeholder until activity log is implemented */}
        <motion.div
           initial={{ opacity: 0, scale: 0.99 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="card-elevation p-5 rounded-2xl shadow-sm flex flex-col pt-6"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-text-primary">Recent Activity</h3>
              <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mt-0.5 opacity-60">Global events</p>
            </div>
            <Link to="/activity" className="p-1.5 text-text-tertiary hover:text-brand transition-all bg-slate-50 rounded-lg shadow-sm"><MoreHorizontal size={16}/></Link>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-300">
            <Clock size={32} className="opacity-30 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Activity log coming soon</p>
          </div>
        </motion.div>
      </div>

      {/* Pending Requests Review */}
      <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="card-elevation p-5 rounded-2xl shadow-sm border border-border-subtle"
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-base font-bold tracking-tight text-text-primary">Pending Requests Review</h3>
            <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mt-0.5 opacity-60">Manager review</p>
          </div>
          <Link to="/requests" className="text-[8px] font-black uppercase tracking-[0.2em] text-brand hover:brightness-110 transition-all bg-brand/5 px-3 py-1.5 rounded-lg border border-brand/10 shadow-sm">View All</Link>
        </div>
        {data.recentPendingRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-300">
            <CheckCircle2 size={32} className="opacity-30 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">No pending requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {data.recentPendingRequests.map(req => (
               <div key={req.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-border-subtle group hover:border-brand/30 transition-all hover:bg-slate-50/50 shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center font-black text-[9px] border transition-transform group-hover:scale-110",
                      req.action === "ADD_TOPIC" ? "bg-bg-success text-status-success border-emerald-100 shadow-sm" :
                      req.action === "DELETE_TOPIC" ? "bg-bg-danger text-status-danger border-rose-100 shadow-sm" :
                      req.action === "MOVE_TOPIC" ? "bg-bg-brand-soft text-brand border-indigo-100 shadow-sm" :
                      "bg-bg-pending text-status-pending border-amber-100 shadow-sm"
                    )}>
                       {actionLabel(req.action).charAt(0)}
                    </div>
                    <div>
                       <p className="text-xs font-bold text-text-primary leading-none tracking-tight">{req.requestedByDisplayName}</p>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-text-tertiary opacity-60">{actionLabel(req.action)}</span>
                          <span className="text-[8px] font-bold text-text-secondary truncate max-w-[80px] italic">"{req.proposedTitle ?? req.description}"</span>
                       </div>
                    </div>
                 </div>
                 <Link to="/requests"><ChevronRight size={14} className="text-text-tertiary opacity-40 group-hover:text-brand transition-all" /></Link>
               </div>
             ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function TraineeDashboard() {
  const [data, setData] = useState<TraineeDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const result = await dashboardApi.getTrainee();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
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

  if (error || !data) {
    return (
      <div className="flex items-center gap-3 p-4 bg-bg-danger border border-border-subtle rounded-xl text-sm font-bold text-status-danger">
        <AlertCircle size={16} /> {error ?? 'Failed to load dashboard'}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-text-primary">My Dashboard</h1>
          <p className="text-text-secondary mt-1 text-sm font-medium">Personalized view of your professional growth</p>
        </div>
        <div className="flex gap-4 items-center bg-white border border-border-subtle px-4 py-2 rounded-xl shadow-sm">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest leading-none">Roadmap Status</span>
              <span className="text-[10px] font-black text-status-success uppercase tracking-[0.2em] mt-1 block px-2.5 py-0.5 bg-bg-success rounded-lg border border-border-subtle">
                {data.roadmapStatus ?? 'N/A'}
              </span>
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Roadmap Progress", value: `${data.progressPercentage}%`, icon: TrendingUp, color: "text-brand", bg: "bg-bg-brand-soft", border: "border-border-subtle" },
          { label: "Active Topic", value: data.activeTopic ?? "No active topic", icon: Search, color: "text-status-info", bg: "bg-bg-info", border: "border-border-subtle" },
          { label: "My Requests", value: data.pendingRequestsCount, icon: Clock, color: "text-status-pending", bg: "bg-bg-pending", border: "border-border-subtle" },
          { label: "Topics Completed", value: data.completedCount, icon: CheckCircle2, color: "text-status-success", bg: "bg-bg-success", border: "border-border-subtle" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "card-elevation p-5 rounded-[1.5rem] hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden group",
              stat.border
            )}
          >
            <div className={stat.bg + " absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700 blur-3xl opacity-50"} />

            <div className="relative z-10">
              <div className={stat.color + " mb-3 flex items-center justify-between"}>
                <div className={cn("p-2 rounded-xl bg-white shadow-sm border", stat.border)}>
                  <stat.icon size={18} className="opacity-90" />
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-40 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-text-tertiary text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
              <p className={cn(
                "font-display font-black mt-1 tracking-tighter text-text-primary leading-tight",
                stat.label === "Active Topic" ? "text-base break-words line-clamp-2" : "text-2xl"
              )}>
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Recently Completed Topics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-elevation p-6 rounded-[2rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-text-primary">Recently Completed Topics</h3>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">Your latest curriculum milestones</p>
            </div>
            <button className="p-2 text-text-tertiary hover:text-brand transition-colors bg-slate-50 rounded-xl"><MoreHorizontal size={18}/></button>
          </div>

          <div className="space-y-3 flex-1">
             {data.recentlyCompletedTopics.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <CheckCircle2 size={40} className="opacity-20 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No recently completed topics</p>
               </div>
             ) : data.recentlyCompletedTopics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-4 p-3.5 rounded-[1.25rem] bg-white border border-border-subtle group hover:border-emerald-200 transition-all hover:bg-emerald-50/20 shadow-sm shadow-emerald-500/[0.01]">
                   <div className="w-10 h-10 rounded-xl bg-status-success flex items-center justify-center text-white shrink-0 shadow-md shadow-status-success/20 group-hover:scale-105 transition-transform">
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate tracking-tight">{topic.title}</p>
                      <p className="text-[10px] font-black text-status-success uppercase tracking-widest mt-0.5 opacity-80">
                        {topic.completedAt ? formatDate(topic.completedAt) : '—'}
                      </p>
                   </div>
                   <ChevronRight size={18} className="text-text-tertiary/20 group-hover:text-status-success group-hover:translate-x-1 transition-all" />
                </div>
             ))}
          </div>

          <Link to="/roadmap/me" className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.2em] text-brand hover:brightness-110 transition-all">
             Continue Roadmap Progress
          </Link>
        </motion.div>

        {/* My Recent Activity — placeholder */}
        <motion.div
           initial={{ opacity: 0, scale: 0.99 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="card-elevation p-5 rounded-2xl shadow-sm flex flex-col pt-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold tracking-tight text-text-primary">Recent Activity</h3>
              <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mt-0.5 opacity-60">Personal log</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-300">
            <Clock size={32} className="opacity-30 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Activity log coming soon</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Current Focus */}
        <motion.div
           initial={{ opacity: 0, scale: 0.99 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4 }}
           className="card-elevation p-5 rounded-2xl shadow-sm border border-border-subtle"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-text-primary">Current Focus</h3>
              <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.15em] mt-0.5 opacity-60">Active node</p>
            </div>
            {data.specialization && (
              <span className="text-[8px] font-black uppercase tracking-widest text-brand px-2 py-1 bg-brand/5 rounded-lg border border-brand/10 shadow-sm">
                {data.specialization} Path
              </span>
            )}
          </div>
          <div className="space-y-3">
             {data.activeTopic ? (
                <div className="p-4 rounded-xl bg-bg-brand-soft border border-border-subtle shadow-sm group cursor-pointer hover:bg-bg-brand-soft/80 transition-all relative overflow-hidden">
                   <p className="text-[8px] font-black text-brand uppercase tracking-[0.2em] mb-1.5 relative z-10">Active Milestone</p>
                   <p className="text-base font-display font-black text-text-primary leading-tight group-hover:text-brand transition-colors relative z-10">{data.activeTopic}</p>
                   <div className="mt-3 relative z-10">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Progress</span>
                         <span className="text-[10px] font-black text-brand">{data.progressPercentage}%</span>
                      </div>
                      <div className="h-1.5 bg-white/50 rounded-full overflow-hidden border border-border-subtle">
                         <div className="h-full bg-brand rounded-full shadow-lg" style={{ width: `${data.progressPercentage}%` }}></div>
                      </div>
                   </div>
                </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                 <Search size={32} className="opacity-30 mb-3" />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">No active topic</p>
               </div>
             )}
          </div>
        </motion.div>

        {/* My Requests */}
        <motion.div
           initial={{ opacity: 0, scale: 0.99 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="card-elevation p-5 rounded-2xl shadow-sm border border-border-subtle flex flex-col"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-base font-bold tracking-tight text-text-primary">My Requests</h3>
            <Link to="/requests" className="text-[8px] font-black uppercase tracking-[0.2em] text-brand hover:brightness-110 transition-all bg-brand/5 px-3 py-1.5 rounded-lg border border-brand/10 shadow-sm">See all</Link>
          </div>
          <div className="space-y-2.5 flex-1">
             {data.recentRequests.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                 <Clock size={32} className="opacity-30 mb-3" />
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">No requests yet</p>
               </div>
             ) : data.recentRequests.slice(0, 3).map(req => (
               <div key={req.id} className="flex items-center justify-between p-3 bg-white border border-border-subtle rounded-xl hover:bg-slate-50/50 transition-all shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-[9px] shadow-md",
                      req.action === "ADD_TOPIC" ? "bg-status-success shadow-emerald-500/10" :
                      req.action === "DELETE_TOPIC" ? "bg-status-danger shadow-rose-500/10" : "bg-brand shadow-brand/10"
                    )}>
                       {actionLabel(req.action).charAt(0)}
                    </div>
                    <div>
                       <p className="text-xs font-bold text-text-primary leading-none tracking-tight">{req.proposedTitle ?? req.description}</p>
                       <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border",
                            req.status === "PENDING" ? "bg-amber-50 text-amber-600 border-amber-100" :
                            req.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                          )}>
                             {statusLabel(req.status)}
                          </span>
                       </div>
                    </div>
                 </div>
                 <ChevronRight size={16} className="text-text-tertiary opacity-40" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
