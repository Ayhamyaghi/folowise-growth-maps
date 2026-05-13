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
  Check,
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
    <div className="space-y-10 max-w-6xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">Accounts</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Platform credentials and institutional roles</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/30">
          <UserPlus size={20} strokeWidth={3} /> Add Entry
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="bg-surface-secondary text-text-primary p-8 rounded-[2.5rem] shadow-card relative overflow-hidden group border border-border-standard">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
               <Shield size={140} />
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 border border-border-subtle shadow-control">
               <Fingerprint size={24} className="text-brand" />
            </div>
            <h3 className="text-2xl font-display font-black mb-1 text-text-primary">Manager Account</h3>
            <p className="text-[11px] uppercase font-black tracking-[0.3em] text-text-tertiary mb-8 opacity-60">Full Access Authority</p>
            <div className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-border-subtle shadow-sm hover:shadow-card transition-all duration-500">
               <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-card">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager" alt="Admin" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                  <p className="text-base font-display font-black uppercase tracking-tight text-text-primary">System Admin</p>
                  <p className="text-[11px] font-bold text-text-tertiary tracking-wider">management@folowise.io</p>
               </div>
               <button className="p-2.5 hover:bg-bg-brand-soft rounded-xl transition-colors text-brand" title="Manage Security">
                  <Key size={18} />
               </button>
            </div>
         </div>

         <div className="bg-white border border-border-subtle p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
               <User size={140} />
            </div>
            <div className="w-12 h-12 bg-surface-soft rounded-xl flex items-center justify-center mb-6 border border-border-subtle shadow-control ring-4 ring-bg-brand-soft/20">
               <Users size={24} className="text-brand" />
            </div>
            <h3 className="text-2xl font-display font-black mb-1 text-text-primary">Trainee Accounts</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-8 opacity-60">Provisioned Seats: {mockTrainees.length}/100</p>
            <div className="flex -space-x-3 mb-2">
               {mockTrainees.slice(0, 5).map((t, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl border-4 border-white overflow-hidden shadow-xl shadow-black/[0.05] ring-1 ring-slate-100 bg-white">
                     <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
               ))}
               <div className="w-10 h-10 rounded-xl border-4 border-white bg-slate-50/50 flex items-center justify-center text-[10px] font-black text-text-tertiary ring-1 ring-slate-100 shadow-xl">
                  +{mockTrainees.length - 5}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-border-subtle rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/[0.03]">
         <div className="p-8 border-b border-border-subtle flex justify-between items-center bg-surface-soft">
            <h3 className="text-[11px] font-black font-display uppercase tracking-[0.4em] text-text-tertiary opacity-60">Active Directory</h3>
            <div className="flex gap-4">
               <div className="relative group">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" />
                  <input type="text" placeholder="QUICK SEARCH..." className="pl-13 pr-6 py-2.5 bg-white border border-border-subtle rounded-xl text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-bg-brand-soft/30 focus:border-brand/30 transition-all shadow-control w-72 group-hover:border-border-standard" />
               </div>
            </div>
         </div>
         <div className="divide-y divide-border-subtle">
            {mockTrainees.map((trainee) => (
               <div key={trainee.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-border-subtle group-hover:scale-105 transition-all shadow-xl shadow-black/[0.02] relative ring-4 ring-transparent group-hover:ring-brand/[0.03]">
                        <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h4 className="text-lg font-display font-black tracking-tight text-text-primary group-hover:text-brand transition-colors">{trainee.name}</h4>
                        <div className="flex items-center gap-4 mt-1.5">
                           <span className="text-[11px] font-bold text-text-tertiary lowercase flex items-center gap-2 opacity-60">
                              <Mail size={13} className="text-brand opacity-60" /> {trainee.email}
                           </span>
                           <span className="w-1 h-1 bg-border-subtle rounded-full" />
                           <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em] leading-none bg-bg-brand-soft px-3 py-1 rounded-xl border border-border-subtle">{trainee.specialization}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                     <button className="p-3 text-text-tertiary hover:text-amber-500 hover:bg-amber-50/50 border border-transparent hover:border-amber-100 rounded-xl transition-all shadow-sm hover:shadow-amber-500/10" title="Rotate Cipher">
                        <Key size={18} />
                     </button>
                     <button className="p-3 text-text-tertiary hover:text-rose-500 hover:bg-rose-50/50 border border-transparent hover:border-rose-100 rounded-xl transition-all shadow-sm hover:shadow-rose-500/10" title="Suspend Authority">
                        <Trash2 size={18} />
                     </button>
                     <div className="w-[1px] h-6 bg-border-subtle mx-1" />
                     <button className="p-3 text-text-tertiary hover:text-text-primary hover:bg-white border border-transparent hover:border-border-subtle rounded-xl transition-all shadow-sm active:scale-95">
                        <ChevronRight size={18} strokeWidth={3} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
         <div className="p-10 bg-slate-50/30 text-center border-t border-border-subtle">
            <button className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.5em] hover:text-brand transition-all flex items-center gap-4 mx-auto opacity-40 hover:opacity-100">
               <Shield size={18} /> Load Strategic Identity Records
            </button>
         </div>
      </div>
    </div>
  );
}

