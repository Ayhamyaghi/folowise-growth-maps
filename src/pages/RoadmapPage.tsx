/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  PauseCircle, 
  AlertCircle,
  ArrowLeft,
  Target,
  TrendingUp,
  GitBranch,
  X,
  Library,
  Zap,
  Info,
  ExternalLink,
  MessageSquare,
  Plus,
  Minus,
  Maximize,
  Search,
  Trash2,
  Edit3,
  MoreVertical,
  Settings,
  Layers,
  PlusCircle
} from "lucide-react";
import { mockRoadmap, mockTrainees, TopicStatus, RoadmapTopic } from "../data/mockData";
import { cn } from "../lib/utils";

// --- Components ---

const StatusBadge = ({ status }: { status: TopicStatus }) => {
  const configs = {
    [TopicStatus.Completed]: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
    [TopicStatus.InProgress]: { icon: Clock, color: "text-brand", bg: "bg-brand/5 text-brand", border: "border-brand/20" },
    [TopicStatus.Paused]: { icon: PauseCircle, color: "text-slate-500", bg: "bg-slate-50 text-slate-500", border: "border-slate-200" },
    [TopicStatus.NeedsReview]: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50 text-amber-500", border: "border-amber-200" },
    [TopicStatus.NotStarted]: { icon: Circle, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" },
    [TopicStatus.Skipped]: { icon: Circle, color: "text-slate-300", bg: "bg-slate-50", border: "border-slate-100" },
  };

  const config = configs[status] || configs[TopicStatus.NotStarted];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", config.bg, config.color, config.border)}>
      <Icon size={12} />
      {status}
    </div>
  );
};

const RoadmapNode = ({ 
  topic, 
  onSelect, 
  isSelected,
  isPhase = false 
}: { 
  topic: RoadmapTopic; 
  onSelect: (topic: RoadmapTopic) => void;
  isSelected: boolean;
  isPhase?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className={cn(
        "group cursor-pointer relative transition-all duration-300 select-none",
        isPhase 
          ? "w-[320px] p-8 rounded-[2rem] border-2 shadow-2xl" 
          : "w-[240px] p-5 rounded-2xl border shadow-sm",
        isSelected 
          ? "bg-brand text-white border-brand ring-4 ring-brand/10 z-30" 
          : cn(
            "bg-surface-100 border-surface-200 dark:border-zinc-800 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5",
            isPhase && "bg-surface-200/50 dark:bg-zinc-900 shadow-xl border-surface-200/80 dark:border-zinc-700/50"
          )
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "rounded-full shadow-sm",
          isPhase ? "w-3 h-3" : "w-1.5 h-1.5",
          topic.status === TopicStatus.Completed ? "bg-emerald-500 shadow-emerald-500/20" :
          topic.status === TopicStatus.InProgress ? "bg-brand shadow-brand/20" :
          "bg-slate-200 dark:bg-zinc-800"
        )} />
        <span className={cn(
          "font-bold uppercase tracking-[0.2em] opacity-40",
          isPhase ? "text-[10px]" : "text-[8px]",
          isSelected ? "text-white" : "text-slate-500 dark:text-zinc-500"
        )}>
          {isPhase ? "Roadmap Phase" : "Training Topic"}
        </span>
      </div>

      <h4 className={cn(
        "font-bold leading-tight tracking-tight",
        isPhase ? "text-xl mb-2" : "text-[14px] mb-1.5",
        isSelected ? "text-white" : "text-slate-900 dark:text-zinc-100"
      )}>
        {topic.title}
      </h4>
      
      <div className="flex items-center justify-between mt-4">
        <div className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
          isSelected 
            ? "bg-white/10 text-white" 
            : "bg-surface-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
        )}>
          {topic.status}
        </div>
        {!isSelected && (
          <ChevronRight size={14} className="text-slate-300 group-hover:text-brand transition-all group-hover:translate-x-0.5" />
        )}
      </div>

      {/* Connection points for lines */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-1 h-1 bg-brand opacity-0" id={`node-top-${topic.id}`} />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-1 h-1 bg-brand opacity-0" id={`node-bottom-${topic.id}`} />
    </motion.div>
  );
};

