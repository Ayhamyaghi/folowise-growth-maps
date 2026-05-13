/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  ClipboardList, 
  Activity, 
  UserCog, 
  LogOut,
  LayoutGrid,
  LifeBuoy
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../App";
import { motion } from "motion/react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Trainees", href: "/trainees", icon: Users, roles: ["manager"] },
  { name: "Roadmaps", href: "/roadmap/default", icon: GitBranch, roles: ["manager"] },
  { name: "My Roadmap", href: "/roadmap/me", icon: GitBranch, roles: ["trainee"] },
  { name: "Change Requests", href: "/requests", icon: ClipboardList, roles: ["manager"] },
  { name: "My Requests", href: "/requests", icon: ClipboardList, roles: ["trainee"] },
  { name: "Activity Log", href: "/activity", icon: Activity, roles: ["manager"] },
  { name: "Accounts", href: "/accounts", icon: UserCog, roles: ["manager"] },
  { name: "My Account", href: "/accounts", icon: UserCog, roles: ["trainee"] },
];

export default function Sidebar() {
  const location = useLocation();
  const { role, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(role || ""));

  return (
    <aside className="w-68 border-r border-border-subtle bg-surface-sidebar flex flex-col h-full transition-all duration-500 ease-in-out shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-xl shadow-brand/20">
          <LayoutGrid size={22} strokeWidth={2.5} />
        </div>
        <span className="font-display font-black text-xl tracking-tight text-text-primary">Folowise</span>
      </div>

      <nav className="flex-1 px-5 space-y-1 mt-4">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-bg-nav-active text-brand shadow-sm shadow-brand/5" 
                  : "text-text-secondary hover:bg-white hover:text-text-primary border border-transparent hover:border-border-subtle"
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={cn(isActive ? "text-brand" : "text-text-tertiary group-hover:text-text-primary transition-colors")} />
              {item.name}
              {isActive && (
                <motion.div 
                  layoutId="sidebarActive"
                  className="absolute left-0 w-1 y-2 h-6 bg-brand rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-border-subtle space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center border border-border-subtle overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role === "manager" ? "Manager" : "Alex Rivera"}`} alt={role === "manager" ? "Manager" : "Trainee"} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-lg shadow-emerald-500/20" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-primary truncate tracking-tight uppercase leading-tight">{role === "manager" ? "Manager" : "Alex Rivera"}</p>
            <p className="text-[10px] font-black text-text-tertiary truncate tracking-widest mt-1 opacity-70 uppercase">{role === "manager" ? "Administration" : "Engineering"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            className="flex items-center justify-center gap-2 p-3.5 bg-white border border-border-subtle rounded-2xl text-text-tertiary hover:bg-slate-50 hover:text-brand transition-all group shadow-sm active:scale-95"
            title="Help & Support"
          >
            <LifeBuoy size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
          
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 p-3.5 bg-white border border-border-subtle rounded-2xl text-text-tertiary hover:bg-rose-50 hover:text-rose-500 transition-all group shadow-sm active:scale-95"
            title="Sign Out"
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}
