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
    [TopicStatus.Completed]: { icon: CheckCircle2, color: "text-status-success", bg: "bg-bg-success", border: "border-border-subtle" },
    [TopicStatus.InProgress]: { icon: Clock, color: "text-brand", bg: "bg-bg-brand-soft", border: "border-border-subtle" },
    [TopicStatus.Paused]: { icon: PauseCircle, color: "text-text-secondary", bg: "bg-surface-soft", border: "border-border-subtle" },
    [TopicStatus.NeedsReview]: { icon: AlertCircle, color: "text-status-pending", bg: "bg-bg-pending", border: "border-border-subtle" },
    [TopicStatus.NotStarted]: { icon: Circle, color: "text-text-tertiary", bg: "bg-surface-soft", border: "border-border-subtle" },
    [TopicStatus.Skipped]: { icon: Circle, color: "text-text-tertiary", bg: "bg-surface-soft", border: "border-border-subtle" },
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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className={cn(
        "group cursor-pointer relative transition-all duration-500 select-none",
        isPhase 
          ? "w-[300px] p-8 rounded-[3rem] border-2 shadow-2xl" 
          : "w-[240px] p-6 rounded-[2rem] border shadow-sm",
        isSelected 
          ? "bg-brand text-white border-brand ring-8 ring-brand/5 z-30 shadow-elevated text-white" 
          : topic.id === "root"
          ? "bg-text-primary text-white border-text-primary shadow-elevated"
          : cn(
            "bg-surface-card border-border-subtle hover:border-brand/30 hover:shadow-elevated",
            isPhase && "bg-surface-secondary shadow-card border-border-standard"
          )
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "rounded-full shadow-sm",
          isPhase ? "w-4 h-4" : "w-2.5 h-2.5",
          topic.status === TopicStatus.Completed ? "bg-status-success shadow-status-success/30" :
          topic.status === TopicStatus.InProgress ? "bg-brand shadow-brand/30" :
          "bg-border-standard"
        )} />
        <span className={cn(
          "font-black uppercase tracking-[0.25em] opacity-40 whitespace-nowrap",
          isPhase ? "text-[10px]" : "text-[8px]",
          (isSelected || topic.id === "root") ? "text-white" : "text-text-tertiary"
        )}>
          {topic.id === "root" ? "Global Roadmap" : isPhase ? "Strategic Phase" : "Module Core"}
        </span>
      </div>

      <h4 className={cn(
        "font-display font-black leading-tight tracking-tight",
        isPhase ? "text-xl mb-2" : "text-[15px] mb-2",
        (isSelected || topic.id === "root") ? "text-white" : "text-text-primary"
      )}>
        {topic.title}
      </h4>
      
      <div className="flex items-center justify-between mt-4">
        <div className={cn(
          "text-[9px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-xl shadow-sm border",
          (isSelected || topic.id === "root") 
            ? "bg-white/20 text-white border-white/20" 
            : cn(
               "bg-surface-soft transition-colors group-hover:bg-white",
               topic.status === TopicStatus.Completed ? "text-status-success border-border-subtle" :
               topic.status === TopicStatus.InProgress ? "text-brand border-border-subtle" :
               "text-text-tertiary border-border-subtle"
            )
        )}>
          {topic.status}
        </div>
        {!(isSelected || topic.id === "root") && (
          <ChevronRight size={16} className="text-text-tertiary opacity-40 group-hover:text-brand group-hover:opacity-100 transition-all group-hover:translate-x-1" />
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
        <div className="flex gap-12 pt-24 relative">
          {/* Vertical line down from current node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-24 bg-border-standard/40" />
          
          {topic.children!.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === (topic.children?.length || 0) - 1;
            const isOnly = topic.children?.length === 1;
            
            return (
              <div key={child.id} className="relative pt-12">
                {/* Horizontal connector shoulder */}
                {!isOnly && (
                  <div className={cn(
                    "absolute top-0 h-[2px] bg-border-standard/40",
                    isFirst ? "left-1/2 right-0" : isLast ? "left-0 right-1/2" : "left-0 right-0"
                  )} />
                )}
                {/* Visual stub to connect to the node above */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-border-standard/40" />
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
    <div className="fixed bottom-10 right-10 flex flex-col gap-2 z-[60]">
       <div className="bg-surface-card border border-border-subtle rounded-2xl p-1.5 shadow-elevated flex flex-col gap-1">
          <button 
            onClick={onZoomIn}
            className="p-3 hover:bg-surface-soft rounded-xl text-text-secondary transition-colors"
            title="Zoom In"
          >
            <Plus size={20} />
          </button>
          <div className="h-px bg-border-subtle mx-2" />
          <button 
            onClick={onZoomOut}
            className="p-3 hover:bg-surface-soft rounded-xl text-text-secondary transition-colors"
            title="Zoom Out"
          >
            <Minus size={20} />
          </button>
          <div className="h-px bg-border-subtle mx-2" />
          <button 
            onClick={onReset}
            className="p-3 hover:bg-surface-soft rounded-xl text-text-secondary transition-colors"
            title="Reset View"
          >
            <Maximize size={20} />
          </button>
       </div>
       <div className="bg-surface-card border border-border-subtle rounded-xl py-1.5 px-3 shadow-card text-center">
          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
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
    <div className="flex bg-surface-soft p-1 rounded-2xl border border-border-subtle shadow-control">
      <button 
        onClick={() => onChange("tree")}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
          mode === "tree" ? "bg-white text-brand shadow-card" : "text-text-tertiary hover:text-text-secondary"
        )}
      >
        <Network size={16} /> Tree View
      </button>
      <button 
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
          mode === "list" ? "bg-white text-brand shadow-card" : "text-text-tertiary hover:text-text-secondary"
        )}
      >
        <List size={16} /> List View
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
          "group flex items-center gap-4 py-3 px-4 rounded-2xl transition-all cursor-pointer border border-transparent",
          isSelected ? "bg-brand/5 border-brand/20 shadow-sm" : "hover:bg-surface-soft"
        )}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <div className="flex items-center gap-3 min-w-[200px]">
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1 hover:bg-surface-standard rounded-md transition-colors text-text-tertiary"
            >
              <ChevronDown size={16} className={cn("transition-transform duration-300", !isExpanded && "-rotate-90")} />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <div className={cn(
            "w-2 h-2 rounded-full",
            topic.status === TopicStatus.Completed ? "bg-status-success" : 
            topic.status === TopicStatus.InProgress ? "bg-brand" : "bg-border-standard"
          )} />
          <h4 className={cn(
            "text-sm font-bold tracking-tight",
            topic.status === TopicStatus.Completed ? "text-text-secondary line-through opacity-60" : "text-text-primary"
          )}>
            {topic.title}
          </h4>
        </div>

        <div className="flex-1 h-px bg-border-subtle opacity-40 mx-4" />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <Clock size={12} className="text-text-tertiary" />
            <span className="text-[10px] font-bold text-text-tertiary">{topic.estimatedHours || 0}h</span>
          </div>
          <StatusBadge status={topic.status} />
          <ChevronRight size={14} className={cn("text-text-tertiary transition-transform opacity-0 group-hover:opacity-100", isSelected && "opacity-100 translate-x-1 text-brand")} />
        </div>
      </motion.div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col">
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
      className="fixed top-0 right-0 h-full w-full max-w-lg bg-surface-card shadow-elevated z-[100] border-l border-border-subtle flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-standard flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-surface-soft text-text-tertiary rounded-xl border border-border-subtle">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-text-primary">Topic Intelligence</h3>
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-0.5">Management, Resources, and Progress</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-surface-soft rounded-xl text-text-tertiary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
        <section>
          <div className="flex items-center justify-between mb-4">
             <StatusBadge status={topic.status} />
             {topic.parentId && (
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                 <ArrowRight size={10} /> Parent: {topic.parentId}
               </div>
             )}
          </div>
          <h2 className="text-2xl font-bold text-text-primary leading-tight mb-3">
            {topic.title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {topic.description || "No description provided for this topic yet."}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-secondary border border-border-subtle p-4 rounded-2xl">
            <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest block mb-1">Estimated Effort</span>
            <div className="text-lg font-bold text-text-primary">
               {topic.estimatedHours || 0} <span className="text-xs font-medium text-text-tertiary">h</span>
            </div>
          </div>
          <div className="bg-surface-secondary border border-border-subtle p-4 rounded-2xl">
            <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest block mb-1">Status Alignment</span>
            <div className="text-xs font-bold text-text-secondary">
               {topic.lastActivity || "Freshly synced"}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Learning Resources</h3>
            <button 
              onClick={() => onAddResource(topic)}
              className="text-[10px] font-bold text-brand uppercase tracking-widest hover:underline"
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
                  className="group flex flex-col p-4 bg-surface-secondary rounded-2xl border border-border-subtle hover:border-brand/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-brand">
                      <ResourceIcon type={res.type} />
                      <span className="text-xs font-bold">{res.title}</span>
                    </div>
                    <ExternalLink size={12} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-text-tertiary">Added by {res.addedBy} • {res.addedDate}</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="p-8 border-2 border-dashed border-border-subtle rounded-3xl flex flex-col items-center justify-center text-center">
                 <Library size={24} className="text-text-tertiary opacity-20 mb-3" />
                 <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">No resources curated yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Hierarchical sub-topics list removed - hierarchy is now visual in the tree */}

        {/* Management Matrix */}
        <div className="pt-6 border-t border-border-subtle space-y-4">
          <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Matrix Controls</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onEdit(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-subtle hover:border-brand rounded-xl font-bold text-[10px] transition-all text-text-secondary"
            >
              <Edit3 size={14} /> {isManager ? "EDIT TOPIC" : "REQUEST EDIT"}
            </button>
            <button 
              onClick={() => onDelete(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-subtle hover:border-rose-500 hover:text-rose-500 rounded-xl font-bold text-[10px] transition-all text-text-secondary"
            >
              <Trash2 size={14} /> {isManager ? "DELETE" : "REQUEST DELETE"}
            </button>
            <button 
              onClick={() => onMove(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-subtle hover:border-brand rounded-xl font-bold text-[10px] transition-all text-text-secondary"
            >
              <GitBranch size={14} /> {isManager ? "MOVE NODE" : "REQUEST MOVE"}
            </button>
            <button 
              onClick={() => onCopy(topic)}
              className="flex items-center justify-center gap-2 py-3 bg-surface-soft border border-border-subtle hover:border-brand rounded-xl font-bold text-[10px] transition-all text-text-secondary"
            >
              <Copy size={14} /> {isManager ? "REUSE BRANCH" : "COPY BRANCH"}
            </button>
          </div>
          <button 
            onClick={() => onAddSub(topic)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-brand/5 border border-brand/20 hover:bg-brand/10 text-brand rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all"
          >
            <Plus size={16} /> {isManager ? "ADD CHILD TOPIC" : "REQUEST CHILD"}
          </button>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-border-standard">
         <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-4 bg-brand text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand/20 hover:brightness-110 transition-all">
              <CheckCircle2 size={16} /> {isManager ? "SYNC COMPLETION" : "MARK COMPLETE"}
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-surface-soft text-text-secondary rounded-2xl font-bold text-xs hover:bg-surface-secondary transition-all">
              <MessageSquare size={16} /> ADD LOG
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
      <header className="shrink-0 bg-white border-b border-border-subtle px-10 py-6 flex items-center justify-between relative z-50 shadow-card transition-colors duration-500">
        <div className="flex items-center gap-8">
          {!isTrainee && (
            <>
              <Link to="/trainees" className="p-3 hover:bg-surface-soft rounded-2xl border border-transparent hover:border-border-subtle transition-all text-text-tertiary">
                <ArrowLeft size={22} strokeWidth={2.5} />
              </Link>
              <div className="h-10 w-[1px] bg-border-standard" />
            </>
          )}
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl border-4 border-white overflow-hidden shadow-xl ring-1 ring-slate-100">
                <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover" />
             </div>
              <div>
                <h1 className="text-lg font-display font-black text-text-primary leading-none uppercase tracking-tight">
                   {isTrainee ? "My Roadmap" : trainee.name}
                </h1>
                <p className="text-[11px] font-black text-brand tracking-[0.25em] mt-2.5 opacity-80">{trainee.specialization.toUpperCase()} SPECIALIZATION</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2 leading-none opacity-60">Path Mastery</span>
                 <span className="text-2xl font-display font-black text-brand leading-none">{trainee.progress}%</span>
              </div>
              <div className="w-40 h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100 p-0.5">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trainee.progress}%` }}
                    className="h-full bg-brand rounded-full shadow-lg shadow-brand/30"
                 />
              </div>
           </div>
           <button className="px-8 py-4 bg-brand text-white rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-brand/30">
              {isTrainee ? "Export Path" : "Audit Curriculum"}
           </button>
        </div>
      </header>

      {/* Roadmap Toolbar (Global Actions) */}
      <div className="shrink-0 bg-white border-b border-border-subtle px-10 py-4 flex items-center justify-between z-40 shadow-card">
        <div className="flex items-center gap-6">
          <ViewSwitcher mode={viewMode} onChange={setViewMode} />
          <div className="h-8 w-px bg-border-standard" />
          <button 
            onClick={() => openActionModal("add", virtualRoot)}
            className="flex items-center gap-3 px-6 py-3 bg-brand text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-brand-hover transition-all shadow-card shadow-brand/20 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> {isTrainee ? "REQUEST ADD" : "ADD TOPIC"}
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={18} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="QUICK LOOKUP..." 
              className="pl-12 pr-6 py-3 bg-surface-soft border border-border-subtle rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-brand/[0.03] focus:border-brand/30 focus:bg-white outline-none w-80 transition-all shadow-control group-hover:border-border-standard"
            />
          </div>
          <div className="h-8 w-[1px] bg-border-standard" />
          <button className="p-3 hover:bg-surface-soft rounded-2xl text-text-tertiary transition-all hover:text-text-primary bg-surface-soft/50 border border-transparent hover:border-border-standard">
            <Settings size={22} />
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
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-border-subtle"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand/5 text-brand rounded-2xl">
                    {activeModal === "add" ? <Plus size={24} /> : 
                     activeModal === "edit" ? <Edit3 size={24} /> : 
                     activeModal === "delete" ? <Trash2 size={24} /> :
                     activeModal === "move" ? <GitBranch size={24} /> :
                     activeModal === "copy" ? <Copy size={24} /> :
                     <Library size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-text-primary uppercase">
                      {activeModal === "delete" ? "Confirm Deletion" : 
                       activeModal === "edit" ? "Edit Module" : 
                       activeModal === "move" ? "Move Module" :
                       activeModal === "copy" ? "Reuse Branch" :
                       activeModal === "resource" ? "Add Resource" :
                       "Add Training Topic"}
                    </h3>
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">
                      {activeModal === "delete" ? "Critical Structural Update" : "Curriculum Synchronization"}
                    </p>
                  </div>
                </div>

                {activeModal === "delete" ? (
                  <div className="space-y-4">
                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                      <p className="text-sm text-rose-900 leading-relaxed">
                        Are you sure you want to remove <span className="font-bold underline">{modalContext?.title}</span>?
                      </p>
                      <p className="text-[11px] font-medium text-rose-700/70 mt-2">
                        This will permanently erase this node and all of its {modalContext?.children?.length || 0} sub-modules. This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 bg-surface-soft text-text-secondary font-bold text-sm rounded-2xl border border-border-subtle hover:bg-surface-secondary transition-all"
                      >
                        CANCEL
                      </button>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all"
                      >
                        CONFIRM DELETE
                      </button>
                    </div>
                  </div>
                ) : activeModal === "move" ? (
                  <div className="space-y-5">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Select a new destination parent for <span className="font-bold text-text-primary">{modalContext?.title}</span>. The hierarchy and all children will be preserved during the transition.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Current Position</label>
                        <div className="p-4 bg-surface-soft border border-border-subtle rounded-2xl text-xs font-bold text-text-tertiary truncate">
                          {getBreadcrumbs(modalContext?.id || "")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Target Parent Module</label>
                        <div className="relative">
                           <select className="w-full appearance-none px-5 py-4 bg-white border border-border-subtle rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 transition-all pr-12">
                              {getFilteredNodes(modalContext?.id).map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                           </select>
                           <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-surface-soft text-text-secondary font-bold text-sm rounded-2xl border border-border-subtle">CANCEL</button>
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-brand text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand/20">CONFIRM MOVE</button>
                    </div>
                  </div>
                ) : activeModal === "resource" ? (
                  <div className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Resource Title</label>
                        <input type="text" placeholder="e.g. Master Class: Spring Security" className="w-full px-5 py-4 bg-surface-soft border border-border-subtle rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Resource Type</label>
                        <div className="grid grid-cols-2 gap-2">
                           {Object.values(ResourceType).map(type => (
                             <button key={type} className="px-4 py-2 bg-surface-soft border border-border-subtle rounded-xl text-[10px] font-bold text-text-secondary hover:border-brand hover:text-brand transition-all">{type}</button>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">URL / Link</label>
                        <input type="text" placeholder="https://..." className="w-full px-5 py-4 bg-surface-soft border border-border-subtle rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand/20" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-surface-soft text-text-secondary font-bold text-sm rounded-2xl border border-border-subtle">ABORT</button>
                       <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-brand text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand/20">ADD RESOURCE</button>
                    </div>
                  </div>
                ) : activeModal === "copy" ? (
                   <div className="space-y-5">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        You are about to duplicate the <span className="font-bold text-text-primary">"{modalContext?.title}"</span> branch. This will create a fresh copy of this branch at the current level, including all resources and sub-topics.
                      </p>
                      <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Copy size={16} className="text-brand" />
                            <span className="text-[11px] font-bold text-brand uppercase tracking-widest">Branch duplication active</span>
                         </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button onClick={() => setActiveModal(null)} className="flex-1 py-4 border border-border-subtle text-text-secondary font-bold text-sm rounded-2xl hover:bg-surface-soft">CANCEL</button>
                        <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-brand text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand/20">REUSE BRANCH</button>
                      </div>
                   </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Topic Title</label>
                      <input 
                        type="text" 
                        defaultValue={activeModal === "edit" ? modalContext?.title : ""}
                        placeholder="e.g. Advanced System Design"
                        className="w-full px-5 py-4 bg-surface-soft border border-border-subtle rounded-2xl text-sm font-bold text-text-primary outline-none focus:ring-2 focus:ring-brand/20 transition-all hover:border-border-standard focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Curriculum Rationale</label>
                       <textarea 
                        defaultValue={activeModal === "edit" ? modalContext?.description : ""}
                        placeholder="Define learning outcomes and professional scope..."
                        rows={3}
                        className="w-full px-5 py-4 bg-surface-soft border border-border-subtle rounded-2xl text-sm font-medium text-text-secondary outline-none focus:ring-2 focus:ring-brand/20 resize-none hover:border-border-standard focus:bg-white"
                       />
                    </div>
                    {activeModal === "add" && (
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest ml-1">Parent Module</label>
                             <div className="relative">
                                <select 
                                  defaultValue={modalContext?.id}
                                  className="w-full appearance-none px-5 py-4 bg-surface-soft border border-border-subtle rounded-2xl text-sm font-bold text-brand outline-none focus:ring-2 focus:ring-brand/20 transition-all pr-12"
                                >
                                   {allTopics.map(t => (
                                      <option key={t.id} value={t.id}>{t.title}</option>
                                   ))}
                                </select>
                                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                             </div>
                          </div>
                       </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 border border-border-subtle text-text-secondary font-bold text-sm rounded-2xl hover:bg-surface-soft transition-all"
                      >
                        ABORT
                      </button>
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 bg-brand text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand/20 hover:brightness-110 active:scale-95 transition-all"
                      >
                        {activeModal === "edit" ? (role === "manager" ? "SAVE CHANGES" : "REQUEST SAVE") : (role === "manager" ? "ADD TO ROADMAP" : "SUBMIT PROPOSAL")}
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