const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }: { zoom: number, onZoomIn: () => void, onZoomOut: () => void, onReset: () => void }) => {
  return (
    <div className="fixed bottom-10 right-10 flex flex-col gap-2 z-[60]">
       <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1">
          <button 
            onClick={onZoomIn}
            className="p-3 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 transition-colors"
            title="Zoom In"
          >
            <Plus size={20} />
          </button>
          <div className="h-px bg-slate-100 dark:bg-zinc-800 mx-2" />
          <button 
            onClick={onZoomOut}
            className="p-3 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 transition-colors"
            title="Zoom Out"
          >
            <Minus size={20} />
          </button>
          <div className="h-px bg-slate-100 dark:bg-zinc-800 mx-2" />
          <button 
            onClick={onReset}
            className="p-3 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 transition-colors"
            title="Reset View"
          >
            <Maximize size={20} />
          </button>
       </div>
       <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 shadow-xl text-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
       </div>
    </div>
  );
}

const DetailPanel = ({ topic, onClose, onEdit, onDelete, onAddSub }: { 
  topic: RoadmapTopic; 
  onClose: () => void;
  onEdit: (topic: RoadmapTopic) => void;
  onDelete: (topic: RoadmapTopic) => void;
  onAddSub: (parent: RoadmapTopic) => void;
}) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface-100 shadow-[0_0_50px_rgba(0,0,0,0.1)] z-[100] border-l border-surface-200 dark:border-zinc-800/80 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-surface-200 dark:border-zinc-800/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-surface-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-xl border border-surface-200 dark:border-zinc-700/50">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">Roadmap Topic Details</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Topic status, structure, and progress overview</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <section>
          <div className="flex items-center justify-between mb-4">
             <StatusBadge status={topic.status} />
             <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">UID: {topic.id}</div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
            {topic.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
            {topic.description || "Comprehensive overview of the specialized module requirements and professional standards expected within this curriculum path."}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-50 dark:bg-zinc-950 border border-surface-200 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Effort Estimation</span>
            <div className="text-lg font-bold text-slate-900 dark:text-zinc-100">
               {topic.estimatedHours || 12} <span className="text-xs font-medium text-slate-400">Hours</span>
            </div>
          </div>
          <div className="bg-surface-50 dark:bg-zinc-950 border border-surface-200 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">State Update</span>
            <div className="text-xs font-bold text-slate-600 dark:text-zinc-300">
               {topic.lastActivity || "Synced 2h ago"}
            </div>
          </div>
        </div>

        {topic.children && topic.children.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-widest">Sub-Modules & Milestones</h3>
            <div className="space-y-2">
              {topic.children.map(child => (
                <div key={child.id} className="group p-3.5 bg-surface-100 dark:bg-zinc-900 rounded-xl border border-surface-200 dark:border-zinc-800 flex items-center justify-between hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-sm",
                      child.status === TopicStatus.Completed ? "bg-emerald-500 shadow-emerald-500/20" : "bg-surface-200"
                    )} />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{child.title}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Structural Actions */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Topic Management</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onEdit(topic)}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-zinc-700 hover:border-brand rounded-xl font-bold text-xs transition-all text-slate-600 dark:text-zinc-300"
            >
              <Edit3 size={14} /> EDIT TOPIC
            </button>
            <button 
              onClick={() => onDelete(topic)}
              className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-zinc-700 hover:border-rose-500 hover:text-rose-500 rounded-xl font-bold text-xs transition-all text-slate-600 dark:text-zinc-300"
            >
              <Trash2 size={14} /> DELETE
            </button>
          </div>
          <button 
            onClick={() => onAddSub(topic)}
            className="flex items-center justify-center gap-2 w-full py-4 border border-brand/20 hover:bg-brand/5 text-brand rounded-xl font-bold text-xs transition-all"
          >
            <PlusCircle size={16} /> ADD SUBTOPIC
          </button>
        </div>

        {/* State Indicators */}
        <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 dark:border-zinc-800">
           <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/10">
                <CheckCircle2 size={16} /> MARK COMPLETE
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                <AlertCircle size={16} /> REQUEST EDIT
              </button>
           </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Curriculum Management Flow</p>
      </div>
    </motion.div>
  );
};

