/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  MoreHorizontal,
  ChevronRight,
  Search
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
import { mockTrainees, mockActivity, mockChangeRequests } from "../data/mockData";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

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

import { useAuth } from "../App";

export default function DashboardPage() {
  const { role } = useAuth();
  
  if (role === "manager") {
    return <ManagerDashboard />;
  }
  
  return <TraineeDashboard />;
}

function ManagerDashboard() {
  const totalTrainees = 17;
  const avgProgress = 58;
  const pendingRequests = mockChangeRequests.length;
  const topicsCompletedThisWeek = 24;

  return (
    <div className="space-y-10 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">Dashboard Overview</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Real-time oversight of trainee roadmap progression</p>
        </div>
        <div className="flex gap-3">
          <Link to="/trainees" className="px-7 py-3.5 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/20">
            Add New Trainee
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Trainees", value: totalTrainees, icon: Users, color: "text-status-info", bg: "bg-bg-info", border: "border-border-subtle" },
          { label: "Average Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-brand", bg: "bg-bg-brand-soft", border: "border-border-subtle" },
          { label: "Pending Requests", value: pendingRequests, icon: Clock, color: "text-status-pending", bg: "bg-bg-pending", border: "border-border-subtle" },
          { label: "Topics Completed", value: topicsCompletedThisWeek, icon: CheckCircle2, color: "text-status-success", bg: "bg-bg-success", border: "border-border-subtle", suffix: "This Week" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "card-elevation p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden group",
              stat.border
            )}
          >
            <div className={stat.bg + " absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700 blur-3xl opacity-50"} />
            
            <div className="relative z-10">
              <div className={stat.color + " mb-4 flex items-center justify-between"}>
                <div className={cn("p-2.5 rounded-xl bg-white shadow-sm border", stat.border)}>
                  <stat.icon size={20} className="opacity-90" />
                </div>
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-40 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.25em]">
                {stat.label}
              </h3>
              <div className="flex items-baseline gap-3 mt-1.5">
                <p className="text-3xl font-display font-black tracking-tighter text-text-primary">{stat.value}</p>
                {stat.suffix && <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-60">{stat.suffix}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trainees Requiring Attention */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-elevation p-8 rounded-[2.5rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary">Trainees needing attention</h3>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5">Critical status alerts</p>
            </div>
            <button className="p-2.5 text-text-tertiary hover:text-brand transition-colors"><MoreHorizontal size={20}/></button>
          </div>
          
          <div className="space-y-4">
            {mockTrainees.filter(t => t.attentionReason).slice(0, 5).map((trainee) => (
              <div key={trainee.id} className="flex items-center gap-5 p-4.5 rounded-[1.75rem] bg-white border border-border-subtle transition-all hover:bg-slate-50/50 group hover:border-brand/20 shadow-sm shadow-black/[0.02]">
                <div className="w-11 h-11 rounded-xl border-2 border-white overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500 shrink-0">
                   <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-sm font-bold text-text-primary group-hover:text-brand transition-colors tracking-tight">{trainee.name}</h4>
                   <div className="flex items-center gap-3 mt-1.5">
                       <span className="flex items-center gap-2 text-[10px] font-black bg-bg-danger text-status-danger px-2.5 py-1 rounded-full uppercase tracking-wider border border-border-subtle shadow-sm">
                           <Clock size={11} strokeWidth={3} /> {trainee.attentionReason}
                       </span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <p className="text-sm font-black text-text-primary tracking-tight font-display">{trainee.progress}%</p>
                   <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1 opacity-60">{trainee.lastUpdate}</p>
                </div>
                <Link to={`/roadmap/${trainee.id}`} className="p-2.5 text-text-tertiary hover:text-brand transition-all hover:translate-x-1 ml-2 bg-slate-50 rounded-xl border border-border-subtle">
                   <ChevronRight size={18} />
                </Link>
              </div>
            ))}
          </div>
          
          <Link to="/trainees" className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.4em] text-text-tertiary hover:text-brand transition-all group flex items-center justify-center gap-3">
             <span className="w-10 h-[1px] bg-border-subtle group-hover:bg-brand/20 transition-colors" />
             View All Trainees 
             <span className="w-10 h-[1px] bg-border-subtle group-hover:bg-brand/20 transition-colors" />
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="card-elevation p-8 rounded-[2.5rem] shadow-sm flex flex-col pt-10"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary">Recent Activity</h3>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5">Global Workspace events</p>
            </div>
            <Link to="/activity" className="p-2.5 text-text-tertiary hover:text-brand transition-all bg-slate-50 rounded-xl shadow-sm"><MoreHorizontal size={20}/></Link>
          </div>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50 before:rounded-full flex-1">
            {mockActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-5 pl-10 group">
                <div className={cn(
                   "absolute left-0 w-[22px] h-[22px] rounded-full border-[4px] border-white z-10 transition-transform group-hover:scale-110 shadow-xl",
                  activity.type === "progress" ? "bg-emerald-500 shadow-emerald-500/20" : 
                  activity.type === "approval" ? "bg-brand shadow-brand/20" :
                  activity.type === "rejection" ? "bg-rose-500 shadow-rose-500/20" : "bg-slate-200"
                )}></div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm leading-relaxed text-text-secondary tracking-tight">
                      <span className="font-bold text-text-primary">{activity.user}</span>
                      {" "}{activity.action}{" "}
                      <span className="font-bold text-text-primary bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">"{activity.target}"</span>
                   </p>
                   <span className="text-[11px] text-text-tertiary uppercase font-black tracking-widest block mt-2 opacity-60">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="card-elevation p-8 rounded-[2.5rem] shadow-sm border border-border-subtle"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-text-primary">Pending Requests Review</h3>
            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5">Waiting for Manager review</p>
          </div>
          <Link to="/requests" className="text-[11px] font-black uppercase tracking-[0.3em] text-brand hover:brightness-110 transition-all bg-brand/5 px-5 py-2 rounded-2xl border border-brand/10 shadow-sm shadow-brand/5">View All Requests</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {mockChangeRequests.slice(0, 3).map(req => (
             <div key={req.id} className="flex items-center justify-between p-4.5 bg-white rounded-[1.5rem] border border-border-subtle group hover:border-brand/30 transition-all hover:bg-slate-50/50 shadow-sm hover:shadow-lg hover:shadow-brand/[0.03]">
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-11 h-11 rounded-1.5xl flex items-center justify-center font-black text-xs border transition-transform group-hover:scale-110 shadow-sm",
                    req.action === "Add" ? "bg-bg-success text-status-success border-border-subtle shadow-sm" :
                    req.action === "Delete" ? "bg-bg-danger text-status-danger border-border-subtle shadow-sm" :
                    req.action === "Move" ? "bg-bg-brand-soft text-brand border-border-subtle shadow-sm" :
                    "bg-bg-pending text-status-pending border-border-subtle shadow-sm"
                  )}>
                     {req.action.toUpperCase().charAt(0)}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-text-primary leading-none tracking-tight">{req.traineeName}</p>
                     <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary opacity-60">{req.action}</span>
                        <span className="text-[10px] font-bold text-text-secondary truncate max-w-[120px] italic">"{req.topicName}"</span>
                     </div>
                  </div>
               </div>
               <ChevronRight size={20} className="text-text-tertiary opacity-40 group-hover:text-brand group-hover:opacity-100 transition-all" />
             </div>
           ))}
        </div>
      </motion.div>
    </div>
  );
}

