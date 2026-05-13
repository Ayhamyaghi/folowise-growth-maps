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
    <div className="space-y-8 pb-10 transition-colors duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Real-time oversight of trainee roadmap progression</p>
        </div>
        <div className="flex gap-2">
          <Link to="/trainees" className="px-5 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
            Add Trainee
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Trainees", value: totalTrainees, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Average Progress", value: `${avgProgress}%`, icon: TrendingUp, color: "text-brand", bg: "bg-brand/10" },
          { label: "Pending Requests", value: pendingRequests, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Topics Completed", value: topicsCompletedThisWeek, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", suffix: "This Week" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-elevation p-7 rounded-[2.5rem] hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden group"
          >
            <div className={stat.bg + " absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700 blur-3xl opacity-30"} />
            
            <div className="relative z-10">
              <div className={stat.color + " mb-6 flex items-center justify-between"}>
                <stat.icon size={22} className="opacity-80" />
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-slate-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">
                {stat.label}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-3xl font-display font-black tracking-tighter text-slate-900 dark:text-white">{stat.value}</p>
                {stat.suffix && <span className="text-[8px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-tighter">{stat.suffix}</span>}
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
          className="lg:col-span-2 card-elevation p-6 rounded-[2rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Trainees needing attention</h3>
              <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Critical roadmap status alerts</p>
            </div>
            <button className="p-2 text-slate-300 hover:text-brand transition-colors"><MoreHorizontal size={18}/></button>
          </div>
          
          <div className="space-y-3">
            {mockTrainees.filter(t => t.attentionReason).slice(0, 5).map((trainee) => (
              <div key={trainee.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-surface-50 dark:bg-zinc-800/20 border border-surface-200 dark:border-zinc-800 transition-all hover:bg-surface-100 dark:hover:bg-zinc-800">
                <div className="w-10 h-10 rounded-xl border border-surface-200 dark:border-zinc-700 overflow-hidden shadow-sm shrink-0">
                   <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">{trainee.name}</h4>
                   <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-black bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{trainee.attentionReason}</span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <p className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">{trainee.progress}% Progress</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last: {trainee.lastUpdate}</p>
                </div>
                <Link to={`/roadmap/${trainee.id}`} className="p-2 text-slate-300 hover:text-brand transition-all hover:translate-x-1">
                   <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
          
          <Link to="/trainees" className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:brightness-110 transition-all">
             View All Trainees 
          </Link>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="card-elevation p-6 rounded-[2rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
              <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Recent Roadmap Activity</p>
            </div>
            <Link to="/activity" className="p-2 text-slate-300 hover:text-brand transition-all"><MoreHorizontal size={18}/></Link>
          </div>
          <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-surface-200 dark:before:bg-zinc-800 flex-1">
            {mockActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-4 pl-7 group">
                <div className={cn(
                  "absolute left-0 w-[19px] h-[19px] rounded-full border-[3px] border-surface-100 dark:border-zinc-900 z-10 transition-transform group-hover:scale-125 shadow-sm",
                  activity.type === "progress" ? "bg-emerald-500 shadow-emerald-500/20" : 
                  activity.type === "approval" ? "bg-brand shadow-brand/20" :
                  activity.type === "rejection" ? "bg-rose-500 shadow-rose-500/20" : "bg-slate-300"
                )}></div>
                <div className="flex-1 min-w-0">
                   <p className="text-[12px] leading-tight text-slate-600 dark:text-zinc-300">
                      <span className="font-bold text-slate-900 dark:text-white">{activity.user}</span>
                      {" "}{activity.action}{" "}
                      <span className="font-bold italic text-slate-800 dark:text-zinc-200">"{activity.target}"</span>
                   </p>
                   <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-[0.1em] block mt-1">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="card-elevation p-6 rounded-[2rem] shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold tracking-tight">Pending Requests Preview</h3>
            <Link to="/requests" className="text-[9px] font-black uppercase tracking-widest text-brand">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {mockChangeRequests.slice(0, 3).map(req => (
               <div key={req.id} className="flex items-center justify-between p-5 bg-surface-50 dark:bg-zinc-800/40 rounded-2xl border border-surface-200 dark:border-zinc-800 group hover:border-brand/30 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs border transition-transform group-hover:scale-110",
                      req.action === "Add" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                      req.action === "Delete" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
                      req.action === "Move" ? "bg-brand/10 text-brand border-brand/20" :
                      "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}>
                       {req.action.toUpperCase().charAt(0)}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{req.traineeName}</p>
                       <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">{req.action}:</span>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 truncate max-w-[120px]">{req.topicName}</span>
                       </div>
                    </div>
                 </div>
                 <ChevronRight size={16} className="text-slate-300" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TraineeDashboard() {
  const myData = mockTrainees[0]; // Assuming first user for prototype
  const myRequests = mockChangeRequests.filter(r => r.traineeName === myData.name);
  const myActivity = mockActivity.filter(a => a.user === myData.name || a.target.includes(myData.name));
  const completedTopics = 24;

  return (
    <div className="space-y-8 pb-10 transition-colors duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">My Dashboard</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Personalized view of your professional growth</p>
        </div>
        <div className="flex gap-2">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roadmap Status</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{myData.roadmapStatus}</span>
           </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Roadmap Progress", value: `${myData.progress}%`, icon: TrendingUp, color: "text-brand", bg: "bg-brand/10" },
          { label: "Active Topic", value: myData.activeTopic, icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "My Requests", value: myRequests.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Topics Completed", value: completedTopics, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-elevation p-7 rounded-[2.5rem] hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden group"
          >
            <div className={stat.bg + " absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700 blur-3xl opacity-30"} />
            
            <div className="relative z-10">
              <div className={stat.color + " mb-6 flex items-center justify-between"}>
                <stat.icon size={22} className="opacity-80" />
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-slate-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
              <p className={cn(
                "font-display font-black mt-1.5 tracking-tighter text-slate-900 dark:text-white leading-tight",
                stat.label === "Active Topic" ? "text-lg break-words" : "text-2xl"
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
          className="lg:col-span-2 card-elevation p-6 rounded-[2rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Recently Completed Topics</h3>
              <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Your latest curriculum milestones</p>
            </div>
            <button className="p-2 text-slate-300 hover:text-brand transition-colors"><MoreHorizontal size={18}/></button>
          </div>
          
          <div className="space-y-3 flex-1">
             {mockActivity.filter(a => a.type === "progress" && (a.user === myData.name || a.target.includes(myData.name))).slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                   <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 size={16} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">{activity.target.replace('as Completed', '')}</p>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{activity.time}</p>
                   </div>
                   <ChevronRight size={14} className="text-emerald-300" />
                </div>
             ))}
             {mockActivity.filter(a => a.type === "progress" && (a.user === myData.name || a.target.includes(myData.name))).length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <CheckCircle2 size={40} className="opacity-20 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">No recently completed topics</p>
               </div>
             )}
          </div>
          
          <Link to="/roadmap/me" className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand hover:brightness-110 transition-all">
             Continue Roadmap Progress
          </Link>
        </motion.div>

        {/* My Recent Activity */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="card-elevation p-6 rounded-[2rem] shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
              <p className="text-[9px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Recent Roadmap Activity</p>
            </div>
          </div>
          <div className="space-y-6 relative before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-[1px] before:bg-surface-200 dark:before:bg-zinc-800 flex-1">
            {myActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-4 pl-7 group">
                <div className={cn(
                  "absolute left-0 w-[20px] h-[20px] rounded-full border-[3px] border-surface-100 dark:border-zinc-900 z-10 transition-transform group-hover:scale-125 shadow-sm",
                  activity.type === "progress" ? "bg-emerald-500 shadow-emerald-500/20" : 
                  activity.type === "approval" ? "bg-brand shadow-brand/20" :
                  activity.type === "rejection" ? "bg-rose-500 shadow-rose-500/20" : "bg-slate-300"
                )}></div>
                <div className="flex-1 min-w-0">
                   <p className="text-[12px] leading-tight text-slate-600 dark:text-zinc-300">
                      {activity.user === myData.name ? "You" : <b>{activity.user}</b>} {activity.action} {activity.target.toLowerCase().includes('as completed') ? (
                        <>
                          <span className="font-bold text-slate-800 dark:text-zinc-200">{activity.target.replace(/ as [Cc]ompleted/, '')}</span> as completed
                        </>
                      ) : (
                        <span className="font-bold italic text-slate-800 dark:text-zinc-200">"{activity.target}"</span>
                      )}
                   </p>
                   <span className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-[0.1em] block mt-1">{activity.time}</span>
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
           className="card-elevation p-8 rounded-[2.5rem] shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight">Current Roadmap Focus</h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{myData.specialization} Path</span>
          </div>
          <div className="space-y-4">
             {myData.activeTopic && (
               <div className="p-5 rounded-2xl bg-brand/5 border border-brand/10">
                  <p className="text-[9px] font-black text-brand uppercase tracking-widest mb-2">Active Topic Progress</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{myData.activeTopic}</p>
                  <div className="mt-4 flex items-center gap-3">
                     <div className="flex-1 h-2 bg-brand/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: '45%' }}></div>
                     </div>
                     <span className="text-xs font-black text-brand">45%</span>
                  </div>
               </div>
             )}
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.7 }}
           className="card-elevation p-8 rounded-[2.5rem] shadow-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight">My Requests</h3>
            <Link to="/requests" className="text-[10px] font-black uppercase tracking-widest text-brand">See all</Link>
          </div>
          <div className="space-y-3">
             {myRequests.slice(0, 3).map(req => (
               <div key={req.id} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-zinc-800/40 rounded-2xl border border-surface-200 dark:border-zinc-800">
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[10px]",
                      req.action === "Add" ? "bg-emerald-500" :
                      req.action === "Delete" ? "bg-rose-500" : "bg-brand"
                    )}>
                       {req.action.charAt(0)}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{req.topicName}</p>
                       <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                            req.status === "Pending" ? "bg-amber-500/5 text-amber-500 border-amber-500/20" : 
                            req.status === "Approved" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : 
                            "bg-rose-500/5 text-rose-500 border-rose-500/20"
                          )}>
                             {req.status === "Pending" ? "Pending Approval" : req.status}
                          </span>
                       </div>
                    </div>
                 </div>
                 <ChevronRight size={14} className="text-slate-300" />
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