// --- Page Main ---

import { useAuth } from "../App";

export default function RoadmapPage() {
  const { role } = useAuth();
  const { id } = useParams();
  
  // In trainee mode, always show Alex Rivera's roadmap for prototype
  const isTrainee = role === "trainee";
  const activeTraineeId = isTrainee ? "1" : (id === "me" || !id ? "1" : id);
  const trainee = mockTrainees.find(t => t.id === activeTraineeId) || mockTrainees[0];

  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeModal, setActiveModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [modalContext, setModalContext] = useState<RoadmapTopic | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Visual Layout: Main center line with side branches
  const mainPhases = mockRoadmap;

  useEffect(() => {
    if (containerRef.current) {
      // Center the viewport initially
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => {
    setZoomLevel(1);
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  };

  const openActionModal = (type: "add" | "edit" | "delete", topic?: RoadmapTopic) => {
    setModalContext(topic || null);
    setActiveModal(type);
  };

  return (
    <div className="h-screen flex flex-col bg-surface-50 dark:bg-[#09090b] overflow-hidden transition-colors duration-500">
      {/* Top Header */}
      <header className="shrink-0 bg-surface-100 dark:bg-[#0c0c0e] border-b border-surface-200 dark:border-zinc-800/80 px-8 py-4 flex items-center justify-between relative z-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors duration-500">
        <div className="flex items-center gap-6">
          {!isTrainee && (
            <>
              <Link to="/trainees" className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <ArrowLeft size={20} className="text-slate-400" />
              </Link>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-zinc-800" />
            </>
          )}
          <div className="flex items-center gap-4">
             <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-zinc-700 overflow-hidden shadow-sm">
                <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
             </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none uppercase tracking-tight">
                  {isTrainee ? "My Roadmap" : trainee.name}
                </h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] mt-1.5">{trainee.specialization.toUpperCase()} SPECIALIZATION</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Roadmap Progress</span>
                 <span className="text-lg font-bold text-brand leading-none">{trainee.progress}%</span>
              </div>
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trainee.progress}%` }}
                    className="h-full bg-brand"
                 />
              </div>
           </div>
           <button className="px-5 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
              {isTrainee ? "Export Roadmap" : "Export Roadmap Audit"}
           </button>
        </div>
      </header>

      {/* Roadmap Toolbar (Global Actions) */}
      <div className="shrink-0 bg-surface-100 dark:bg-[#121214] border-b border-surface-200 dark:border-zinc-800/80 px-8 py-3 flex items-center justify-between z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openActionModal("add")}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-brand/10"
          >
            <Plus size={16} /> {isTrainee ? "REQUEST ADD" : "ADD NODE"}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-surface-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-300 transition-all shadow-sm"
          >
            <GitBranch size={16} /> {isTrainee ? "REQUEST BRANCH" : "ADD BRANCH"}
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH TOPICS..." 
              className="pl-9 pr-4 py-2 bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-brand/20 outline-none w-64 transition-all shadow-sm"
            />
          </div>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-zinc-800" />
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Roadmap Canvas Area */}
      <main className="flex-1 relative overflow-auto bg-surface-50 dark:bg-[#09090b] custom-scrollbar selection:bg-brand/10 select-none transition-colors duration-500" ref={containerRef}>
        
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
        />
        
        <div 
          className="min-w-fit min-h-fit py-60 px-[1000px] flex flex-col items-center"
          style={{ 
            transform: `scale(${zoomLevel})`, 
            transformOrigin: 'center top',
            transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
        >
            
            {/* Master Root Node (At the top center) */}
            <div className="relative mb-32 z-30">
                <motion.div 
                  initial={{ opacity: 0, s: 0.9, y: 40 }}
                  animate={{ opacity: 1, s: 1, y: 0 }}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-24 py-16 rounded-[3rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.6)] dark:shadow-[0_80px_160px_-40px_rgba(255,255,255,0.15)] flex flex-col items-center min-w-[600px] border border-white/10 dark:border-zinc-200 group cursor-default transition-all duration-700 hover:scale-[1.01]"
                >
                   <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent opacity-50 rounded-[3rem] pointer-events-none" />
                   <span className="relative z-10 text-[12px] font-black tracking-[0.6em] uppercase opacity-40 mb-8 text-center w-full">Training Roadmap</span>
                   <h2 className="relative z-10 text-5xl font-display font-black uppercase tracking-tighter text-center leading-[0.9]">{trainee.specialization}</h2>
                   <div className="relative z-10 mt-10 flex items-center gap-4 px-6 py-2.5 bg-white/5 dark:bg-slate-100 rounded-full border border-white/10 dark:border-slate-200 shadow-2xl backdrop-blur-xl">
                      <div className="w-2.5 h-2.5 bg-brand rounded-full animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">Strategic Alignment Active</span>
                   </div>
                </motion.div>
                
                {/* Visual Connector: The Central Backbone Line */}
                <div className="absolute top-full left-1/2 w-[2px] bg-gradient-to-b from-brand to-brand/20 h-32 -translate-x-1/2 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
            </div>

            {/* Vertical Flow of Main Phases */}
            <div className="relative flex flex-col items-center gap-24 w-full min-w-[1200px]">
              
              {/* The backbone that continues through all phases */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gradient-to-b from-brand/20 via-brand/10 to-brand/20 -translate-x-1/2 -z-10" />

              {mainPhases.map((section, phaseIndex) => {
                // Determine layout clusters for children
                // We want a balanced distribution around the phase node
                const children = section.children || [];
                const midPoint = Math.ceil(children.length / 2);
                const leftCluster = children.slice(0, midPoint);
                const rightCluster = children.slice(midPoint);

                return (
                  <div key={section.id} className="relative flex flex-col items-center w-full">
                    
                    <div className="flex items-center justify-center gap-20 relative py-8">
                      
                      {/* Left Side Cluster */}
                      <div className="flex flex-col items-end gap-5 w-[380px]">
                         {leftCluster.map((child) => (
                           <div key={child.id} className="relative group/node">
                              <RoadmapNode 
                                topic={child} 
                                onSelect={setSelectedTopic}
                                isSelected={selectedTopic?.id === child.id}
                              />
                              {/* Horizontal connector to backbone */}
                              <div className="absolute top-1/2 -right-20 w-20 h-[1px] bg-brand/10 dark:bg-zinc-800 -translate-y-1/2 -z-10 group-hover/node:bg-brand/30 transition-colors" />
                              <div className="absolute top-1/2 -right-[1px] w-2 h-2 rounded-full bg-brand/20 dark:bg-zinc-800 -translate-y-1/2 translate-x-1/2 -z-10" />
                           </div>
                         ))}
                      </div>

                      {/* Central Phase Anchor */}
                      <div className="relative z-20 flex flex-col items-center pt-8">
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-black text-brand tracking-[0.4em] uppercase whitespace-nowrap opacity-50 mb-2">
                           Curriculum Segment 0{phaseIndex + 1}
                         </div>
                         <div className="relative">
                            <RoadmapNode 
                              topic={section} 
                              isPhase 
                              onSelect={setSelectedTopic}
                              isSelected={selectedTopic?.id === section.id}
                            />
                            {/* Visual Glow for Phases */}
                            <div className="absolute inset-0 bg-brand/5 rounded-[2rem] -z-10 blur-3xl opacity-0 group-hover/phase:opacity-100 transition-opacity" />
                         </div>
                      </div>

                      {/* Right Side Cluster */}
                      <div className="flex flex-col items-start gap-5 w-[380px]">
                         {rightCluster.map((child) => (
                           <div key={child.id} className="relative group/node">
                              <RoadmapNode 
                                topic={child} 
                                onSelect={setSelectedTopic}
                                isSelected={selectedTopic?.id === child.id}
                              />
                              {/* Horizontal connector from backbone */}
                              <div className="absolute top-1/2 -left-20 w-20 h-[1px] bg-brand/10 dark:bg-zinc-800 -translate-y-1/2 -z-10 group-hover/node:bg-brand/30 transition-colors" />
                              <div className="absolute top-1/2 -left-[1px] w-2 h-2 rounded-full bg-brand/20 dark:bg-zinc-800 -translate-y-1/2 -translate-x-1/2 -z-10" />
                           </div>
                         ))}
                      </div>

                    </div>

                    {/* Vertical Connector (Backbone Segment) */}
                    {phaseIndex < mainPhases.length - 1 && (
                      <div className="h-20 w-[2px] bg-brand/10 relative my-4">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-brand/20 bg-surface-50 dark:bg-[#09090b] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand/30" />
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
            
            {/* Visual Termination Point */}
            <div className="mt-40 mb-80 flex flex-col items-center">
               <div className="w-[2px] h-20 bg-gradient-to-b from-brand/10 to-transparent" />
               <div className="w-10 h-10 rounded-full border-4 border-brand/5 flex items-center justify-center p-1.5 opacity-40">
                  <div className="w-full h-full rounded-full bg-brand/20 scale-pulse" />
               </div>
               <span className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-zinc-600">Evolution Path End</span>
            </div>
        </div>
      </main>

      {/* Zoom Controls */}
      <ZoomControls 
        zoom={zoomLevel} 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onReset={handleReset} 
      />

      {/* Interaction Tips */}
      <div className="fixed bottom-10 left-10 hidden md:flex items-center gap-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/50 px-5 py-3 rounded-2xl z-40">
        <div className="flex items-center gap-2">
           <Zap size={14} className="text-brand" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hold Space + Drag to Pan</span>
        </div>
        <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-2">
           <Info size={14} className="text-slate-400" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Click nodes for module intelligence</span>
        </div>
      </div>

      {/* Detail Panel Sidebar */}
      <AnimatePresence>
        {selectedTopic && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedTopic(null)}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]"
             />
             <DetailPanel 
               topic={selectedTopic} 
               onClose={() => setSelectedTopic(null)} 
               onEdit={(t) => openActionModal("edit", t)}
               onDelete={(t) => openActionModal("delete", t)}
               onAddSub={(t) => openActionModal("add", t)}
             />
          </>
        )}
      </AnimatePresence>

      {/* Action Modals (Mocks) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-slate-200 dark:border-zinc-800"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/10 text-brand rounded-2xl">
                    {activeModal === "add" ? <Plus size={24} /> : activeModal === "edit" ? <Edit3 size={24} /> : <Trash2 size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">
                      {activeModal === "delete" ? "Confirm Deletion" : activeModal === "edit" ? "Edit Roadmap Topic" : "Add Training Topic"}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {activeModal === "delete" ? "Irreversible Structural Change" : "Roadmap Synchronization"}
                    </p>
                  </div>
                </div>

                {activeModal === "delete" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                      Are you sure you want to remove <span className="font-bold text-slate-900 dark:text-zinc-100">{modalContext?.title}</span> from the roadmap? This will also remove any associated sub-topics and milestones.
                    </p>
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-sm rounded-2xl"
                      >
                        CANCEL
                      </button>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-500/20"
                      >
                        CONFIRM DELETE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Topic Title</label>
                      <input 
                        type="text" 
                        defaultValue={activeModal === "edit" ? modalContext?.title : ""}
                        placeholder="e.g. Advanced System Design"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Complexity / Description</label>
                       <textarea 
                        defaultValue={activeModal === "edit" ? modalContext?.description : ""}
                        placeholder="Describe the learning outcomes and professional scope..."
                        rows={3}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20 resize-none"
                       />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 border border-slate-200 dark:border-zinc-800 text-slate-500 font-bold text-sm rounded-2xl"
                      >
                        ABORT
                      </button>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 bg-brand text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand/20"
                      >
                        {activeModal === "edit" ? "SAVE CHANGES" : "ADD TO ROADMAP"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
