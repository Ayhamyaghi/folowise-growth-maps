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
  PlusCircle,
  List,
  Network,
  Youtube,
  FileText,
  Link as LinkIcon,
  Github,
  BookOpen,
  Copy,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { mockRoadmap, mockTrainees, TopicStatus, RoadmapTopic, ResourceType, Resource } from "../data/mockData";
import { cn } from "../lib/utils";

type ViewMode = "tree" | "list";

// --- Components ---

const StatusBadge = ({ status }: { status: TopicStatus }) => {
  const configs = {
    [TopicStatus.Completed]: { icon: CheckCircle2, color: "text-status-success", bg: "bg-status-success/5", border: "border-status-success/20" },
    [TopicStatus.InProgress]: { icon: Clock, color: "text-brand", bg: "bg-brand/5", border: "border-brand/20" },
    [TopicStatus.Paused]: { icon: PauseCircle, color: "text-text-secondary", bg: "bg-surface-soft", border: "border-border-subtle" },
    [TopicStatus.NeedsReview]: { icon: AlertCircle, color: "text-status-pending", bg: "bg-status-pending/5", border: "border-status-pending/20" },
    [TopicStatus.NotStarted]: { icon: Circle, color: "text-text-tertiary", bg: "bg-surface-soft", border: "border-border-subtle" },
    [TopicStatus.Skipped]: { icon: Circle, color: "text-text-tertiary", bg: "bg-surface-soft", border: "border-border-subtle" },
  };

  const config = configs[status] || configs[TopicStatus.NotStarted];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", config.bg, config.color, config.border)}>
      <Icon size={10} strokeWidth={3} />
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
  const isRoot = topic.id === "root";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className={cn(
        "group cursor-pointer relative transition-all duration-500 select-none",
        isPhase 
          ? "w-[280px] p-6 rounded-[2rem] border-2 shadow-card" 
          : "w-[220px] p-5 rounded-[1.5rem] border shadow-sm",
        isSelected 
          ? "bg-brand text-white border-brand ring-4 ring-brand/5 z-30 shadow-elevated" 
          : isRoot
          ? "bg-text-primary text-white border-text-primary shadow-elevated"
          : cn(
            "bg-white border-border-subtle hover:border-brand/40 hover:shadow-elevated",
            isPhase && "bg-surface-card shadow-card border-border-standard"
          )
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "rounded-full shadow-sm",
          isPhase ? "w-3 h-3" : "w-2 h-2",
          topic.status === TopicStatus.Completed ? "bg-status-success shadow-status-success/40 ring-4 ring-status-success/10" :
          topic.status === TopicStatus.InProgress ? "bg-brand shadow-brand/40 ring-4 ring-brand/10" :
          "bg-border-standard"
        )} />
        <span className={cn(
          "font-black uppercase tracking-[0.25em] whitespace-nowrap",
          isPhase ? "text-[9px]" : "text-[7px]",
          (isSelected || isRoot) ? "opacity-60 text-white" : "opacity-40 text-text-tertiary"
        )}>
          {isRoot ? "Architecture" : isPhase ? "Phase" : "Module"}
        </span>
      </div>

      <h4 className={cn(
        "font-display font-black leading-tight tracking-tight",
        isPhase ? "text-xl mb-2" : "text-[15px] mb-1.5",
        (isSelected || isRoot) ? "text-white" : "text-text-primary"
      )}>
        {topic.title}
      </h4>
      
      <div className="flex items-center justify-between mt-4">
        <div className={cn(
          "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg shadow-sm border transition-all",
          (isSelected || isRoot) 
            ? "bg-white/20 text-white border-white/20" 
            : cn(
               "bg-surface-soft group-hover:bg-white",
               topic.status === TopicStatus.Completed ? "text-status-success border-status-success/20" :
               topic.status === TopicStatus.InProgress ? "text-brand border-brand/20" :
               "text-text-tertiary border-border-subtle"
            )
        )}>
          {topic.status}
        </div>
        {!(isSelected || isRoot) && (
          <div className="p-1.5 bg-surface-soft rounded-lg opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
             <ChevronRight size={12} className="text-brand" strokeWidth={3} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TreeBranch = ({ topic, onSelect, selectedId, depth = 0 }: { 
  topic: RoadmapTopic; 
  onSelect: (t: RoadmapTopic) => void; 
  selectedId?: string;
  depth?: number;
}) => {
  const isSelected = selectedId === topic.id;
  const hasChildren = topic.children && topic.children.length > 0;
  const isRoot = topic.id === "root";

  return (
    <div className="flex flex-col items-center relative">
      <RoadmapNode 
        topic={topic} 
        onSelect={onSelect} 
        isSelected={isSelected}
        isPhase={isRoot || depth === 1}
      />
      
      {hasChildren && (
        <div className="flex gap-16 pt-32 relative">
          {/* Vertical line down from current node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-32 bg-border-standard" />
          
          {topic.children!.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === (topic.children?.length || 0) - 1;
            const isOnly = topic.children?.length === 1;
            
            return (
              <div key={child.id} className="relative pt-16">
                {/* Horizontal connector shoulder */}
                {!isOnly && (
                  <div className={cn(
                    "absolute top-0 h-[3px] bg-border-standard",
                    isFirst ? "left-1/2 right-0" : isLast ? "left-0 right-1/2" : "left-0 right-0"
                  )} />
                )}
                {/* Visual stub to connect to the node above */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-16 bg-border-standard" />
                <TreeBranch 
                  topic={child} 
                  onSelect={onSelect} 
                  selectedId={selectedId} 
                  depth={depth + 1}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ZoomControls = ({ zoom, onZoomIn, onZoomOut, onReset }: { zoom: number, onZoomIn: () => void, onZoomOut: () => void, onReset: () => void }) => {
  return (
    <div className="fixed bottom-10 right-10 flex flex-col gap-3 z-[60]">
       <div className="bg-white border-2 border-border-standard rounded-3xl p-2 shadow-elevated flex flex-col gap-1 backdrop-blur-xl">
          <button 
            onClick={onZoomIn}
            className="p-3.5 hover:bg-surface-soft rounded-2xl text-text-secondary hover:text-brand transition-all active:scale-90"
            title="Zoom In"
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
          <div className="h-px bg-border-subtle mx-2" />
          <button 
            onClick={onZoomOut}
            className="p-3.5 hover:bg-surface-soft rounded-2xl text-text-secondary hover:text-brand transition-all active:scale-90"
            title="Zoom Out"
          >
            <Minus size={22} strokeWidth={2.5} />
          </button>
          <div className="h-px bg-border-subtle mx-2" />
          <button 
            onClick={onReset}
            className="p-3.5 hover:bg-surface-soft rounded-2xl text-text-secondary hover:text-brand transition-all active:scale-90"
            title="Reset View"
          >
            <Maximize size={22} strokeWidth={2.5} />
          </button>
       </div>
       <div className="bg-text-primary text-white rounded-2xl py-2 px-4 shadow-elevated text-center ring-4 ring-text-primary/10">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{Math.round(zoom * 100)}%</span>
       </div>
    </div>
  );
}

const ResourceIcon = ({ type }: { type: ResourceType }) => {
  switch (type) {
    case ResourceType.YouTube: return <Youtube size={14} />;
    case ResourceType.Article: return <FileText size={14} />;
    case ResourceType.Documentation: return <BookOpen size={14} />;
    case ResourceType.GitHub: return <Github size={14} />;
    case ResourceType.Course: return <Zap size={14} />;
    default: return <LinkIcon size={14} />;
  }
};

const ViewSwitcher = ({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) => {
  return (
    <div className="flex bg-surface-soft p-1 rounded-xl border border-border-standard shadow-sm backdrop-blur-md">
      <button 
        onClick={() => onChange("tree")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300",
          mode === "tree" ? "bg-white text-brand shadow-sm" : "text-text-tertiary hover:text-text-secondary"
        )}
      >
        <Network size={14} strokeWidth={2.5} /> Tree View
      </button>
      <button 
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300",
          mode === "list" ? "bg-white text-brand shadow-sm" : "text-text-tertiary hover:text-text-secondary"
        )}
      >
        <List size={14} strokeWidth={2.5} /> List View
      </button>
    </div>
  );
};

const ListViewRow = ({ 
  topic, 
  depth = 0, 
  onSelect, 
  selectedId 
}: { 
  topic: RoadmapTopic; 
  depth?: number; 
  onSelect: (topic: RoadmapTopic) => void;
  selectedId?: string;
  key?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = topic.children && topic.children.length > 0;
  const isSelected = selectedId === topic.id;

  return (
    <div className="flex flex-col">
      <motion.div 
        layout
        onClick={() => onSelect(topic)}
        className={cn(
          "group flex items-center gap-6 py-5 px-6 rounded-[2rem] transition-all cursor-pointer border-2",
          isSelected ? "bg-brand/5 border-brand/20 shadow-sm" : "border-transparent hover:bg-surface-soft hover:border-border-subtle"
        )}
        style={{ marginLeft: `${depth * 32}px` }}
      >
        <div className="flex items-center gap-5 min-w-[280px]">
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1.5 hover:bg-white rounded-lg transition-all text-brand shadow-sm border border-transparent hover:border-border-subtle"
            >
              <ChevronDown size={18} strokeWidth={3} className={cn("transition-transform duration-500", !isExpanded && "-rotate-90")} />
            </button>
          ) : (
            <div className="w-8" />
          )}
          <div className={cn(
            "w-3 h-3 rounded-full ring-4 ring-opacity-20 transition-all",
            topic.status === TopicStatus.Completed ? "bg-status-success ring-status-success" : 
            topic.status === TopicStatus.InProgress ? "bg-brand ring-brand" : "bg-border-standard ring-transparent"
          )} />
          <h4 className={cn(
            "text-[15px] font-black tracking-tight transition-all",
            topic.status === TopicStatus.Completed ? "text-text-tertiary line-through decoration-text-tertiary/40" : "text-text-primary",
            depth === 0 && "text-lg uppercase"
          )}>
            {topic.title}
          </h4>
        </div>

        <div className="flex-1 h-[2px] bg-border-subtle opacity-10 mx-6" />

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
            <Clock size={14} className="text-text-tertiary" />
            <span className="text-[11px] font-black text-text-tertiary uppercase tracking-widest">{topic.estimatedHours || 0}H</span>
          </div>
          <StatusBadge status={topic.status} />
          <div className={cn(
            "p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100",
            isSelected ? "bg-brand text-white opacity-100 shadow-lg shadow-brand/30" : "bg-surface-soft text-text-tertiary"
          )}>
            <ChevronRight size={16} strokeWidth={3} className={cn("transition-transform", isSelected && "translate-x-0.5")} />
          </div>
        </div>
      </motion.div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col mt-2">
          {topic.children?.map(child => (
            <ListViewRow 
              key={child.id} 
              topic={child} 
              depth={depth + 1} 
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
const DetailPanel = ({ 
  topic, 
  onClose, 
  onEdit, 
  onDelete, 
  onAddSub,
  onMove,
  onCopy,
  onAddResource,
  role 
}: { 
  topic: RoadmapTopic; 
  onClose: () => void;
  onEdit: (topic: RoadmapTopic) => void;
  onDelete: (topic: RoadmapTopic) => void;
  onAddSub: (parent: RoadmapTopic) => void;
  onMove: (topic: RoadmapTopic) => void;
  onCopy: (topic: RoadmapTopic) => void;
  onAddResource: (topic: RoadmapTopic) => void;
  role: string;
}) => {
  const isManager = role === "manager";

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-card shadow-elevated z-[100] border-l border-border-subtle flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-standard flex items-center justify-between bg-white relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-brand/5 text-brand rounded-xl border-2 border-brand/10 shadow-sm">
            <Layers size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-text-primary uppercase leading-none">Module IQ</h3>
            <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1.5 mb-0 opacity-60">Architectural Context</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 hover:bg-surface-soft rounded-xl text-text-tertiary hover:text-text-primary transition-all active:scale-90"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
        <section className="relative">
          <div className="flex items-center justify-between mb-4">
             <StatusBadge status={topic.status} />
             {topic.parentId && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-surface-soft rounded-lg border border-border-subtle">
                  <GitBranch size={10} className="text-brand" />
                  <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{topic.parentId}</span>
                </div>
             )}
          </div>
          <h2 className="text-2xl font-display font-black text-text-primary leading-none tracking-tight mb-4">
            {topic.title}
          </h2>
          <div className="p-5 bg-surface-soft rounded-2xl border border-border-standard relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Info size={32} />
             </div>
             <p className="text-sm font-medium text-text-secondary leading-relaxed relative z-10">
               {topic.description || "No strategic objectives defined for this module yet."}
             </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-border-standard p-4 rounded-2xl shadow-sm hover:shadow-card transition-all">
            <div className="flex items-center gap-1.5 mb-2">
               <Clock size={12} className="text-brand" />
               <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">Curriculum Effort</span>
            </div>
            <div className="text-xl font-display font-black text-text-primary">
               {topic.estimatedHours || 0} <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-0.5">Hrs</span>
            </div>
          </div>
          <div className="bg-white border border-border-standard p-4 rounded-2xl shadow-sm hover:shadow-card transition-all">
            <div className="flex items-center gap-1.5 mb-2">
               <Target size={12} className="text-status-success" />
               <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">Latest Sync</span>
            </div>
            <div className="text-[11px] font-black text-text-secondary uppercase tracking-widest">
               {topic.lastActivity || "System Defined"}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Library size={14} className="text-brand" />
               <h3 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Resources</h3>
            </div>
            <button 
              onClick={() => onAddResource(topic)}
              className="px-3 py-1.5 bg-brand/5 text-brand text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-brand/10 transition-all border border-brand/10"
            >
              + Add Resource
            </button>
          </div>
          <div className="space-y-2">
            {topic.resources && topic.resources.length > 0 ? (
              topic.resources.map(res => (
                <a 
                  key={res.id} 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col p-4 bg-white rounded-2xl border border-border-standard hover:border-brand/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-brand">
                      <div className="p-2 bg-brand/5 rounded-lg group-hover:bg-brand group-hover:text-white transition-all">
                        <ResourceIcon type={res.type} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight">{res.title}</span>
                    </div>
                    <ExternalLink size={12} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border-subtle/40">
                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">By {res.addedBy}</span>
                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{res.addedDate}</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="p-8 border border-dashed border-border-standard rounded-2xl flex flex-col items-center justify-center text-center bg-surface-soft/30">
                 <div className="p-3 bg-white rounded-2xl shadow-sm border border-border-subtle mb-3 opacity-40">
                    <Library size={24} strokeWidth={1.5} className="text-text-tertiary" />
                 </div>
                 <p className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">No resources defined</p>
              </div>
            )}
          </div>
        </section>

        {/* Management Matrix */}
        <div className="pt-8 border-t border-border-standard space-y-4">
          <div className="flex items-center gap-2">
             <Settings size={14} className="text-text-tertiary" />
             <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Execution Matrix</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onEdit(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-standard hover:border-brand hover:bg-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all text-text-secondary hover:text-brand active:scale-95 shadow-sm"
            >
              <Edit3 size={14} /> {isManager ? "EDIT" : "PROPOSE EDIT"}
            </button>
            <button 
              onClick={() => onDelete(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-standard hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all text-text-secondary active:scale-95 shadow-sm"
            >
              <Trash2 size={14} /> {isManager ? "DELETE" : "PROPOSE DEL"}
            </button>
            <button 
              onClick={() => onMove(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-standard hover:border-brand hover:bg-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all text-text-secondary hover:text-brand active:scale-95 shadow-sm"
            >
              <GitBranch size={14} /> {isManager ? "RE-PARENT" : "PROPOSE MOVE"}
            </button>
            <button 
              onClick={() => onCopy(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-standard hover:border-brand hover:bg-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all text-text-secondary hover:text-brand active:scale-95 shadow-sm"
            >
              <Copy size={14} /> {isManager ? "REPLICATE" : "COPY"}
            </button>
          </div>
          <button 
            onClick={() => onAddSub(topic)}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand/5 border border-brand/20 hover:bg-brand/10 text-brand rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-98 shadow-sm"
          >
            <PlusCircle size={18} strokeWidth={3} /> {isManager ? "ATTACH CHILD MODULE" : "PROPOSE CHILD"}
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-border-standard flex flex-col gap-4 z-20">
         <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-4 bg-brand text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand/30 hover:brightness-110 active:scale-95 transition-all">
              <CheckCircle2 size={18} strokeWidth={3} /> {isManager ? "SYNC" : "COMPLETE"}
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-surface-soft text-text-secondary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white border border-transparent hover:border-border-subtle transition-all active:scale-95 shadow-sm">
              <MessageSquare size={18} strokeWidth={2.5} /> FEEDBACK
            </button>
         </div>
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
  const activeTraineeId = isTrainee ? "t1" : (id === "me" || !id ? "t1" : id);
  const trainee = mockTrainees.find(t => t.id === activeTraineeId) || mockTrainees[0];

  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeModal, setActiveModal] = useState<"add" | "edit" | "delete" | "move" | "copy" | "resource" | null>(null);
  const [modalContext, setModalContext] = useState<RoadmapTopic | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Visual Layout: Recursive Tree rendering
  const virtualRoot: RoadmapTopic = {
    id: "root",
    title: "AI Engineering Roadmap",
    status: TopicStatus.Completed,
    isCountable: false,
    description: "The global strategic path for AI Engineering excellence.",
    children: mockRoadmap
  };

  const flattenTopics = (topics: RoadmapTopic[]): RoadmapTopic[] => {
    let result: RoadmapTopic[] = [];
    topics.forEach(topic => {
      result.push(topic);
      if (topic.children) {
        result = result.concat(flattenTopics(topic.children));
      }
    });
    return result;
  };

  const allTopics = [virtualRoot, ...flattenTopics(mockRoadmap)];

  const getBreadcrumbs = (topicId: string): string => {
    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return "Root";
    if (topic.id === "root") return "All Modules";
    
    // Simple parent lookup if mock data doesn't have parentId
    const findParent = (current: RoadmapTopic, targetId: string): RoadmapTopic | null => {
      if (current.children?.some(c => c.id === targetId)) return current;
      for (const child of (current.children || [])) {
        const p = findParent(child, targetId);
        if (p) return p;
      }
      return null;
    };

    const parent = findParent(virtualRoot, topic.id);
    if (!parent) return topic.title;
    return `${getBreadcrumbs(parent.id)} > ${topic.title}`;
  };

  const getFilteredNodes = (excludeId?: string) => {
    if (!excludeId) return allTopics;
    // Filter out the node itself and its descendants to prevent circular loops
    const descendants = flattenTopics([allTopics.find(t => t.id === excludeId)!]).map(d => d.id);
    return allTopics.filter(t => t.id !== excludeId && !descendants.includes(t.id));
  };

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

  const openActionModal = (type: "add" | "edit" | "delete" | "move" | "copy" | "resource", topic?: RoadmapTopic) => {
    setModalContext(topic || null);
    setActiveModal(type);
  };

  return (
    <div className="h-screen flex flex-col bg-background-app overflow-hidden transition-colors duration-500">
      {/* Top Header */}
      <header className="shrink-0 bg-white border-b border-border-subtle px-8 py-4 flex items-center justify-between relative z-50 shadow-sm transition-all">
        <div className="flex items-center gap-6">
          {!isTrainee && (
            <>
              <Link to="/trainees" className="p-2.5 hover:bg-surface-soft rounded-xl border border-transparent hover:border-border-subtle transition-all text-text-tertiary shadow-sm active:scale-90">
                <ArrowLeft size={20} strokeWidth={3} />
              </Link>
              <div className="h-8 w-[1px] bg-border-standard opacity-50" />
            </>
          )}
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl p-0.5 bg-white border border-border-standard shadow-lg ring-4 ring-brand/5">
                <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover rounded-[0.55rem]" />
             </div>
              <div className="space-y-0.5">
                <h1 className="text-lg font-display font-black text-text-primary leading-tight uppercase tracking-tight">
                   {isTrainee ? "Strategic Roadmap" : trainee.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-sm shadow-brand" />
                  <p className="text-[9px] font-black text-brand tracking-[0.3em] uppercase opacity-70">{trainee.specialization}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.3em] opacity-60">Mastery</span>
                 <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-display font-black text-text-primary leading-none tracking-tighter">{trainee.progress}</span>
                   <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">%</span>
                 </div>
              </div>
              <div className="w-32 h-2.5 bg-surface-soft rounded-full overflow-hidden border border-border-standard shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trainee.progress}%` }}
                    className="h-full bg-brand rounded-full shadow-md shadow-brand/40"
                 />
              </div>
           </div>
           <button className="px-6 py-3 bg-brand text-white rounded-xl text-[10px] font-black tracking-[0.25em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
              {isTrainee ? "EXPORT" : "AUDIT"}
           </button>
        </div>
      </header>

      {/* Roadmap Toolbar (Global Actions) */}
      <div className="shrink-0 bg-surface-soft/40 backdrop-blur-xl border-b border-border-subtle px-8 py-3 flex items-center justify-between z-40 relative shadow-sm">
        <div className="flex items-center gap-6">
          <ViewSwitcher mode={viewMode} onChange={setViewMode} />
          <div className="h-8 w-[1px] bg-border-standard opacity-40 mx-1" />
          <button 
            onClick={() => openActionModal("add", virtualRoot)}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-brand-hover transition-all shadow-lg shadow-brand/10 active:scale-95"
          >
            <PlusCircle size={16} strokeWidth={3} /> {isTrainee ? "ADD" : "ARCHITECT"}
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-all" size={16} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              className="pl-10 pr-6 py-2.5 bg-white border border-border-standard rounded-xl text-[11px] font-black uppercase tracking-[0.2em] outline-none w-64 transition-all shadow-sm focus:border-brand/40"
            />
          </div>
          <div className="h-8 w-[1px] bg-border-standard opacity-40 mx-1" />
          <button className="p-2.5 bg-white hover:bg-surface-soft rounded-xl text-text-tertiary transition-all border border-border-standard shadow-sm active:scale-90">
            <Settings size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Roadmap Canvas Area */}
      <main className="flex-1 relative overflow-auto bg-background-app custom-scrollbar selection:bg-brand/10 select-none transition-colors duration-500" ref={containerRef}>
        
        <AnimatePresence mode="wait">
          {viewMode === "tree" ? (
            <motion.div 
              key="tree"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="absolute inset-0"
            >
              {/* Background Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
                style={{ backgroundImage: 'radial-gradient(circle, #5B57F5 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
              />
              
              <div 
                className="min-w-fit min-h-fit py-60 px-[2000px] flex flex-col items-center"
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transformOrigin: 'center top',
                  transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
              >
                  <TreeBranch 
                    topic={virtualRoot} 
                    onSelect={setSelectedTopic} 
                    selectedId={selectedTopic?.id} 
                    depth={0} 
                  />
                  
                  <div className="mt-40 mb-80 flex flex-col items-center">
                     <div className="w-[2px] h-20 bg-gradient-to-b from-brand/10 to-transparent" />
                     <div className="w-10 h-10 rounded-full border-4 border-brand/5 flex items-center justify-center p-1.5 opacity-40">
                        <div className="w-full h-full rounded-full bg-brand/20 scale-pulse" />
                     </div>
                     <span className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Evolution Path End</span>
                  </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto p-12 py-20"
            >
              <div className="mb-12">
                <h2 className="text-3xl font-display font-black text-text-primary uppercase tracking-tight mb-2">Curriculum Checklist</h2>
                <p className="text-text-tertiary text-sm font-bold uppercase tracking-widest">Global hierarchical view of all training modules</p>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-border-subtle shadow-card overflow-hidden">
                <div className="p-10 space-y-2">
                  <ListViewRow 
                    topic={virtualRoot} 
                    onSelect={setSelectedTopic} 
                    selectedId={selectedTopic?.id}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Zoom Controls */}
      <ZoomControls 
        zoom={zoomLevel} 
        onZoomIn={handleZoomIn} 
        onZoomOut={handleZoomOut} 
        onReset={handleReset} 
      />

      {/* Interaction Tips */}
      <div className="fixed bottom-10 left-10 hidden md:flex items-center gap-6 bg-white/60 backdrop-blur-md border border-border-subtle px-5 py-3 rounded-2xl z-40 shadow-control">
        <div className="flex items-center gap-2">
           <Zap size={14} className="text-brand" />
           <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Hold Space + Drag to Pan</span>
        </div>
        <div className="w-px h-4 bg-border-standard" />
        <div className="flex items-center gap-2">
           <Info size={14} className="text-text-tertiary" />
           <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Click nodes for module intelligence</span>
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
               role={role || "trainee"}
               onClose={() => setSelectedTopic(null)} 
               onEdit={(t) => openActionModal("edit", t)}
               onDelete={(t) => openActionModal("delete", t)}
               onAddSub={(t) => openActionModal("add", t)}
               onMove={(t) => openActionModal("move", t)}
               onCopy={(t) => openActionModal("copy", t)}
               onAddResource={(t) => openActionModal("resource", t)}
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
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden border-4 border-border-standard"
            >
              <div className="p-12">
                <div className="flex items-center gap-6 mb-10">
                  <div className="p-4 bg-brand/5 text-brand rounded-[1.5rem] border-2 border-brand/10 shadow-sm">
                    {activeModal === "add" ? <PlusCircle size={32} strokeWidth={2.5} /> : 
                     activeModal === "edit" ? <Edit3 size={32} strokeWidth={2.5} /> : 
                     activeModal === "delete" ? <Trash2 size={32} strokeWidth={2.5} /> :
                     activeModal === "move" ? <GitBranch size={32} strokeWidth={2.5} /> :
                     activeModal === "copy" ? <Copy size={32} strokeWidth={2.5} /> :
                     <Library size={32} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black tracking-tight text-text-primary uppercase leading-tight">
                      {activeModal === "delete" ? "Security Protocol" : 
                       activeModal === "edit" ? "Modify Node" : 
                       activeModal === "move" ? "Migration Orchestration" :
                       activeModal === "copy" ? "Pattern Replication" :
                       activeModal === "resource" ? "Knowledge Asset" :
                       "Architect Node"}
                    </h3>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-2 opacity-60">
                      {activeModal === "delete" ? "Irreversible curriculum erasure" : "Curriculum Synchronization Service"}
                    </p>
                  </div>
                </div>

                {activeModal === "delete" ? (
                  <div className="space-y-8">
                    <div className="p-8 bg-rose-50 rounded-[2rem] border-2 border-rose-100/50 shadow-inner">
                      <p className="text-[15px] font-medium text-rose-900 leading-relaxed">
                        Are you sure you want to remove <span className="font-bold underline">{modalContext?.title}</span>?
                      </p>
                      <p className="text-[11px] font-black text-rose-700/60 uppercase tracking-widest mt-4">
                        DANGER: Erases node and {modalContext?.children?.length || 0} sub-modules permanently.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-5 bg-surface-soft text-text-secondary font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] border-2 border-border-standard hover:bg-white transition-all active:scale-95 shadow-sm"
                      >
                        CLOSE
                      </button>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-5 bg-rose-500 text-white font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-rose-500/30 hover:brightness-110 active:scale-95 transition-all border-b-4 border-rose-600"
                      >
                        EXECUTE DELETE
                      </button>
                    </div>
                  </div>
                ) : activeModal === "move" ? (
                  <div className="space-y-8">
                    <p className="text-[13px] font-medium text-text-secondary leading-relaxed">
                      Select a strategic destination for <span className="font-bold text-text-primary">"{modalContext?.title}"</span>. Child nodes and metadata will remain intact.
                    </p>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Origin Context</label>
                        <div className="p-5 bg-surface-soft border-2 border-border-standard rounded-[1.25rem] text-[11px] font-black text-text-tertiary truncate uppercase tracking-widest opacity-60">
                          {getBreadcrumbs(modalContext?.id || "")}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Target Parent Module</label>
                        <div className="relative group">
                           <select className="w-full appearance-none px-6 py-5 bg-white border-2 border-border-standard rounded-[1.5rem] text-sm font-black text-text-primary outline-none focus:ring-8 focus:ring-brand/[0.04] focus:border-brand/40 transition-all pr-14 shadow-sm group-hover:border-border-subtle cursor-pointer">
                              {getFilteredNodes(modalContext?.id).map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                           </select>
                           <ChevronDown size={20} strokeWidth={3} className="absolute right-6 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-brand" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-5 bg-surface-soft text-text-secondary font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] border-2 border-border-standard shadow-sm active:scale-95 transition-all hover:bg-white">CANCEL</button>
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-5 bg-brand text-white font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-brand/30 border-b-4 border-brand-hover active:scale-95 transition-all">MIGRATE NODE</button>
                    </div>
                  </div>
                ) : activeModal === "resource" ? (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Identifier</label>
                        <input type="text" placeholder="Title of the asset..." className="w-full px-6 py-5 bg-surface-soft border-2 border-border-standard rounded-[1.5rem] text-sm font-black outline-none focus:ring-8 focus:ring-brand/[0.04] focus:border-brand/40 transition-all focus:bg-white shadow-sm" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Asset Category</label>
                        <div className="grid grid-cols-2 gap-3">
                           {Object.values(ResourceType).map(type => (
                             <button key={type} className="px-5 py-4 bg-surface-soft border-2 border-border-standard rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest text-text-secondary hover:border-brand hover:text-brand transition-all shadow-sm active:scale-95">{type}</button>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Strategic URL</label>
                        <div className="relative group">
                          <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                          <input type="text" placeholder="https://external-asset.io/..." className="w-full pl-14 pr-6 py-5 bg-surface-soft border-2 border-border-standard rounded-[1.5rem] text-sm font-medium outline-none focus:ring-8 focus:ring-brand/[0.04] focus:border-brand/40 transition-all focus:bg-white shadow-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-5 bg-surface-soft text-text-secondary font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] border-2 border-border-standard shadow-sm active:scale-95 transition-all animate-pulse">ABORT</button>
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-5 bg-brand text-white font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-brand/30 border-b-4 border-brand-hover active:scale-95 transition-all">LINK KNOWLEDGE</button>
                    </div>
                  </div>
                ) : activeModal === "copy" ? (
                   <div className="space-y-8">
                      <p className="text-[13px] font-medium text-text-secondary leading-relaxed">
                        Replicating strategic pattern: <span className="font-bold text-text-primary">"{modalContext?.title}"</span>. This will instantiate a new branch context with inherited sub-structures.
                      </p>
                      <div className="p-6 bg-brand/5 border-2 border-brand/10 rounded-[1.75rem] shadow-sm">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-brand text-white rounded-lg">
                               <Copy size={16} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">Ready for replication</span>
                         </div>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setActiveModal(null)} className="flex-1 py-5 bg-surface-soft text-text-secondary font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] border-2 border-border-standard shadow-sm hover:bg-white active:scale-95 transition-all">ABORT</button>
                        <button onClick={() => setActiveModal(null)} className="flex-1 py-5 bg-brand text-white font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-brand/30 border-b-4 border-brand-hover active:scale-95 transition-all">REPLICATE BRANCH</button>
                      </div>
                   </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Module Title</label>
                        <input 
                          type="text" 
                          defaultValue={activeModal === "edit" ? modalContext?.title : ""}
                          placeholder="e.g. Distributed Consensus Systems"
                          className="w-full px-7 py-5 bg-surface-soft border-2 border-border-standard rounded-[1.75rem] text-[15px] font-black text-text-primary outline-none focus:ring-8 focus:ring-brand/[0.04] focus:border-brand/40 transition-all shadow-sm focus:bg-white"
                        />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Architectural Rationale</label>
                         <textarea 
                          defaultValue={activeModal === "edit" ? modalContext?.description : ""}
                          placeholder="Define the strategic objectives for this phase..."
                          rows={4}
                          className="w-full px-7 py-5 bg-surface-soft border-2 border-border-standard rounded-[1.75rem] text-sm font-medium text-text-secondary outline-none focus:ring-8 focus:ring-brand/[0.04] focus:border-brand/40 transition-all shadow-sm resize-none focus:bg-white"
                         />
                      </div>
                      {activeModal === "add" && (
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em] ml-1">Anchor Context</label>
                            <div className="relative group">
                               <select 
                                 defaultValue={modalContext?.id}
                                 className="w-full appearance-none px-7 py-5 bg-white border-2 border-border-standard rounded-[1.75rem] text-sm font-black text-brand outline-none focus:ring-8 focus:ring-brand/[0.04] focus:border-brand/40 transition-all pr-14 shadow-sm group-hover:border-border-subtle cursor-pointer"
                               >
                                  {allTopics.map(t => (
                                     <option key={t.id} value={t.id}>{t.title}</option>
                                  ))}
                               </select>
                               <ChevronDown size={20} strokeWidth={3} className="absolute right-7 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-brand" />
                            </div>
                         </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-5 bg-surface-soft text-text-secondary font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] border-2 border-border-standard shadow-sm hover:bg-white active:scale-95 transition-all"
                      >
                        ABORT
                      </button>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-5 bg-brand text-white font-black text-[11px] uppercase tracking-widest rounded-[1.5rem] shadow-xl shadow-brand/30 border-b-4 border-brand-hover active:scale-95 transition-all"
                      >
                        {activeModal === "edit" ? (role === "manager" ? "SAVE CHANGES" : "PROPOSE CHANGES") : (role === "manager" ? "COMMIT TO PATH" : "SUBMIT PROPOSAL")}
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
