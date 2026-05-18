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
import { mockTrainees, TopicStatus, RoadmapTopic, ResourceType, Resource } from "../data/mockData";
import { cn } from "../lib/utils";
import { roadmapApi, ApiTopicNode, EditTopicRequest } from "../lib/apiClient";

const ROADMAP_ID = '00000000-0000-0000-0000-000000000100';

const TOPIC_STATUS_MAP: Record<string, TopicStatus> = {
  NOT_STARTED: TopicStatus.NotStarted,
  IN_PROGRESS: TopicStatus.InProgress,
  COMPLETED: TopicStatus.Completed,
  PAUSED: TopicStatus.Paused,
  SKIPPED: TopicStatus.Skipped,
  NEEDS_REVIEW: TopicStatus.NeedsReview,
};

function mapApiTopic(node: ApiTopicNode): RoadmapTopic {
  return {
    id: node.id,
    title: node.title,
    description: node.description ?? undefined,
    status: TOPIC_STATUS_MAP[node.status] ?? TopicStatus.NotStarted,
    isCountable: node.countable,
    parentId: node.parentId ?? undefined,
    children: node.children.length > 0 ? node.children.map(mapApiTopic) : undefined,
  };
}

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
  isPhase = false,
  isMatch = true,
  hasMatchChild = false
}: { 
  topic: RoadmapTopic; 
  onSelect: (topic: RoadmapTopic) => void;
  isSelected: boolean;
  isPhase?: boolean;
  isMatch?: boolean;
  hasMatchChild?: boolean;
}) => {
  const isRoot = topic.id === "root";

  // Hide if it's not a match AND doesn't have a child that is a match
  if (!isMatch && !hasMatchChild) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className={cn(
        "group cursor-pointer relative transition-all duration-500 select-none",
        isPhase 
          ? "w-[240px] p-5 rounded-2xl border-2 shadow-card" 
          : "w-[190px] p-4 rounded-xl border shadow-sm",
        isSelected 
          ? "bg-brand text-white border-brand ring-4 ring-brand/5 z-30 shadow-elevated" 
          : isRoot
          ? "bg-text-primary text-white border-text-primary shadow-elevated"
          : cn(
            "bg-white border-border-subtle hover:border-brand/40 hover:shadow-elevated",
            isPhase && "bg-surface-card shadow-card border-border-standard",
            !isMatch && "opacity-40 grayscale-[0.5]" // Highlight non-matches if they are parents
          )
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "rounded-full shadow-sm",
          isPhase ? "w-2.5 h-2.5" : "w-2 h-2",
          topic.status === TopicStatus.Completed ? "bg-status-success shadow-status-success/40 ring-4 ring-status-success/10" :
          topic.status === TopicStatus.InProgress ? "bg-brand shadow-brand/40 ring-4 ring-brand/10" :
          "bg-border-standard"
        )} />
        <span className={cn(
          "font-black uppercase tracking-[0.25em] whitespace-nowrap",
          isPhase ? "text-[8px]" : "text-[7px]",
          (isSelected || isRoot) ? "opacity-60 text-white" : "opacity-40 text-text-tertiary"
        )}>
          {isRoot ? "Architecture" : isPhase ? "Phase" : "Module"}
        </span>
      </div>

      <h4 className={cn(
        "font-display font-black leading-tight tracking-tight",
        isPhase ? "text-lg mb-1.5" : "text-[14px] mb-1",
        (isSelected || isRoot) ? "text-white" : "text-text-primary"
      )}>
        {topic.title}
      </h4>
      
      <div className="flex items-center justify-between mt-3">
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
          <div className="p-1 px-1.5 bg-surface-soft rounded-lg opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
             <ChevronRight size={10} className="text-brand" strokeWidth={3} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TreeBranch = ({ topic, onSelect, selectedId, depth = 0, matchesSearch, hasMatchingChild }: { 
  topic: RoadmapTopic; 
  onSelect: (t: RoadmapTopic) => void; 
  selectedId?: string;
  depth?: number;
  matchesSearch: (t: RoadmapTopic) => boolean;
  hasMatchingChild: (t: RoadmapTopic) => boolean;
}) => {
  const isSelected = selectedId === topic.id;
  const hasChildren = topic.children && topic.children.length > 0;
  const isRoot = topic.id === "root";

  const isMatch = matchesSearch(topic);
  const hasMatchChild = hasMatchingChild(topic);

  if (!isMatch && !hasMatchChild) return null;

  return (
    <div className="flex flex-col items-center relative">
      <RoadmapNode 
        topic={topic} 
        onSelect={onSelect} 
        isSelected={isSelected}
        isPhase={isRoot || depth === 1}
        isMatch={isMatch}
        hasMatchChild={hasMatchChild}
      />
      
      {hasChildren && (
        <div className="flex gap-12 pt-20 relative">
          {/* Vertical line down from current node */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-20 bg-border-standard" />
          
          {topic.children!.filter(c => matchesSearch(c) || hasMatchingChild(c)).map((child, index, filtered) => {
            const isFirst = index === 0;
            const isLast = index === filtered.length - 1;
            const isOnly = filtered.length === 1;
            
            return (
              <div key={child.id} className="relative pt-12">
                {/* Horizontal connector shoulder */}
                {!isOnly && (
                  <div className={cn(
                    "absolute top-0 h-[2px] bg-border-standard",
                    isFirst ? "left-1/2 right-0" : isLast ? "left-0 right-1/2" : "left-0 right-0"
                  )} />
                )}
                {/* Visual stub to connect to the node above */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-border-standard" />
                <TreeBranch 
                  topic={child} 
                  onSelect={onSelect} 
                  selectedId={selectedId} 
                  depth={depth + 1}
                  matchesSearch={matchesSearch}
                  hasMatchingChild={hasMatchingChild}
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
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[60]">
       <div className="bg-white border border-border-standard rounded-2xl p-1 shadow-lg flex flex-col gap-0.5 backdrop-blur-xl">
          <button 
            onClick={onZoomIn}
            className="p-2 hover:bg-surface-soft rounded-xl text-text-secondary hover:text-brand transition-all active:scale-95"
            title="Zoom In"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
          <div className="h-px bg-border-subtle mx-1.5" />
          <button 
            onClick={onZoomOut}
            className="p-2 hover:bg-surface-soft rounded-xl text-text-secondary hover:text-brand transition-all active:scale-95"
            title="Zoom Out"
          >
            <Minus size={16} strokeWidth={3} />
          </button>
          <div className="h-px bg-border-subtle mx-1.5" />
          <button 
            onClick={onReset}
            className="p-2 hover:bg-surface-soft rounded-xl text-text-secondary hover:text-brand transition-all active:scale-95"
            title="Reset View"
          >
            <Maximize size={16} strokeWidth={3} />
          </button>
       </div>
       <div className="bg-white border border-border-standard text-text-secondary rounded-xl py-1 px-3 shadow-md text-center">
          <span className="text-[9px] font-black uppercase tracking-[0.1em]">{Math.round(zoom * 100)}%</span>
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
    case ResourceType.Notes: return <FileText size={14} />;
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
  selectedId,
  matchesSearch,
  hasMatchingChild
}: { 
  topic: RoadmapTopic; 
  depth?: number; 
  onSelect: (topic: RoadmapTopic) => void;
  selectedId?: string;
  key?: string;
  matchesSearch: (t: RoadmapTopic) => boolean;
  hasMatchingChild: (t: RoadmapTopic) => boolean;
}) => {
  const query = matchesSearch(topic);
  const matchChild = hasMatchingChild(topic);

  if (!query && !matchChild) return null;

  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = topic.children && topic.children.length > 0;
  const isSelected = selectedId === topic.id;

  return (
    <div className="flex flex-col">
      <motion.div 
        layout
        onClick={() => onSelect(topic)}
        className={cn(
          "group flex items-center gap-4 py-3 px-4 rounded-xl transition-all cursor-pointer border-2",
          isSelected ? "bg-brand/5 border-brand/20 shadow-sm" : "border-transparent hover:bg-surface-soft hover:border-border-subtle",
          !query && "opacity-50"
        )}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <div className="flex items-center gap-3 min-w-[200px]">
          {hasChildren ? (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1 hover:bg-white rounded-lg transition-all text-brand shadow-sm border border-transparent hover:border-border-subtle"
            >
              <ChevronDown size={14} strokeWidth={3} className={cn("transition-transform duration-500", !isExpanded && "-rotate-90")} />
            </button>
          ) : (
            <div className="w-6" />
          )}
          <div className={cn(
            "w-2.5 h-2.5 rounded-full ring-4 ring-opacity-10 transition-all",
            topic.status === TopicStatus.Completed ? "bg-status-success ring-status-success" : 
            topic.status === TopicStatus.InProgress ? "bg-brand ring-brand" : "bg-border-standard ring-transparent"
          )} />
          <h4 className={cn(
            "text-[14px] font-black tracking-tight transition-all",
            topic.status === TopicStatus.Completed ? "text-text-tertiary line-through decoration-text-tertiary/40" : "text-text-primary",
            depth === 0 && "text-base uppercase"
          )}>
            {topic.title}
          </h4>
        </div>

        <div className="flex-1 h-[1px] bg-border-subtle opacity-10 mx-4" />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <Clock size={12} className="text-text-tertiary" />
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{topic.estimatedHours || 0}H</span>
          </div>
          <StatusBadge status={topic.status} />
          <div className={cn(
            "p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100",
            isSelected ? "bg-brand text-white opacity-100 shadow-lg shadow-brand/30" : "bg-surface-soft text-text-tertiary"
          )}>
            <ChevronRight size={14} strokeWidth={3} className={cn("transition-transform", isSelected && "translate-x-0.5")} />
          </div>
        </div>
      </motion.div>

      {hasChildren && isExpanded && (
        <div className="flex flex-col mt-2">
          {topic.children?.filter(c => matchesSearch(c) || hasMatchingChild(c)).map(child => (
            <ListViewRow 
              key={child.id} 
              topic={child} 
              depth={depth + 1} 
              onSelect={onSelect}
              selectedId={selectedId}
              matchesSearch={matchesSearch}
              hasMatchingChild={hasMatchingChild}
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
  role,
  traineeName,
  onStatusChange,
  onDeleteResource
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
  traineeName: string;
  onStatusChange: (topic: RoadmapTopic, status: TopicStatus) => void;
  onDeleteResource: (topicId: string, resourceId: string) => void;
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 text-brand">
                        <div className="p-2 bg-brand/5 rounded-lg group-hover:bg-brand group-hover:text-white transition-all">
                          <ResourceIcon type={res.type} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight">{res.title}</span>
                      </div>
                      {res.note && (
                        <p className="text-[10px] font-medium text-text-tertiary leading-relaxed mt-1 text-left italic opacity-80 pl-1">{res.note}</p>
                      )}
                    </div>
                    <ExternalLink size={12} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border-subtle/40">
                    <div className="flex items-center gap-4">
                      <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">By {res.addedBy}</span>
                      <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{res.addedDate}</span>
                    </div>
                    {isManager || res.addedBy === traineeName ? (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteResource(topic.id, res.id);
                        }}
                        className="p-1 hover:bg-rose-50 text-text-tertiary hover:text-rose-500 rounded transition-colors"
                      >
                        <Trash2 size={10} />
                      </button>
                    ) : null}
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
            <button 
              onClick={() => onStatusChange(topic, topic.status === TopicStatus.Completed ? TopicStatus.InProgress : TopicStatus.Completed)}
              className={cn(
                "flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95",
                topic.status === TopicStatus.Completed 
                  ? "bg-surface-soft text-text-secondary shadow-none border border-border-subtle" 
                  : "bg-brand text-white shadow-brand/30 hover:brightness-110"
              )}
            >
              <CheckCircle2 size={18} strokeWidth={3} /> {topic.status === TopicStatus.Completed ? "RE-ACTIVATE" : (isManager ? "SYNC STATUS" : "MARK COMPLETE")}
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

  const [roadmapData, setRoadmapData] = useState<RoadmapTopic[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [roadmapTitle, setRoadmapTitle] = useState("Roadmap");
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeModal, setActiveModal] = useState<"add" | "edit" | "delete" | "move" | "copy" | "resource" | null>(null);
  const [modalContext, setModalContext] = useState<RoadmapTopic | null>(null);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to show toast
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Visual Layout: Virtual Root for easy traversal
  const virtualRoot: RoadmapTopic = {
    id: "root",
    title: roadmapTitle,
    status: TopicStatus.Completed,
    isCountable: false,
    description: "The global strategic path for this roadmap.",
    children: roadmapData
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

  const allTopics = [virtualRoot, ...flattenTopics(roadmapData)];

  // Recursive roadmap update function
  const mutateRoadmap = (
    data: RoadmapTopic[], 
    action: 'add' | 'edit' | 'delete' | 'move' | 'status' | 'resource-add' | 'resource-delete',
    payload: any
  ): RoadmapTopic[] => {
    // Deep clone to avoid direct mutation
    const newData = JSON.parse(JSON.stringify(data));

    const process = (items: RoadmapTopic[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (action === 'add' && item.id === payload.parentId) {
          if (!item.children) item.children = [];
          item.children.push(payload.newNode);
          return true;
        }

        if (item.id === payload.id) {
          if (action === 'edit') {
            Object.assign(item, payload.updates);
            return true;
          }
          if (action === 'delete') {
            items.splice(i, 1);
            return true;
          }
          if (action === 'move') {
            // This is complex, handled separately usually, but we can do it here
            // Removing from current parent is done in 'delete' logic basically
            return true;
          }
          if (action === 'status') {
            item.status = payload.status;
            return true;
          }
          if (action === 'resource-add') {
            if (!item.resources) item.resources = [];
            item.resources.push(payload.resource);
            return true;
          }
          if (action === 'resource-delete') {
             item.resources = item.resources?.filter(r => r.id !== payload.resourceId);
             return true;
          }
        }

        if (item.children && process(item.children)) return true;
      }
      return false;
    };

    if (action === 'add' && payload.parentId === 'root') {
      newData.push(payload.newNode);
    } else if (action === 'move') {
       // Move logic: 
       // 1. Find and remove the node from old location
       let movedNode: RoadmapTopic | null = null;
       const remove = (items: RoadmapTopic[]): boolean => {
          for(let i=0; i<items.length; i++) {
             if(items[i].id === payload.id) {
                movedNode = items.splice(i, 1)[0];
                return true;
             }
             if(items[i].children && remove(items[i].children!)) return true;
          }
          return false;
       }
       remove(newData);
       if (movedNode) {
          if (payload.newParentId === 'root') {
             newData.push({ ...movedNode, parentId: undefined });
          } else {
             const insert = (items: RoadmapTopic[]): boolean => {
                for(let i=0; i<items.length; i++) {
                   if(items[i].id === payload.newParentId) {
                      if(!items[i].children) items[i].children = [];
                      items[i].children!.push({ ...movedNode!, parentId: payload.newParentId });
                      return true;
                   }
                   if(items[i].children && insert(items[i].children!)) return true;
                }
                return false;
             }
             insert(newData);
          }
       }
    } else {
      process(newData);
    }
    
    return newData;
  };

  const handleAction = (action: 'add' | 'edit' | 'delete' | 'move' | 'status' | 'resource-add' | 'resource-delete', payload: any) => {
    // If trainee and structural change, create request
    const isStructural = ['add', 'edit', 'delete', 'move'].includes(action);
    if (isTrainee && isStructural) {
      showToast("Proposal submitted for manager approval", "info");
      setActiveModal(null);
      return;
    }

    const updatedData = mutateRoadmap(roadmapData, action, payload);
    setRoadmapData(updatedData);

    // Update selected topic if it was the one modified
    if (selectedTopic && (payload.id === selectedTopic.id || action === 'add')) {
        // Find the updated version of selectedTopic
        const flat = flattenTopics(updatedData);
        const updatedSelected = flat.find(t => t.id === selectedTopic.id);
        if (updatedSelected) setSelectedTopic(updatedSelected);
        else if (action === 'delete') setSelectedTopic(null);
    }

    showToast(`Roadmap synchronized successfully`);
    setActiveModal(null);
  };

  // Search logic
  const matchesSearch = (topic: RoadmapTopic) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return topic.title.toLowerCase().includes(query) || 
           topic.description?.toLowerCase().includes(query);
  };

  // Find if any child matches search
  const hasMatchingChild = (topic: RoadmapTopic): boolean => {
    return topic.children?.some(child => matchesSearch(child) || hasMatchingChild(child)) || false;
  };

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

  // Calculate dynamic progress
  const countableTopics = allTopics.filter(t => t.isCountable);
  const completedCountable = countableTopics.filter(t => t.status === TopicStatus.Completed).length;
  const progressPercentage = countableTopics.length > 0 
    ? Math.round((completedCountable / countableTopics.length) * 100) 
    : 0;

  useEffect(() => {
    if (containerRef.current) {
      // Center the viewport initially
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
    }
  }, []);

  useEffect(() => {
    roadmapApi.getTree(ROADMAP_ID)
      .then((data) => {
        setRoadmapTitle(data.title);
        setRoadmapData(data.topics.map(mapApiTopic));
        setApiLoading(false);
      })
      .catch((err: Error) => {
        setApiError(err.message || 'Failed to load roadmap');
        setApiLoading(false);
      });
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
    setModalError(null);
    setIsModalSubmitting(false);
  };

  const handleAddTopic = async (formData: FormData) => {
    if (isTrainee) {
      showToast("Proposal submitted for manager approval", "info");
      setActiveModal(null);
      return;
    }

    const title = ((formData.get('title') as string) ?? '').trim();
    if (!title) {
      setModalError('Title must not be blank');
      return;
    }
    const description = ((formData.get('description') as string) ?? '').trim() || undefined;
    const parentIdRaw = formData.get('parentId') as string;
    const parentId = (!parentIdRaw || parentIdRaw === 'root') ? null : parentIdRaw;
    const countable = formData.get('isCountable') === 'on';

    setIsModalSubmitting(true);
    setModalError(null);
    try {
      const updated = await roadmapApi.addTopic(ROADMAP_ID, { title, description, parentId, countable });
      setRoadmapTitle(updated.title);
      setRoadmapData(updated.topics.map(mapApiTopic));
      setActiveModal(null);
      showToast('Topic added successfully');
    } catch (err: any) {
      setModalError(err.message || 'Failed to add topic');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (isTrainee) {
      showToast("Proposal submitted for manager approval", "info");
      setActiveModal(null);
      return;
    }

    if (!modalContext || modalContext.id === 'root') return;

    setIsModalSubmitting(true);
    setModalError(null);
    try {
      const updated = await roadmapApi.deleteTopic(ROADMAP_ID, modalContext.id);
      const newTopics = updated.topics.map(mapApiTopic);
      setRoadmapTitle(updated.title);
      setRoadmapData(newTopics);
      // Clear selected topic if it was deleted or was a descendant of the deleted topic
      if (selectedTopic) {
        const stillExists = flattenTopics(newTopics).some(t => t.id === selectedTopic.id);
        if (!stillExists) setSelectedTopic(null);
      }
      setActiveModal(null);
      showToast('Topic deleted successfully');
    } catch (err: any) {
      setModalError(err.message || 'Failed to delete topic');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleEditTopic = async (formData: FormData) => {
    if (isTrainee) {
      showToast("Proposal submitted for manager approval", "info");
      setActiveModal(null);
      return;
    }

    if (!modalContext || modalContext.id === 'root') return;

    const title = ((formData.get('title') as string) ?? '').trim();
    if (!title) {
      setModalError('Title must not be blank');
      return;
    }
    const description = ((formData.get('description') as string) ?? '').trim() || undefined;
    const countable = formData.get('isCountable') === 'on';

    setIsModalSubmitting(true);
    setModalError(null);
    try {
      const updated = await roadmapApi.editTopic(ROADMAP_ID, modalContext.id, { title, description, countable });
      const newTopics = updated.topics.map(mapApiTopic);
      setRoadmapTitle(updated.title);
      setRoadmapData(newTopics);
      // Keep the detail panel current if the edited topic is selected
      if (selectedTopic?.id === modalContext.id) {
        const refreshed = flattenTopics(newTopics).find(t => t.id === modalContext.id);
        if (refreshed) setSelectedTopic(refreshed);
      }
      setActiveModal(null);
      showToast('Topic updated successfully');
    } catch (err: any) {
      setModalError(err.message || 'Failed to update topic');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  if (apiLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-app">
        <div className="text-text-secondary text-sm font-medium uppercase tracking-widest">Loading roadmap...</div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-app">
        <div className="text-red-500 text-sm font-medium uppercase tracking-widest">Error: {apiError}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background-app overflow-hidden transition-colors duration-500">
      {/* Top Header */}
      <header className="shrink-0 bg-white border-b border-border-subtle px-6 py-3 flex items-center justify-between relative z-50 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          {!isTrainee && (
            <>
              <Link to="/trainees" className="p-2 hover:bg-surface-soft rounded-lg border border-transparent hover:border-border-subtle transition-all text-text-tertiary shadow-sm active:scale-90">
                <ArrowLeft size={18} strokeWidth={3} />
              </Link>
              <div className="h-6 w-[1px] bg-border-standard opacity-50" />
            </>
          )}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg p-0.5 bg-white border border-border-standard shadow-md ring-4 ring-brand/5">
                <img src={trainee.avatar} alt={trainee.name} className="w-full h-full object-cover rounded-[0.45rem]" />
             </div>
              <div className="space-y-0">
                <h1 className="text-base font-display font-black text-text-primary leading-tight uppercase tracking-tight">
                   {isTrainee ? "Strategic Roadmap" : trainee.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand animate-pulse shadow-sm shadow-brand" />
                  <p className="text-[8px] font-black text-brand tracking-[0.2em] uppercase opacity-70">{trainee.specialization}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-0.5">
                 <span className="text-[7px] font-black text-text-tertiary uppercase tracking-[0.2em] opacity-60">Mastery</span>
                 <div className="flex items-baseline gap-0.5">
                   <span className="text-xl font-display font-black text-text-primary leading-none tracking-tighter">{progressPercentage}</span>
                   <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">%</span>
                 </div>
              </div>
              <div className="w-24 h-2 bg-surface-soft rounded-full overflow-hidden border border-border-standard shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-brand rounded-full shadow-md shadow-brand/40"
                 />
              </div>
           </div>
           <button className="px-4 py-2.5 bg-brand text-white rounded-xl text-[9px] font-black tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand/20">
              {isTrainee ? "EXPORT" : "AUDIT"}
           </button>
        </div>
      </header>

      {/* Roadmap Toolbar (Global Actions) */}
      <div className="shrink-0 bg-surface-soft/40 backdrop-blur-xl border-b border-border-subtle px-6 py-2 flex items-center justify-between z-40 relative shadow-sm">
        <div className="flex items-center gap-4">
          <ViewSwitcher mode={viewMode} onChange={setViewMode} />
          <div className="h-6 w-[1px] bg-border-standard opacity-40 mx-1" />
          <button 
            onClick={() => openActionModal("add", virtualRoot)}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-brand-hover transition-all shadow-lg shadow-brand/10 active:scale-95"
          >
            <PlusCircle size={14} strokeWidth={3} /> {isTrainee ? "ADD" : "ARCHITECT"}
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-all", searchQuery && "text-brand")} size={14} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="SEARCH..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-border-standard rounded-xl text-[10px] font-black uppercase tracking-[0.2em] outline-none w-56 transition-all shadow-sm focus:border-brand/40"
            />
          </div>
          <div className="h-6 w-[1px] bg-border-standard opacity-40 mx-1" />
          <button className="p-2 bg-white hover:bg-surface-soft rounded-lg text-text-tertiary transition-all border border-border-standard shadow-sm active:scale-90">
            <Settings size={18} strokeWidth={2.5} />
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
                    matchesSearch={matchesSearch}
                    hasMatchingChild={hasMatchingChild}
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
              className="max-w-4xl mx-auto p-6 md:p-12 py-10"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-display font-black text-text-primary uppercase tracking-tight mb-1">Curriculum Checklist</h2>
                <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest">Global hierarchical view of all training modules</p>
              </div>

              <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-hidden">
                <div className="p-4 md:p-6 space-y-1">
                  <ListViewRow 
                    topic={virtualRoot} 
                    onSelect={setSelectedTopic} 
                    selectedId={selectedTopic?.id}
                    matchesSearch={matchesSearch}
                    hasMatchingChild={hasMatchingChild}
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
               traineeName={trainee.name}
               onClose={() => setSelectedTopic(null)} 
               onEdit={(t) => openActionModal("edit", t)}
               onDelete={(t) => openActionModal("delete", t)}
               onAddSub={(t) => openActionModal("add", t)}
               onMove={(t) => openActionModal("move", t)}
               onCopy={(t) => openActionModal("copy", t)}
               onAddResource={(t) => openActionModal("resource", t)}
               onStatusChange={(t, s) => handleAction('status', { id: t.id, status: s })}
               onDeleteResource={(tid, rid) => handleAction('resource-delete', { id: tid, resourceId: rid })}
             />
          </>
        )}
      </AnimatePresence>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={cn(
              "fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-elevated z-[300] flex items-center gap-3 border backdrop-blur-md",
              toast.type === 'success' ? "bg-white border-status-success/20 text-status-success" : 
              toast.type === 'error' ? "bg-rose-50 border-rose-200 text-rose-600" :
              "bg-brand/5 border-brand/20 text-brand"
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : 
             toast.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">{toast.message}</span>
          </motion.div>
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
              className="bg-white w-full max-w-md rounded-2xl shadow-elevated relative z-10 overflow-hidden border border-border-standard"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand/5 text-brand rounded-xl border border-brand/10 shadow-sm">
                    {activeModal === "add" ? <PlusCircle size={20} strokeWidth={2.5} /> : 
                     activeModal === "edit" ? <Edit3 size={20} strokeWidth={2.5} /> : 
                     activeModal === "delete" ? <Trash2 size={20} strokeWidth={2.5} /> :
                     activeModal === "move" ? <GitBranch size={20} strokeWidth={2.5} /> :
                     activeModal === "copy" ? <Copy size={20} strokeWidth={2.5} /> :
                     <Library size={20} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h3 className="text-base font-display font-black tracking-tight text-text-primary uppercase leading-none">
                      {activeModal === "delete" ? "Security Protocol" : 
                       activeModal === "edit" ? "Modify Node" : 
                       activeModal === "move" ? "Migration Orchestration" :
                       activeModal === "copy" ? "Pattern Replication" :
                       activeModal === "resource" ? "Knowledge Asset" :
                       "Architect Node"}
                    </h3>
                    <p className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1 opacity-60">
                      {activeModal === "delete" ? "Irreversible curriculum erasure" : "Curriculum Synchronization Service"}
                    </p>
                  </div>
                </div>

                {activeModal === "delete" ? (
                  <div className="space-y-5">
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 shadow-inner">
                      <p className="text-xs font-medium text-rose-900 leading-relaxed">
                        Are you sure you want to remove <span className="font-bold underline">{modalContext?.title}</span>?
                      </p>
                      <p className="text-[9px] font-black text-rose-700/60 uppercase tracking-widest mt-2">
                        DANGER: Deleting this topic will also delete all nested subtopics under it.
                      </p>
                    </div>
                    {modalError && (
                      <div className="px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-[0.15em]">
                        {modalError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveModal(null)}
                        disabled={isModalSubmitting}
                        className="flex-1 py-1.5 bg-white text-text-secondary font-black text-[9px] uppercase tracking-widest rounded-lg border border-border-standard hover:bg-slate-50 transition-all active:scale-95 shadow-sm disabled:opacity-60 disabled:pointer-events-none"
                      >
                        CLOSE
                      </button>
                      <button
                        onClick={handleDeleteTopic}
                        disabled={isModalSubmitting}
                        className="flex-1 py-2.5 bg-rose-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {isModalSubmitting ? 'DELETING...' : 'EXECUTE DELETE'}
                      </button>
                    </div>
                  </div>
                ) : activeModal === "move" ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleAction('move', { id: modalContext?.id, newParentId: formData.get('parentId') });
                  }} className="space-y-5">
                    <p className="text-[11px] font-medium text-text-secondary leading-relaxed">
                      Select a strategic destination for <span className="font-bold text-text-primary">"{modalContext?.title}"</span>.
                    </p>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5 opacity-60">Target Parent Module</label>
                        <div className="relative group">
                           <select name="parentId" defaultValue={modalContext?.parentId || 'root'} className="w-full appearance-none px-4 py-2 bg-white border border-border-standard rounded-lg text-[11px] font-black text-text-primary outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all pr-10 shadow-sm cursor-pointer">
                              {getFilteredNodes(modalContext?.id).map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                           </select>
                           <ChevronDown size={14} strokeWidth={3} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-brand" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                       <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-white text-text-secondary font-black text-[9px] uppercase tracking-widest rounded-lg border border-border-standard shadow-sm active:scale-95 transition-all hover:bg-slate-50">CANCEL</button>
                       <button type="submit" className="flex-1 py-2.5 bg-brand text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg shadow-brand/20 active:scale-95 transition-all">MIGRATE NODE</button>
                    </div>
                  </form>
                ) : activeModal === "resource" ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const resource = {
                      id: Math.random().toString(36).substr(2, 9),
                      title: formData.get('title') as string,
                      type: formData.get('type') as ResourceType,
                      url: formData.get('url') as string,
                      note: formData.get('note') as string,
                      addedBy: role === 'manager' ? 'Manager' : trainee.name,
                      addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    };
                    handleAction('resource-add', { id: modalContext?.id, resource });
                  }} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">Asset Title</label>
                        <input name="title" required type="text" placeholder="Title of the asset..." className="w-full px-4 py-2 bg-slate-50 border border-border-standard rounded-lg text-xs font-bold outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all focus:bg-white shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">Category</label>
                        <div className="grid grid-cols-4 gap-1.5">
                           {Object.values(ResourceType).map(type => (
                             <label key={type} className="relative cursor-pointer group">
                               <input type="radio" name="type" value={type} required className="peer sr-only" defaultChecked={type === ResourceType.Article} />
                               <div className="px-1 py-2 bg-slate-50 border border-border-standard rounded-lg text-[7px] font-black uppercase tracking-widest text-text-secondary text-center peer-checked:border-brand peer-checked:text-brand peer-checked:bg-brand/5 transition-all shadow-sm group-hover:bg-white truncate">
                                 {type}
                               </div>
                             </label>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">URL</label>
                        <div className="relative group">
                          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={12} />
                          <input name="url" required type="url" placeholder="https://..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border-standard rounded-lg text-xs font-medium outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all focus:bg-white shadow-sm" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">Note (Optional)</label>
                        <textarea name="note" rows={2} placeholder="Optional study context..." className="w-full px-4 py-2 bg-slate-50 border border-border-standard rounded-lg text-[10px] font-medium text-text-secondary outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all shadow-sm focus:bg-white resize-none" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-white text-text-secondary font-black text-[9px] uppercase tracking-widest rounded-lg border border-border-standard shadow-sm active:scale-95 transition-all hover:bg-slate-50">ABORT</button>
                       <button type="submit" className="flex-1 py-2.5 bg-brand text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg shadow-brand/20 active:scale-95 transition-all">LINK KNOWLEDGE</button>
                    </div>
                  </form>
                ) : activeModal === "copy" ? (
                   <div className="space-y-5">
                      <p className="text-[11px] font-medium text-text-secondary leading-relaxed">
                        Replicating strategic pattern: <span className="font-bold text-text-primary">"{modalContext?.title}"</span>.
                      </p>
                      <div className="p-4 bg-brand/5 border border-brand/10 rounded-xl shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-brand text-white rounded-lg">
                               <Copy size={14} strokeWidth={3} />
                            </div>
                            <span className="text-[8px] font-black text-brand uppercase tracking-[0.2em]">Ready for replication</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-white text-text-secondary font-black text-[9px] uppercase tracking-widest rounded-lg border border-border-standard shadow-sm hover:bg-slate-50 active:scale-95 transition-all">ABORT</button>
                        <button onClick={() => {
                          showToast("Feature coming soon in prototype", "info");
                          setActiveModal(null);
                        }} className="flex-1 py-2.5 bg-brand text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg shadow-brand/20 active:scale-95 transition-all">REPLICATE BRANCH</button>
                      </div>
                   </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    if (activeModal === 'add') {
                      handleAddTopic(formData);
                    } else if (activeModal === 'edit') {
                      handleEditTopic(formData);
                    }
                  }} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">Module Title</label>
                        <input 
                          name="title"
                          required
                          type="text" 
                          defaultValue={activeModal === "edit" ? modalContext?.title : ""}
                          placeholder="e.g. Distributed Consensus Systems"
                          className="w-full px-4 py-2 bg-slate-50 border border-border-standard rounded-lg text-xs font-black text-text-primary outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all shadow-sm focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">Architectural Rationale</label>
                         <textarea 
                          name="description"
                          defaultValue={activeModal === "edit" ? modalContext?.description : ""}
                          placeholder="Define the strategic objectives for this phase..."
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-50 border border-border-standard rounded-lg text-[11px] font-medium text-text-secondary outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all shadow-sm resize-none focus:bg-white"
                         />
                      </div>
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-border-standard">
                         <input type="checkbox" name="isCountable" id="isCountable" defaultChecked={activeModal === 'edit' ? modalContext?.isCountable : true} className="w-4 h-4 rounded border-border-standard text-brand focus:ring-brand" />
                         <label htmlFor="isCountable" className="text-[10px] font-black text-text-secondary uppercase tracking-widest cursor-pointer">Countable toward mastery progress</label>
                      </div>
                      {activeModal === "add" && (
                         <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-0.5">Parent Module</label>
                            <div className="relative group">
                               <select
                                 name="parentId"
                                 defaultValue={(!modalContext || modalContext.id === 'root') ? '' : modalContext.id}
                                 className="w-full appearance-none px-4 py-2 bg-white border border-border-standard rounded-lg text-[11px] font-black text-brand outline-none focus:ring-4 focus:ring-brand/[0.04] focus:border-brand/40 transition-all pr-10 shadow-sm cursor-pointer"
                               >
                                  <option value="">Top Level (No Parent)</option>
                                  {flattenTopics(roadmapData).map(t => (
                                     <option key={t.id} value={t.id}>{t.title}</option>
                                  ))}
                               </select>
                               <ChevronDown size={14} strokeWidth={3} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none group-focus-within:text-brand" />
                            </div>
                         </div>
                      )}
                    </div>
                    {modalError && (
                      <div className="px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-[0.15em]">
                        {modalError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-1.5 bg-white text-text-secondary font-black text-[9px] uppercase tracking-widest rounded-lg border border-border-standard shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        ABORT
                      </button>
                      <button
                        type="submit"
                        disabled={isModalSubmitting}
                        className="flex-1 py-2.5 bg-brand text-white font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg shadow-brand/20 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
                      >
                        {isModalSubmitting
                          ? (activeModal === 'edit' ? 'UPDATING...' : 'COMMITTING...')
                          : activeModal === "edit"
                            ? (role === "manager" ? "SAVE CHANGES" : "PROPOSE CHANGES")
                            : (role === "manager" ? "COMMIT TO PATH" : "SUBMIT PROPOSAL")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
