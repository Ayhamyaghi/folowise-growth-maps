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
    <div className="space-y-6 max-w-5xl mx-auto pb-20 px-4 md:px-0">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">Accounts</h1>
          <p className="text-text-secondary mt-1 text-xs font-medium">Platform credentials and institutional roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-lg">
          <UserPlus size={14} strokeWidth={3} /> Add Entry
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <div className="bg-surface-secondary text-text-primary p-5 rounded-2xl shadow-sm relative overflow-hidden group border border-border-standard">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Shield size={80} />
            </div>
            
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center mb-3 border border-border-subtle shadow-sm">
               <Fingerprint size={18} className="text-brand" />
            </div>
            <h3 className="text-lg font-display font-black mb-0.5 text-text-primary">Manager Account</h3>
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-text-tertiary mb-4 opacity-60">Full Access Authority</p>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border-subtle shadow-sm">
               <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manager" alt="Admin" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                  <p className="text-[13px] font-black uppercase tracking-tight text-text-primary">System Admin</p>
                  <p className="text-[9px] font-bold text-text-tertiary tracking-wider opacity-60 truncate">management@folowise.io</p>
               </div>
               <button className="p-1.5 hover:bg-bg-brand-soft rounded-lg transition-colors text-brand" title="Manage Security">
                  <Key size={14} />
               </button>
            </div>
         </div>

         <div className="bg-white border border-border-subtle p-5 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
               <User size={80} />
            </div>
            <div className="w-9 h-9 bg-surface-soft rounded-lg flex items-center justify-center mb-3 border border-border-subtle">
               <Users size={18} className="text-brand" />
            </div>
            <h3 className="text-lg font-display font-black mb-0.5 text-text-primary">Trainee Accounts</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-4 opacity-60">Seats: {mockTrainees.length}/100</p>
            <div className="flex -space-x-2 mb-1">
               {mockTrainees.slice(0, 5).map((t, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg border-2 border-white overflow-hidden shadow-sm bg-white">
                     <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
               ))}
               <div className="w-7 h-7 rounded-lg border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-black text-text-tertiary">
                  +{mockTrainees.length - 5}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
         <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-soft">
            <h3 className="text-[9px] font-black font-display uppercase tracking-[0.3em] text-text-tertiary opacity-60">Active Directory</h3>
            <div className="flex gap-4">
               <div className="relative group">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input type="text" placeholder="SEARCH..." className="pl-9 pr-4 py-1.5 bg-white border border-border-subtle rounded-lg text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-bg-brand-soft/30 transition-all w-56" />
               </div>
            </div>
         </div>
         <div className="divide-y divide-border-subtle">
            {mockTrainees.map((trainee) => (
               <div key={trainee.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-lg bg-white overflow-hidden border border-border-subtle shadow-sm">
                        <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h4 className="text-[15px] font-display font-black tracking-tight text-text-primary group-hover:text-brand transition-colors leading-tight">{trainee.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] font-bold text-text-tertiary lowercase flex items-center gap-1.5 opacity-60">
                              <Mail size={10} className="text-brand opacity-60" /> {trainee.email}
                           </span>
                           <span className="w-0.5 h-0.5 bg-border-subtle rounded-full" />
                           <span className="text-[8px] font-black text-brand uppercase tracking-[0.1em] border border-brand/20 px-1.5 py-0.5 rounded-lg">{trainee.specialization}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-1 lg:opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                     <button className="p-1.5 text-text-tertiary hover:text-amber-500 rounded-lg" title="Key">
                        <Key size={14} />
                     </button>
                     <button className="p-1.5 text-text-tertiary hover:text-rose-500 rounded-lg" title="Delete">
                        <Trash2 size={14} />
                     </button>
                     <button className="p-1.5 text-text-tertiary hover:text-text-primary rounded-lg">
                        <ChevronRight size={14} strokeWidth={3} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
         <div className="p-4 bg-slate-50/30 text-center border-t border-border-subtle">
            <button className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.4em] hover:text-brand transition-all flex items-center gap-2.5 mx-auto opacity-40 hover:opacity-100 active:scale-95">
               <Shield size={14} /> strategic records
            </button>
         </div>
      </div>
    </div>
  );
}

function TraineeAccountsView() {
  const me = mockTrainees[0]; // Prototope user Alex Rivera
  
   return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 px-4 md:px-0">
      <header>
        <h1 className="text-2xl font-display font-black tracking-tight text-text-primary">Account Identity</h1>
        <p className="text-text-secondary mt-1 text-xs font-medium">Manage your credentials and platform presence</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white border border-border-subtle rounded-2xl p-6 text-center shadow-xl">
               <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg overflow-hidden mx-auto mb-5 relative group ring-1 ring-slate-100">
                  <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                     <User size={18} className="text-white" />
                  </div>
              </div>
              <h2 className="text-lg font-display font-black tracking-tight text-text-primary leading-tight">{me.name}</h2>
              <p className="text-[8px] font-black text-brand uppercase tracking-[0.3em] mt-1.5 bg-brand/[0.03] inline-block px-2.5 py-0.5 rounded-lg border border-brand/5 shadow-sm">{me.specialization} Unit</p>
              
              <div className="mt-5 pt-5 border-t border-border-subtle text-left">
                 <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] opacity-40">Milestone</span>
                    <span className="text-[9px] font-black text-brand tracking-widest">{me.progress}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-px">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${me.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-brand rounded-full shadow-lg" 
                    />
                 </div>
              </div>
           </div>

            <div className="bg-surface-secondary text-text-primary p-5 rounded-xl shadow-sm relative overflow-hidden group border border-border-standard">
               <h4 className="text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 text-brand opacity-60">Institutional Role</h4>
               <p className="text-[14px] font-display font-black uppercase text-text-primary leading-none">Standard Trainee</p>
               <p className="text-[11px] mt-3 font-bold text-text-secondary leading-relaxed italic tracking-tight opacity-80">"Verified account protected by Folowise."</p>
            </div>
        </div>

         <div className="lg:col-span-2 space-y-4">
           <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-display font-black mb-5 text-text-primary uppercase tracking-tight leading-none">Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 opacity-60">
                        <Mail size={12} className="text-brand" /> Primary Email
                    </label>
                    <p className="text-[14px] font-black text-text-primary tracking-tight">{me.email}</p>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 opacity-60">
                        <Shield size={12} className="text-brand" /> Unit Authority
                    </label>
                    <p className="text-[14px] font-black text-text-primary tracking-tight">{me.specialization}</p>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 opacity-60">
                        <Check size={12} className="text-brand" /> Account Status
                    </label>
                    <div className="flex items-center gap-1.5 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Active</p>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-1.5 opacity-60">
                        <Fingerprint size={12} className="text-brand" /> Secure UID
                    </label>
                    <p className="text-[14px] font-black text-brand tracking-tighter opacity-80 uppercase">{me.id}-FLOW</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-display font-black mb-5 flex items-center gap-3 text-text-primary uppercase tracking-tight leading-none">
                 <Key size={18} className="text-brand" /> Governance
              </h3>
              <div className="space-y-2">
                 <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-border-subtle hover:bg-white transition-all group">
                    <div className="flex gap-3">
                       <div className="w-9 h-9 bg-white rounded-lg border border-border-subtle flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                          <Key size={16} className="text-brand" />
                       </div>
                       <div>
                          <p className="text-[13px] font-display font-black text-text-primary leading-tight mb-0.5 uppercase tracking-tight">Cipher Rotation</p>
                          <p className="text-[8px] text-text-tertiary font-black uppercase tracking-[0.1em] opacity-40">120 Days ago</p>
                       </div>
                    </div>
                    <button className="text-[8px] font-black text-brand uppercase tracking-[0.2em] px-3.5 py-1.5 bg-brand/5 hover:bg-brand/10 rounded-lg transition-all active:scale-95 border border-brand/10">Rotate</button>
                 </div>
              </div>
           </div>
           
           <div className="text-center pt-6">
                 <button className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.4em] hover:text-rose-500 transition-all opacity-40 hover:opacity-100 active:scale-95 leading-none">Relinquish Authority</button>
           </div>
         </div>
      </div>
    </div>
  );
}
