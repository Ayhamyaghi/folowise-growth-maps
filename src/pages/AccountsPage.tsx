/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  User, 
  Mail, 
  Key, 
  MoreHorizontal,
  ChevronRight,
  Search,
  Users,
  Fingerprint
} from "lucide-react";
import { mockTrainees } from "../data/mockData";
import { cn } from "../lib/utils";

import { useAuth } from "../App";

export default function AccountsPage() {
  const { role } = useAuth();
  
  if (role === "manager") {
    return <ManagerAccountsView />;
  }
  
  return <TraineeAccountsView />;
}

function ManagerAccountsView() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto transition-colors duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Accounts</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Platform credentials and institutional roles</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl text-sm font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand/20">
          <UserPlus size={18} /> Add Account
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="bg-brand text-white p-7 rounded-[2rem] shadow-xl shadow-brand/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Shield size={100} />
            </div>
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md">
               <Fingerprint size={22} />
            </div>
            <h3 className="text-lg font-bold mb-1 font-display">Manager Account</h3>
            <p className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-6">System Administration</p>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager" alt="Admin" />
               </div>
               <div className="flex-1">
                  <p className="text-xs font-bold font-display uppercase tracking-tight">Administrator</p>
                  <p className="text-[10px] opacity-70">management@folowise.io</p>
               </div>
               <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Key size={16} />
               </button>
            </div>
         </div>

         <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-7 rounded-[2rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <User size={100} />
            </div>
            <div className="w-11 h-11 bg-slate-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-5 border border-slate-200 dark:border-zinc-700">
               <Users size={22} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold mb-1 font-display">Trainee Accounts</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium mb-6">Total trainee accounts: {mockTrainees.length}</p>
            <div className="flex -space-x-2">
               {mockTrainees.slice(0, 5).map((t, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-md">
                     <img src={t.avatar} alt={t.name} />
                  </div>
               ))}
               <div className="w-9 h-9 rounded-full border-4 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  +{mockTrainees.length - 5}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm">
         <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <h3 className="text-base font-bold font-display uppercase tracking-tight">Active Trainee Accounts</h3>
            <div className="flex gap-3">
               <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search accounts..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl text-[10px] font-bold focus:ring-1 focus:ring-brand" />
               </div>
            </div>
         </div>
         <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {mockTrainees.map((trainee) => (
               <div key={trainee.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700 grayscale group-hover:grayscale-0 transition-all">
                        <img src={trainee.avatar} alt={trainee.name} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold tracking-tight">{trainee.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 lowercase flex items-center gap-1">
                              <Mail size={10} /> {trainee.email}
                           </span>
                           <span className="w-1 h-1 bg-slate-300 dark:bg-zinc-700 rounded-full" />
                           <span className="text-[9px] font-black text-brand uppercase tracking-widest leading-none">{trainee.specialization}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <button className="p-2.5 text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors" title="Reset Password">
                        <Key size={18} />
                     </button>
                     <button className="p-2.5 text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete Account">
                        <Trash2 size={18} />
                     </button>
                     <button className="p-2.5 text-slate-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                        <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
         <div className="p-6 bg-slate-50 dark:bg-zinc-800/20 text-center">
            <button className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.3em] hover:text-brand transition-colors">Load Archive Accounts</button>
         </div>
      </div>
    </div>
  );
}

function TraineeAccountsView() {
  const me = mockTrainees[0]; // Prototope user Alex Rivera
  
   return (
    <div className="space-y-8 max-w-4xl mx-auto transition-colors duration-500 pb-20">
      <header>
        <h1 className="text-3xl font-display font-bold tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage your identity and account preferences</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
           <div className="card-elevation bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] p-8 text-center shadow-sm">
               <div className="w-32 h-32 rounded-[1.5rem] border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden mx-auto mb-6">
                 <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">{me.name}</h2>
              <p className="text-[9px] font-black text-brand uppercase tracking-[0.2em] mt-1.5">{me.specialization} Trainee</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-zinc-800">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Roadmap Progress</span>
                    <span className="text-[9px] font-black text-brand uppercase">{me.progress}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand" style={{ width: `${me.progress}%` }} />
                 </div>
              </div>
           </div>

           <div className="bg-brand text-white p-6 rounded-3xl shadow-lg shadow-brand/20 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                 <Shield size={80} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80 text-white">Role</h4>
              <p className="text-sm font-bold">Trainee Account</p>
              <p className="text-[10px] mt-4 font-medium opacity-60 leading-relaxed">Verified account managed by Folowise Manager.</p>
           </div>
        </div>

         <div className="md:col-span-2 space-y-6">
           <div className="card-elevation bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-lg font-bold font-display mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{me.email}</p>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Specialization</label>
                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{me.specialization}</p>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Status</label>
                    <p className="text-sm font-bold text-emerald-500 uppercase tracking-wide">Active</p>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Trainee ID</label>
                    <p className="text-sm font-bold text-brand">{me.id.toUpperCase()}-001</p>
                 </div>
              </div>
           </div>

           <div className="card-elevation bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-3">
                 <Fingerprint size={20} className="text-brand" /> Security Settings
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800/60">
                    <div className="flex gap-4">
                       <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
                          <Key size={18} className="text-slate-400" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Password Management</p>
                          <p className="text-[10px] text-slate-400 font-medium">Last modification: 4 months ago</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black text-brand uppercase tracking-widest px-4 py-2 hover:bg-brand/5 rounded-lg transition-colors">Modify</button>
                 </div>
                 
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800/60 opacity-60 grayscale">
                    <div className="flex gap-4">
                       <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
                          <Shield size={18} className="text-slate-400" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Two-Factor Authentication</p>
                          <p className="text-[10px] text-slate-400 font-medium">Provisioning required by admin</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 cursor-not-allowed">Disabled</button>
                 </div>
              </div>
           </div>
           
           <div className="text-center pt-4">
               <button className="text-[10px] font-black text-slate-300 dark:text-zinc-600 uppercase tracking-[0.4em] hover:text-rose-500 transition-colors">Request Account Deprovisioning</button>
           </div>
        </div>
      </div>
    </div>
  );
}