function TraineeDashboard() {
  const myData = mockTrainees[0]; 
  const myRequests = mockChangeRequests.filter(r => r.traineeName === myData.name);
  const myActivity = mockActivity.filter(a => a.user === myData.name || a.target.includes(myData.name));
  const completedTopics = 24;

  return (
    <div className="space-y-10 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">My Dashboard</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Personalized view of your professional growth</p>
        </div>
        <div className="flex gap-4 items-center bg-white border border-border-subtle px-4.5 py-2.5 rounded-2xl shadow-sm">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">Roadmap Status</span>
              <span className="text-xs font-black text-status-success uppercase tracking-[0.2em] mt-1.5 block px-3 py-1 bg-bg-success rounded-lg border border-border-subtle">{myData.roadmapStatus}</span>
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Roadmap Progress", value: `${myData.progress}%`, icon: TrendingUp, color: "text-brand", bg: "bg-bg-brand-soft", border: "border-border-subtle" },
          { label: "Active Topic", value: myData.activeTopic, icon: Search, color: "text-status-info", bg: "bg-bg-info", border: "border-border-subtle" },
          { label: "My Requests", value: myRequests.length, icon: Clock, color: "text-status-pending", bg: "bg-bg-pending", border: "border-border-subtle" },
          { label: "Topics Completed", value: completedTopics, icon: CheckCircle2, color: "text-status-success", bg: "bg-bg-success", border: "border-border-subtle" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "card-elevation p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden group",
              stat.border
            )}
          >
            <div className={stat.bg + " absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700 blur-3xl opacity-50"} />
            
            <div className="relative z-10">
              <div className={stat.color + " mb-4 flex items-center justify-between"}>
                <div className={cn("p-2.5 rounded-xl bg-white shadow-sm border", stat.border)}>
                  <stat.icon size={20} className="opacity-90" />
                </div>
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-40 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.25em]">{stat.label}</h3>
              <p className={cn(
                "font-display font-black mt-1.5 tracking-tighter text-text-primary leading-tight",
                stat.label === "Active Topic" ? "text-lg break-words line-clamp-2" : "text-3xl"
              )}>
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Recently Completed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-elevation p-8 rounded-[2.5rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary">Recently Completed Topics</h3>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5">Your latest curriculum milestones</p>
            </div>
            <button className="p-2.5 text-text-tertiary hover:text-brand transition-colors bg-slate-50 rounded-xl"><MoreHorizontal size={20}/></button>
          </div>
          
          <div className="space-y-4 flex-1">
             {mockActivity.filter(a => a.type === "progress" && (a.user === myData.name || a.target.includes(myData.name))).slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-5 p-4.5 rounded-[1.75rem] bg-white border border-border-subtle group hover:border-emerald-200 transition-all hover:bg-emerald-50/20 shadow-sm shadow-emerald-500/[0.01]">
                   <div className="w-11 h-11 rounded-xl bg-status-success flex items-center justify-center text-white shrink-0 shadow-xl shadow-status-success/20 group-hover:scale-105 transition-transform">
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-text-primary truncate tracking-tight">{activity.target.replace('as Completed', '')}</p>
                      <p className="text-[11px] font-black text-status-success uppercase tracking-widest mt-1 opacity-80">{activity.time}</p>
                   </div>
                   <ChevronRight size={20} className="text-text-tertiary/20 group-hover:text-status-success group-hover:translate-x-1 transition-all" />
                </div>
             ))}
             {mockActivity.filter(a => a.type === "progress" && (a.user === myData.name || a.target.includes(myData.name))).length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <CheckCircle2 size={40} className="opacity-20 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No recently completed topics</p>
               </div>
             )}
          </div>
          
          <Link to="/roadmap/me" className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:brightness-110 transition-all">
             Continue Roadmap Progress
          </Link>
        </motion.div>

        {/* My Recent Activity */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="card-elevation p-8 rounded-[2.5rem] shadow-sm flex flex-col pt-10"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary">Recent Activity</h3>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5">Personal log</p>
            </div>
          </div>
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50 before:rounded-full flex-1">
            {myActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-5 pl-10 group">
                <div className={cn(
                  "absolute left-0 w-[22px] h-[22px] rounded-full border-[4px] border-white z-10 transition-transform group-hover:scale-110 shadow-xl",
                  activity.type === "progress" ? "bg-emerald-500 shadow-emerald-500/20" : 
                  activity.type === "approval" ? "bg-brand shadow-brand/20" :
                  activity.type === "rejection" ? "bg-rose-500 shadow-rose-500/20" : "bg-slate-200"
                )}></div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm leading-relaxed text-text-secondary tracking-tight">
                      <span className="font-bold text-text-primary">{activity.user === myData.name ? "You" : activity.user}</span> {activity.action} {activity.target.toLowerCase().includes('as completed') ? (
                        <>
                          <span className="font-bold text-text-primary bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{activity.target.replace(/ as [Cc]ompleted/, '')}</span> as completed
                        </>
                      ) : (
                        <span className="font-bold text-text-primary bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">"{activity.target}"</span>
                      )}
                   </p>
                   <span className="text-[11px] text-text-tertiary uppercase font-black tracking-widest block mt-2 opacity-60">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.6 }}
           className="card-elevation p-8 rounded-[2.5rem] shadow-sm border border-border-subtle"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-text-primary">Current Focus</h3>
              <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5">Active progression node</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand px-4 py-1.5 bg-brand/5 rounded-xl border border-brand/10 shadow-sm shadow-brand/5">{myData.specialization} Path</span>
          </div>
          <div className="space-y-4">
             {myData.activeTopic && (
               <div className="p-6.5 rounded-[2rem] bg-bg-brand-soft border border-border-subtle shadow-sm group cursor-pointer hover:bg-bg-brand-soft/80 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand opacity-[0.03] blur-3xl rounded-full -mr-16 -mt-16" />
                  <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-3 relative z-10">Active Milestone</p>
                  <p className="text-2xl font-display font-black text-text-primary leading-tight group-hover:text-brand transition-colors relative z-10">{myData.activeTopic}</p>
                  <div className="mt-6 relative z-10">
                     <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-black text-text-tertiary uppercase tracking-widest opacity-60">Completion rate</span>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                            <span className="text-sm font-black text-brand">45%</span>
                        </div>
                     </div>
                     <div className="h-3 bg-white/50 rounded-full overflow-hidden p-0.5 border border-border-subtle">
                        <div className="h-full bg-brand rounded-full shadow-lg shadow-brand/30" style={{ width: '45%' }}></div>
                     </div>
                  </div>
               </div>
             )}
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.7 }}
           className="card-elevation p-8 rounded-[2.5rem] shadow-sm border border-border-subtle flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight text-text-primary">My Requests</h3>
            <Link to="/requests" className="text-[11px] font-black uppercase tracking-[0.3em] text-brand hover:brightness-110 transition-all bg-brand/5 px-5 py-2 rounded-2xl border border-brand/10 shadow-sm shadow-brand/5">See all</Link>
          </div>
          <div className="space-y-4 flex-1">
             {myRequests.slice(0, 3).map(req => (
               <div key={req.id} className="flex items-center justify-between p-4.5 bg-white border border-border-subtle rounded-[1.5rem] hover:bg-slate-50/50 transition-all shadow-sm hover:translate-y-[-2px]">
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-1.5xl flex items-center justify-center text-white font-black text-[11px] shadow-lg",
                      req.action === "Add" ? "bg-status-success shadow-status-success/20" :
                      req.action === "Delete" ? "bg-status-danger shadow-status-danger/20" : "bg-brand shadow-brand/20"
                    )}>
                       {req.action.charAt(0)}
                    </div>
                    <div>
                       <p className="text-base font-bold text-text-primary leading-none tracking-tight">{req.topicName}</p>
                       <div className="flex items-center gap-3 mt-3">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border shadow-sm",
                            req.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5" : 
                            req.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5" : 
                            "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5"
                          )}>
                             {req.status === "Pending" ? "Awaiting Review" : req.status}
                          </span>
                       </div>
                    </div>
                 </div>
                 <ChevronRight size={22} className="text-text-tertiary opacity-40" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
