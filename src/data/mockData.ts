/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TraineeSpecialization {
  QA = "QA Engineering",
  Developer = "Software Development",
  AIEngineer = "AI Engineering",
  Marketing = "Marketing",
  Design = "Product Design",
}

export enum TopicStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
  Paused = "Paused",
  Skipped = "Skipped",
  NeedsReview = "Needs Review",
}

export enum ResourceType {
  YouTube = "YouTube",
  Article = "Article",
  Course = "Course",
  Documentation = "Documentation",
  GitHub = "GitHub",
  Notes = "Notes",
  Other = "Other",
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  note?: string;
  addedBy: string;
  addedDate: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  status: TopicStatus;
  isCountable: boolean;
  description?: string;
  children?: RoadmapTopic[];
  estimatedHours?: number;
  lastActivity?: string;
  parentId?: string;
  resources?: Resource[];
}

export interface Trainee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: TraineeSpecialization;
  progress: number;
  activeTopic: string;
  lastUpdate: string;
  roadmapStatus: "Active" | "Completed" | "On Hold";
  attentionReason?: string;
}

export interface ChangeRequest {
  id: string;
  traineeId: string;
  traineeName: string;
  action: "Add" | "Edit" | "Delete" | "Move";
  topicName: string;
  description: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  managerNote?: string;
}

export interface ActivityEvent {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "progress" | "approval" | "rejection" | "system";
}

export const mockTrainees: Trainee[] = [
  {
    id: "t1",
    name: "Alex Rivera",
    email: "alex.r@folowise.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    specialization: TraineeSpecialization.Developer,
    progress: 68,
    activeTopic: "Spring Boot Security",
    lastUpdate: "2 hours ago",
    roadmapStatus: "Active",
  },
  {
    id: "t2",
    name: "Sarah Chen",
    email: "sarah.c@folowise.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    specialization: TraineeSpecialization.AIEngineer,
    progress: 45,
    activeTopic: "Transformer Architecture",
    lastUpdate: "5 hours ago",
    roadmapStatus: "Active",
    attentionReason: "Pending review",
  },
  {
    id: "t3",
    name: "Marcus Jordan",
    email: "marcus.j@folowise.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    specialization: TraineeSpecialization.QA,
    progress: 82,
    activeTopic: "Playwright Advanced",
    lastUpdate: "Yesterday",
    roadmapStatus: "Active",
  },
  {
    id: "t4",
    name: "Elena Rodriguez",
    email: "elena.r@folowise.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    specialization: TraineeSpecialization.Marketing,
    progress: 30,
    activeTopic: "Google Ads Optimization",
    lastUpdate: "3 days ago",
    roadmapStatus: "Active",
    attentionReason: "Low progress",
  },
  {
    id: "t5",
    name: "David Kim",
    email: "david.k@folowise.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    specialization: TraineeSpecialization.Developer,
    progress: 15,
    activeTopic: "Java Fundamentals",
    lastUpdate: "1 hour ago",
    roadmapStatus: "Active",
    attentionReason: "Stagnant roadmap",
  },
];