function TraineeAccountsView() {
  const me = mockTrainees[0]; // Prototope user Alex Rivera
  
   return (
    <div className="space-y-12 max-w-5xl mx-auto pb-24 px-4 md:px-0">
      <header>
        <h1 className="text-4xl font-display font-black tracking-tight text-text-primary">Account Identity</h1>
        <p className="text-text-secondary mt-2 text-sm font-medium">Manage your credentials and platform presence</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
           <div className="card-elevation bg-white border border-border-subtle rounded-[2.5rem] p-9 text-center shadow-xl shadow-black/[0.02]">
               <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden mx-auto mb-8 relative group ring-1 ring-slate-100">
                  <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                     <User size={24} className="text-white scale-75 group-hover:scale-100 transition-transform" />
                  </div>
              </div>
              <h2 className="text-2xl font-display font-black tracking-tight text-text-primary">{me.name}</h2>
              <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mt-3 bg-brand/[0.03] inline-block px-4 py-1.5 rounded-xl border border-brand/5 shadow-sm">{me.specialization} Unit</p>
              
              <div className="mt-9 pt-9 border-t border-border-subtle text-left">
                 <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-40">Milestone Progress</span>
                    <span className="text-[10px] font-black text-brand uppercase tracking-widest">{me.progress}%</span>
                 </div>
                 <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100 p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${me.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-brand rounded-full shadow-lg shadow-brand/30" 
                    />
                 </div>
              </div>
           </div>

            <div className="bg-surface-secondary text-text-primary p-8 rounded-[2rem] shadow-card relative overflow-hidden group border border-border-standard">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
                  <Shield size={140} />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 text-brand opacity-60">Institutional Role</h4>
               <p className="text-lg font-display font-black uppercase text-text-primary">Standard Trainee</p>
               <div className="w-10 h-1 bg-brand/20 rounded-full mt-6" />
               <p className="text-xs mt-6 font-bold text-text-secondary leading-relaxed italic tracking-tight">"Verified identity account protected by Folowise System Architecture."</p>
            </div>
        </div>

         <div className="lg:col-span-2 space-y-8">
           <div className="card-elevation bg-white border border-border-subtle rounded-[2.5rem] p-9 shadow-xl shadow-black/[0.02]">
              <h3 className="text-xl font-display font-black mb-8 text-text-primary uppercase tracking-tight">Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                        <Mail size={16} className="text-brand opacity-60" /> Primary Email
                    </label>
                    <p className="text-lg font-black text-text-primary tracking-tight">{me.email}</p>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                        <Shield size={16} className="text-brand opacity-60" /> Unit Authority
                    </label>
                    <p className="text-lg font-black text-text-primary tracking-tight">{me.specialization}</p>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                        <Check size={16} className="text-brand opacity-60" /> Account Status
                    </label>
                    <div className="flex items-center gap-3 bg-emerald-50 w-fit px-4 py-2 rounded-xl border border-emerald-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">Strategic Active</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                        <Fingerprint size={16} className="text-brand opacity-60" /> Secure UID
                    </label>
                    <p className="text-lg font-black text-brand tracking-tighter">{me.id.toUpperCase()}-001-FLOW</p>
                 </div>
              </div>
           </div>

           <div className="card-elevation bg-white border border-border-subtle rounded-[2.5rem] p-9 shadow-xl shadow-black/[0.02]">
              <h3 className="text-xl font-display font-black mb-8 flex items-center gap-5 text-text-primary uppercase tracking-tight">
                 <Key size={28} className="text-brand" /> Governance & Security
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.25rem] border border-border-subtle hover:bg-white hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
                    <div className="flex gap-5">
                       <div className="w-13 h-13 bg-white rounded-2xl shadow-xl shadow-black/[0.02] border border-border-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ring-4 ring-slate-50/50">
                          <Key size={24} className="text-brand" />
                       </div>
                       <div>
                          <p className="text-base font-display font-black text-text-primary leading-tight mb-1.5 uppercase tracking-tight">Cipher Management</p>
                          <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.2em] opacity-60">Credential rotation: 120 Days ago</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black text-brand uppercase tracking-[0.3em] px-6 py-3 bg-brand/[0.03] hover:bg-brand/10 border border-brand/5 focus:ring-4 focus:ring-brand/5 rounded-xl transition-all shadow-sm active:scale-95">Rotate</button>
                 </div>
                 
                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2.25rem] border border-border-subtle opacity-40 grayscale group cursor-not-allowed">
                    <div className="flex gap-5">
                       <div className="w-13 h-13 bg-white rounded-2xl shadow-sm border border-border-subtle flex items-center justify-center">
                          <Shield size={24} className="text-text-tertiary" />
                       </div>
                       <div>
                          <p className="text-base font-display font-black text-text-primary leading-tight mb-1.5 uppercase tracking-tight opacity-60">Biometric Authority</p>
                          <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.2em] opacity-40">Institutional clearance required</p>
                       </div>
                    </div>
                    <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em] px-6 py-3 bg-slate-100 rounded-xl opacity-40">Restricted</div>
                 </div>
              </div>
           </div>
           
           <div className="text-center pt-10">
                <button className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.6em] hover:text-rose-500 hover:tracking-[0.7em] transition-all duration-700 opacity-40 hover:opacity-100">Relinquish Strategic Entry Authority</button>
           </div>
        </div>
      </div>
    </div>
  );
}
