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
    <div className="min-h-screen bg-background-app text-text-primary selection:bg-brand/30 transition-colors duration-500 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-brand/[0.03] blur-[160px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-500/[0.03] blur-[160px] rounded-full opacity-60" />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-8 py-6",
        scrolled ? "bg-white/80 backdrop-blur-2xl border-b border-border-subtle py-4 shadow-xl shadow-black/[0.02]" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-text-primary rounded-xl flex items-center justify-center text-white shadow-2xl shadow-black/20 group cursor-pointer active:scale-95 transition-transform">
              <Layers size={22} className="group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-sm font-display font-black uppercase tracking-tight">Folowise <span className="text-brand">Roadmap</span></span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["Overview", "Roadmaps", "Workflow", "Enterprise"].map((item) => (
              <button key={item} className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-brand transition-all cursor-pointer opacity-60 hover:opacity-100">
                {item}
              </button>
            ))}
          </div>

          <button 
            onClick={scrollToAuth}
            className="px-8 py-3 bg-text-primary text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-125 active:scale-95 transition-all shadow-2xl shadow-black/10"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand/[0.03] border border-brand/10 mb-10 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
               <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Strategic Prototope v1.0.4</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-text-primary leading-[0.9] mb-12 uppercase drop-shadow-sm">
              Personalized training <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">roadmaps</span>, managed with clarity.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-text-secondary leading-relaxed mb-12 max-w-xl opacity-80">
              Folowise Roadmap Manager helps managers create, track, and approve individualized learning paths for every trainee — all in one visual workspace.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={scrollToAuth}
                className="px-10 py-5 bg-brand text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/40 flex items-center gap-4 group"
              >
                Sign In To Workspace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </button>
              <button className="px-10 py-5 bg-white border border-border-subtle rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-4 text-text-secondary active:scale-95 shadow-xl shadow-black/[0.02]">
                Explore Strategic Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
             {/* Decorative UI Element 1 */}
             <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-blue-500/10 rounded-[4rem] blur-3xl opacity-30" />
                <div className="absolute inset-0 bg-white border border-border-subtle rounded-[4rem] shadow-2xl shadow-black/[0.05] overflow-hidden p-12 flex flex-col justify-between group ring-8 ring-slate-50/50">
                   <div>
                      <div className="flex justify-between items-center mb-12">
                         <div className="w-16 h-2 bg-brand rounded-full shadow-lg shadow-brand/20" />
                         <div className="w-4 h-4 rounded-full bg-slate-100 ring-4 ring-slate-50" />
                      </div>
                      <div className="space-y-6">
                         {[1, 0.7, 0.4].map((op, i) => (
                            <div key={i} className="h-14 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex items-center px-6 gap-4" style={{ opacity: op }}>
                               <div className="w-3 h-3 rounded-full bg-brand shadow-sm" />
                               <div className="w-2/3 h-2 bg-slate-200/50 rounded-full" />
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="flex-1 h-40 bg-slate-50/50 rounded-3xl flex flex-col justify-center items-center gap-3 p-6 border border-slate-100/50">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                            <Zap size={20} />
                         </div>
                         <div className="w-full h-1.5 bg-emerald-500 rounded-full" />
                      </div>
                      <div className="flex-1 h-40 bg-text-primary text-white rounded-3xl flex flex-col justify-center items-center gap-3 p-6 shadow-2xl shadow-black/20 relative overflow-hidden group/card">
                         <div className="absolute inset-0 bg-brand/10 group-hover/card:bg-brand/20 transition-colors" />
                         <BarChart3 size={32} className="relative z-10" />
                         <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative z-10">
                            <div className="w-2/3 h-full bg-brand" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Floating Badges */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 p-6 bg-white border border-border-subtle rounded-3xl shadow-2xl shadow-black/[0.1] flex items-center gap-4 z-20 ring-4 ring-slate-50/50"
                >
                   <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Shield size={24} />
                   </div>
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-text-tertiary opacity-40">Classification</p>
                      <p className="text-sm font-black text-text-primary tracking-tight">Verified Protocol</p>
                   </div>
                </motion.div>

                <motion.div 
                   animate={{ y: [0, 15, 0] }}
                   transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute -bottom-8 -left-8 p-6 bg-brand text-white rounded-3xl shadow-2xl shadow-brand/40 flex items-center gap-4 z-20"
                >
                   <MapIcon size={28} />
                   <div>
                      <p className="text-[11px] font-black uppercase opacity-60 tracking-[0.2em]">Active Matrix</p>
                      <p className="text-sm font-black tracking-tight">Strategy Unit 04</p>
                   </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="relative z-10 py-32 px-8 bg-slate-50/50 border-y border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Visual Matrix",
                desc: "Track each trainee’s strategy plan as a structured, interactive visual roadmap matrix.",
                icon: MapIcon,
                color: "text-brand"
              },
              {
                title: "Structural Guardrails",
                desc: "Review and approve trainee structural changes before they affect the active matrix.",
                icon: ShieldCheck,
                color: "text-emerald-500"
              },
              {
                title: "Strategic Visibility",
                desc: "Real-time insights into trainee progress, pending requests, and curriculum activity.",
                icon: BarChart3,
                color: "text-blue-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group p-10 bg-white border border-border-subtle rounded-[4rem] shadow-xl shadow-black/[0.02] hover:border-brand/40 hover:shadow-2xl hover:shadow-black/[0.05] transition-all duration-700"
              >
                <div className={cn("w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 group-hover:bg-brand/5 group-hover:text-brand shadow-inner", feature.color)}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-display font-black tracking-tight mb-4 uppercase text-text-primary leading-tight">{feature.title}</h3>
                <p className="text-base text-text-secondary leading-relaxed font-medium opacity-80">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="relative z-10 py-48 px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
             className="text-center mb-24"
          >
            <h2 className="text-[11px] font-black text-brand uppercase tracking-[0.6em] mb-6">Strategic Authorization</h2>
            <h3 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-text-primary uppercase leading-none">Choose your workspace</h3>
            <p className="text-text-secondary mt-8 font-medium text-lg max-w-2xl mx-auto opacity-60">Select your institutional authority role to continue to the Folowise Roadmap Strategic Matrix.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
            <motion.button 
              whileHover={{ y: -10 }}
              onClick={() => handleLogin("manager")}
              className="group relative p-12 rounded-[4rem] bg-white border border-border-subtle text-left hover:border-brand/40 transition-all shadow-2xl shadow-black/[0.03]"
            >
               <div className="absolute inset-0 bg-brand/[0.01] opacity-0 group-hover:opacity-100 transition-opacity rounded-[4rem]" />
              <div className="w-20 h-20 bg-slate-50 rounded-[2.2rem] flex items-center justify-center mb-10 group-hover:bg-brand/5 group-hover:text-brand transition-all border border-slate-100 group-hover:border-brand/20 shadow-inner relative z-10">
                <ShieldCheck size={40} strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl font-display font-black tracking-tight mb-4 uppercase text-text-primary relative z-10">Strategy Manager</h4>
              <p className="text-base text-text-secondary font-medium leading-relaxed mb-10 opacity-70 relative z-10">
                Manage trainee units, design strategic roadmaps, review structural approvals, and track high-level activity.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-brand group-hover:gap-5 transition-all relative z-10">
                Enter Strategic Workspace <ChevronRight size={18} strokeWidth={3} />
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ y: -10 }}
              onClick={() => handleLogin("trainee")}
              className="group relative p-12 rounded-[4rem] bg-white border border-border-subtle text-left hover:border-brand/40 transition-all shadow-2xl shadow-black/[0.03]"
            >
               <div className="absolute inset-0 bg-brand/[0.01] opacity-0 group-hover:opacity-100 transition-opacity rounded-[4rem]" />
              <div className="w-20 h-20 bg-slate-50 rounded-[2.2rem] flex items-center justify-center mb-10 group-hover:bg-brand/5 group-hover:text-brand transition-all border border-slate-100 group-hover:border-brand/20 shadow-inner relative z-10">
                <User size={40} strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl font-display font-black tracking-tight mb-4 uppercase text-text-primary relative z-10">Unit Trainee</h4>
              <p className="text-base text-text-secondary font-medium leading-relaxed mb-10 opacity-70 relative z-10">
                View your personal strategic matrix, mark progress, and submit structural change requests to your manager.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-brand group-hover:gap-5 transition-all relative z-10">
                Enter Unit Workspace <ChevronRight size={18} strokeWidth={3} />
              </div>
            </motion.button>
          </div>

          <div className="relative text-center">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle opacity-40"></div>
             </div>
             <span className="relative px-10 bg-background-app text-[10px] font-black text-text-tertiary uppercase tracking-[0.5em] opacity-40">Integrated Identity Protocol</span>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8">
             <button className="flex items-center gap-4 px-10 py-5 bg-white border border-border-subtle rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 transition-all text-text-secondary active:scale-95 shadow-xl shadow-black/[0.02]">
                <Chrome size={22} className="text-brand opacity-60" /> Continue with Google Authority
             </button>
             <button className="flex items-center gap-4 px-10 py-5 bg-white border border-border-subtle rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 transition-all text-text-secondary active:scale-95 shadow-xl shadow-black/[0.02]">
                <Github size={22} className="text-text-primary opacity-60" /> Continue with GitHub Matrix
             </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-20 px-8 border-t border-border-subtle bg-slate-50/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 opacity-40">
            <div className="w-8 h-8 bg-text-primary rounded-lg flex items-center justify-center text-white shadow-xl shadow-black/10">
              <Layers size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-text-primary">Folowise Matrix v1.0.4</span>
          </div>
          <div className="flex gap-10">
             {["Strategy", "Protocols", "Intelligence", "Authority"].map(item => (
                <button key={item} className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary hover:text-text-primary transition-colors opacity-40 hover:opacity-100">{item}</button>
             ))}
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary opacity-40">© 2026 Folowise Systems Inc.</p>
        </div>
      </footer>
    </div>
  );
}

