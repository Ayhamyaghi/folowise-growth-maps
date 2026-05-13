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
  Moon,
  Sun,
  LayoutGrid
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth, useTheme } from "../App";
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
  const { theme, toggleTheme } = useTheme();

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(role || ""));

  return (
    <aside className="w-64 border-r border-slate-200/60 dark:border-zinc-800/60 bg-surface-100 flex flex-col h-full transition-all duration-500 ease-in-out">
      <div className="p-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center text-white shadow-[0_8px_16px_-4px_rgba(99,102,241,0.4)]">
          <LayoutGrid size={20} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">Folowise</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-brand/5 text-brand shadow-[inset_0_1px_1px_rgba(99,102,241,0.05)] border border-brand/10" 
                  : "text-slate-400 dark:text-zinc-500 hover:bg-surface-50 dark:hover:bg-zinc-800/40 hover:text-slate-800 dark:hover:text-zinc-200 border border-transparent"
              )}
            >
              <item.icon size={19} className={cn(isActive ? "text-brand" : "group-hover:text-slate-900 dark:group-hover:text-zinc-200 transition-colors")} />
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

      <div className="p-6 border-t border-slate-100 dark:border-zinc-800/60 space-y-6">
        <div className="flex items-center gap-3.5 px-2 py-1">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-surface-50 dark:bg-zinc-800 flex items-center justify-center border border-surface-200 dark:border-zinc-700 overflow-hidden shadow-sm">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role === "manager" ? "Manager" : "Trainee"}`} alt={role === "manager" ? "Manager" : "Trainee"} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-surface-100 dark:border-[#0c0c0e] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate tracking-tight uppercase">{role === "manager" ? "Manager" : "Trainee"}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 truncate tracking-wide mt-0.5">{role === "manager" ? "manager@folowise.io" : "trainee@folowise.io"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 p-3 bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl text-slate-400 dark:text-zinc-500 hover:bg-surface-100 dark:hover:bg-zinc-800 transition-all group shadow-sm active:scale-95"
            title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
          >
            {theme === "light" ? <Moon size={18} className="group-hover:text-brand transition-colors" /> : <Sun size={18} className="group-hover:text-yellow-500 transition-colors" />}
          </button>
          
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 p-3 bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-xl text-slate-400 dark:text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-500 dark:hover:text-rose-400 transition-all group shadow-sm active:scale-95"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
}