export const mockRoadmap: RoadmapTopic[] = [
  {
    id: "p1",
    title: "Engineering Foundation",
    status: TopicStatus.Completed,
    isCountable: false,
    description: "The essential foundations for modern software development, focusing on core logic and basic toolsets.",
    estimatedHours: 40,
    lastActivity: "2 weeks ago",
    children: [
      { 
        id: "r1-1", 
        title: "Language Core", 
        status: TopicStatus.Completed, 
        isCountable: true, 
        description: "Mastering language syntax and core constructs.",
        children: [
          { id: "r1-1-1", title: "Java Fundamentals", status: TopicStatus.Completed, isCountable: true, resources: [
            { id: "res1", title: "Java 21 Deep Dive", type: ResourceType.YouTube, url: "https://youtube.com/watch?v=java21", addedBy: "Manager", addedDate: "May 1, 2026" }
          ]},
          { id: "r1-1-2", title: "OOP Principles", status: TopicStatus.Completed, isCountable: true }
        ]
      },
      { id: "r1-2", title: "Version Control", status: TopicStatus.Completed, isCountable: true, children: [
        { id: "r1-2-1", title: "Git Basics", status: TopicStatus.Completed, isCountable: true },
        { id: "r1-2-2", title: "GitHub Workflow", status: TopicStatus.Completed, isCountable: true }
      ]},
    ],
  },
  {
    id: "p2",
    title: "Backend Architecture",
    status: TopicStatus.InProgress,
    isCountable: false,
    description: "Building robust, scalable server-side applications using modern frameworks.",
    estimatedHours: 120,
    lastActivity: "Yesterday",
    children: [
      { 
        id: "r2-main", 
        title: "Spring Boot Mastery", 
        status: TopicStatus.InProgress, 
        isCountable: true,
        description: "The primary framework for enterprise-grade applications.",
        children: [
          { 
            id: "r2-1", 
            title: "API Design", 
            status: TopicStatus.Completed, 
            isCountable: true,
            children: [
              { id: "r2-1-1", title: "RESTful Standards", status: TopicStatus.Completed, isCountable: true },
              { id: "r2-1-2", title: "Documentation (OpenAPI)", status: TopicStatus.Completed, isCountable: true, resources: [
                 { id: "res2", title: "Swagger Documentation", type: ResourceType.Documentation, url: "https://swagger.io", addedBy: "Alex Rivera", addedDate: "May 12, 2026" }
              ]}
            ]
          },
          { 
            id: "r2-2", 
            title: "Data Persistence", 
            status: TopicStatus.InProgress, 
            isCountable: true,
            children: [
              { id: "r2-2-1", title: "Spring Data JPA", status: TopicStatus.InProgress, isCountable: true },
              { id: "r2-2-2", title: "Database Migration (Flyway)", status: TopicStatus.NotStarted, isCountable: true }
            ]
          }
        ]
      },
    ],
  },
  {
    id: "p4",
    title: "Frontend Integration",
    status: TopicStatus.NotStarted,
    isCountable: false,
    description: "Modernizing the stack with polished user interfaces.",
    children: [
      { 
        id: "r4-1", 
        title: "React Framework", 
        status: TopicStatus.NotStarted, 
        isCountable: true,
        children: [
          { id: "r4-1-1", title: "State Management", status: TopicStatus.NotStarted, isCountable: true },
          { id: "r4-1-2", title: "Hooks & Lifecycle", status: TopicStatus.NotStarted, isCountable: true }
        ]
      },
      { id: "r4-2", title: "Styling Systems", status: TopicStatus.NotStarted, isCountable: true, children: [
        { id: "r4-2-1", title: "Tailwind CSS", status: TopicStatus.NotStarted, isCountable: true }
      ]},
    ],
  },
];

export const mockChangeRequests: ChangeRequest[] = [
  {
    id: "cr1",
    traineeId: "t1",
    traineeName: "Alex Rivera",
    action: "Add",
    topicName: "Claude Code Masterclass",
    description: "Deep dive into AI-assisted development for Java ecosystems.",
    date: "May 10, 2026",
    status: "Pending",
  },
  {
    id: "cr2",
    traineeId: "t2",
    traineeName: "Sarah Chen",
    action: "Move",
    topicName: "Vector Databases",
    description: "Re-prioritizing from Electives to Core AI architecture.",
    date: "May 09, 2026",
    status: "Pending",
  },
  {
    id: "cr3",
    traineeId: "t5",
    traineeName: "David Kim",
    action: "Delete",
    topicName: "Legacy SOAP APIs",
    description: "No longer relevant for modern greenfield microservices focus.",
    date: "May 11, 2026",
    status: "Rejected",
    managerNote: "Keep this topic for now because it is required before API migration.",
  },
];

export const mockActivity: ActivityEvent[] = [
  { id: "a1", user: "Alex Rivera", action: "marked", target: "Spring Data JPA as Completed", time: "10 mins ago", type: "progress" },
  { id: "a2", user: "Manager", action: "approved", target: "Sarah Chen's request to add LangChain", time: "1 hour ago", type: "approval" },
  { id: "a3", user: "Sarah Chen", action: "requested", target: "structural move for Vector Databases", time: "3 hours ago", type: "progress" },
  { id: "a4", user: "Manager", action: "rejected", target: "David Kim's proposal to skip Git Basics", time: "Yesterday", type: "rejection" },
  { id: "a5", user: "System", action: "initialized", target: "roadmap for Elena Rodriguez", time: "2 days ago", type: "system" },
];
