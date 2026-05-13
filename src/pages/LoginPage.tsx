/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogIn, 
  User, 
  ShieldCheck, 
  Github, 
  Chrome, 
  ArrowRight, 
  Layout, 
  Zap, 
  BarChart3,
  ChevronRight,
  Shield,
  Layers,
  Map as MapIcon
} from "lucide-react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = (role: "manager" | "trainee") => {
    login(role);
    navigate("/");
  };

  const scrollToAuth = () => {
    const element = document.getElementById("auth-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 selection:bg-brand/30 transition-colors duration-500 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand/10 blur-[160px] rounded-full opacity-60 dark:opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[160px] rounded-full opacity-60 dark:opacity-20" />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand/20">
              <Layers size={18} />
            </div>
            <span className="text-sm font-display font-black uppercase tracking-tight">Folowise <span className="text-brand">Roadmap</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Overview", "Roadmaps", "Workflow"].map((item) => (
              <button key={item} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand transition-colors">
                {item}
              </button>
            ))}
          </div>

          <button 
            onClick={scrollToAuth}
            className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-black/5"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 border border-brand/10 mb-6">
               <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
               <span className="text-[9px] font-black text-brand uppercase tracking-[0.2em]">Product Launch Prototype v1.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95] mb-8 uppercase">
              Personalized training <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">roadmaps</span>, managed with clarity.
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-xl">
              Folowise Roadmap Manager helps managers create, track, and approve individualized learning paths for every trainee — all in one visual roadmap workspace.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToAuth}
                className="px-8 py-4 bg-brand text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/30 flex items-center gap-3"
              >
                Sign In To Workspace <ArrowRight size={16} />
              </button>
              <button className="px-8 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-3 text-slate-600 dark:text-zinc-400">
                Explore Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
             {/* Decorative UI Element 1 */}
             <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-blue-500/20 rounded-[3rem] blur-3xl opacity-50" />
                <div className="absolute inset-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden p-8 flex flex-col justify-between group">
                   <div>
                      <div className="flex justify-between items-center mb-8">
                         <div className="w-12 h-1 bg-brand rounded-full" />
                         <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-zinc-800" />
                      </div>
                      <div className="space-y-4">
                         {[1, 0.8, 0.6].map((op, i) => (
                            <div key={i} className="h-10 bg-slate-50 dark:bg-zinc-800 rounded-xl flex items-center px-4 gap-3" style={{ opacity: op }}>
                               <div className="w-2 h-2 rounded-full bg-brand" />
                               <div className="w-2/3 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full" />
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1 h-32 bg-slate-50 dark:bg-zinc-800 rounded-2xl flex flex-col justify-center items-center gap-2 p-4">
                         <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <Zap size={16} />
                         </div>
                         <div className="w-full h-1 bg-emerald-500 rounded-full" />
                      </div>
                      <div className="flex-1 h-32 bg-brand text-white rounded-2xl flex flex-col justify-center items-center gap-2 p-4">
                         <BarChart3 size={24} />
                         <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-white" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl flex items-center gap-3 z-20"
                >
                   <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                      <Shield size={16} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security</p>
                      <p className="text-xs font-bold">Verified Node</p>
                   </div>
                </motion.div>

                <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute -bottom-6 -left-6 p-4 bg-brand text-white rounded-2xl shadow-xl shadow-brand/20 flex items-center gap-3 z-20"
                >
                   <MapIcon size={20} />
                   <div>
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Active Path</p>
                      <p className="text-xs font-bold">Backend Spec.</p>
                   </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="relative z-10 py-24 px-6 bg-slate-50/50 dark:bg-zinc-900/10 border-y border-slate-100 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Visual Roadmaps",
                desc: "Track each trainee’s learning plan as a structured, interactive visual roadmap.",
                icon: MapIcon,
                color: "text-brand"
              },
              {
                title: "Approval Workflow",
                desc: "Review and approve trainee structural changes before they affect the active roadmap.",
                icon: ShieldCheck,
                color: "text-emerald-500"
              },
              {
                title: "Progress Visibility",
                desc: "Real-time insights into trainee progress, pending requests, and curriculum activity.",
                icon: BarChart3,
                color: "text-blue-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm hover:border-brand/30 transition-all duration-500"
              >
                <div className={cn("w-14 h-14 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-brand/5 group-hover:text-brand", feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase font-display">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-16"
          >
            <h2 className="text-[11px] font-black text-brand uppercase tracking-[0.4em] mb-4">Workspace Access</h2>
            <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white uppercase">Choose your workspace</h3>
            <p className="text-slate-500 dark:text-zinc-500 mt-4 font-medium">Select your institutional role to continue to Folowise Roadmap Manager.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => handleLogin("manager")}
              className="group relative p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-left hover:border-brand/40 transition-all shadow-xl shadow-slate-200/20 dark:shadow-none"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-brand/5 group-hover:text-brand transition-all border border-slate-100 dark:border-zinc-800 group-hover:border-brand/20">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-xl font-bold tracking-tight mb-2 uppercase font-display">Manager</h4>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium leading-relaxed mb-8">
                Manage trainees, design roadmaps, review approvals, and track high-level activity.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand group-hover:gap-3 transition-all">
                Enter Manager Workspace <ChevronRight size={14} />
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => handleLogin("trainee")}
              className="group relative p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-left hover:border-brand/40 transition-all shadow-xl shadow-slate-200/20 dark:shadow-none"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-900 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-brand/5 group-hover:text-brand transition-all border border-slate-100 dark:border-zinc-800 group-hover:border-brand/20">
                <User size={32} />
              </div>
              <h4 className="text-xl font-bold tracking-tight mb-2 uppercase font-display">Trainee</h4>
              <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium leading-relaxed mb-8">
                View your personal roadmap, mark progress, and submit change requests to your manager.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand group-hover:gap-3 transition-all">
                Enter Trainee Workspace <ChevronRight size={14} />
              </div>
            </motion.button>
          </div>

          <div className="relative text-center">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-zinc-800"></div>
             </div>
             <span className="relative px-8 bg-white dark:bg-[#09090b] text-[9px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.4em]">Integrated Identity Platform</span>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
             <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                <Chrome size={18} /> Continue with Google
             </button>
             <button className="flex items-center gap-3 px-8 py-4 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                <Github size={18} /> Continue with GitHub
             </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 px-6 border-t border-slate-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 bg-slate-400 rounded flex items-center justify-center text-white">
              <Layers size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Folowise Roadmap v1.0.4</span>
          </div>
          <div className="flex gap-8">
             {["Privacy", "Terms", "Support", "Institutional"].map(item => (
                <button key={item} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">{item}</button>
             ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 Folowise Systems Inc.</p>
        </div>
      </footer>
    </div>
  );
}

