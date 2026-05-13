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

export interface RoadmapTopic {
  id: string;
  title: string;
  status: TopicStatus;
  isCountable: boolean;
  description?: string;
  children?: RoadmapTopic[];
  estimatedHours?: number;
  lastActivity?: string;
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
    title: "Programming Foundation",
    status: TopicStatus.Completed,
    isCountable: true,
    description: "The essential foundations for modern software development, focusing on core logic and basic toolsets.",
    estimatedHours: 40,
    lastActivity: "2 weeks ago",
    children: [
      { id: "r1-1", title: "Java Fundamentals", status: TopicStatus.Completed, isCountable: true, description: "Mastering Java syntax, JVM architecture, and basic language constructs." },
      { id: "r1-2", title: "Object Oriented Programming", status: TopicStatus.Completed, isCountable: true, description: "Deep dive into classes, inheritance, polymorphism, and encapsulation." },
      { id: "r1-3", title: "Collections Framework", status: TopicStatus.Completed, isCountable: true, description: "Efficient data handling with Lists, Sets, and Maps." },
      { id: "r1-4", title: "Git Basics", status: TopicStatus.Completed, isCountable: true, description: "Version control essentials, branching, and collaboration." },
    ],
  },
  {
    id: "p2",
    title: "Backend Development",
    status: TopicStatus.InProgress,
    isCountable: true,
    description: "Building robust, scalable server-side applications using modern frameworks and best practices.",
    estimatedHours: 120,
    lastActivity: "Yesterday",
    children: [
      { 
        id: "r2-main", 
        title: "Spring Boot Ecosystem", 
        status: TopicStatus.InProgress, 
        isCountable: true,
        description: "The primary framework for enterprise-grade Java applications.",
        children: [
          { 
            id: "r2-1", 
            title: "REST APIs", 
            status: TopicStatus.Completed, 
            isCountable: true,
            description: "Designing and implementing standard RESTful web services.",
            children: [
              { id: "r2-1-1", title: "Controllers", status: TopicStatus.Completed, isCountable: true, description: "Handling HTTP requests and routing." },
              { id: "r2-1-2", title: "Request Mapping", status: TopicStatus.Completed, isCountable: true, description: "Advanced URL routing and path variables." },
              { id: "r2-1-3", title: "Response Structure", status: TopicStatus.Completed, isCountable: true, description: "Standardizing API responses and DTOs." },
              { id: "r2-1-4", title: "Status Codes", status: TopicStatus.Completed, isCountable: true, description: "Correct use of HTTP status codes for various scenarios." },
            ]
          },
          { 
            id: "r2-2", 
            title: "Validation", 
            status: TopicStatus.InProgress, 
            isCountable: true,
            description: "Ensuring data integrity and robust error handling at the entry point.",
            children: [
              { id: "r2-2-1", title: "Bean Validation", status: TopicStatus.InProgress, isCountable: true },
              { id: "r2-2-2", title: "Validation Annotations", status: TopicStatus.InProgress, isCountable: true },
              { id: "r2-2-3", title: "Custom Validators", status: TopicStatus.NotStarted, isCountable: true },
            ]
          },
          { 
            id: "r2-3", 
            title: "Spring Data JPA", 
            status: TopicStatus.InProgress, 
            isCountable: true,
            description: "Seamless database interaction and ORM mapping.",
            children: [
              { id: "r2-3-1", title: "Entities", status: TopicStatus.InProgress, isCountable: true },
              { id: "r2-3-2", title: "Repositories", status: TopicStatus.InProgress, isCountable: true },
              { id: "r2-3-3", title: "Relationships", status: TopicStatus.NotStarted, isCountable: true },
              { id: "r2-3-4", title: "Transactions", status: TopicStatus.NotStarted, isCountable: true },
            ]
          },
        ]
      },
    ],
  },
  {
    id: "p3",
    title: "Security & Production",
    status: TopicStatus.NotStarted,
    isCountable: true,
    description: "Hardening applications and ensuring production-ready reliability and security.",
    children: [
      { id: "p3-1", title: "Spring Security", status: TopicStatus.NotStarted, isCountable: true, description: "Authentication and authorization frameworks.", children: [
        { id: "p3-1-1", title: "Authentication", status: TopicStatus.NotStarted, isCountable: true },
        { id: "p3-1-2", title: "JWT", status: TopicStatus.NotStarted, isCountable: true },
        { id: "p3-1-3", title: "Role-Based Authorization", status: TopicStatus.NotStarted, isCountable: true },
      ] },
      { id: "p3-2", title: "Error Handling", status: TopicStatus.NotStarted, isCountable: true },
      { id: "p3-3", title: "Monitoring", status: TopicStatus.NotStarted, isCountable: true },
    ],
  },
  {
    id: "p4",
    title: "Kotlin Transition",
    status: TopicStatus.NotStarted,
    isCountable: true,
    description: "Modernizing the stack with Kotlin for better productivity and safety.",
    children: [
      { id: "r4-1", title: "Kotlin Syntax", status: TopicStatus.NotStarted, isCountable: true },
      { id: "r4-2", title: "Null Safety", status: TopicStatus.NotStarted, isCountable: true },
      { id: "r4-3", title: "Coroutines", status: TopicStatus.NotStarted, isCountable: true },
    ],
  },
  {
    id: "p5",
    title: "AI-Assisted Development",
    status: TopicStatus.NotStarted,
    isCountable: true,
    description: "Leveraging generative AI to accelerate development and improve code quality.",
    children: [
      { id: "r3-1", title: "Claude Code", status: TopicStatus.NotStarted, isCountable: true },
      { id: "r3-2", title: "AI Code Review", status: TopicStatus.NotStarted, isCountable: true },
      { id: "r3-3", title: "Refactoring with AI", status: TopicStatus.NotStarted, isCountable: true },
    ],
  },
  {
    id: "p6",
    title: "Production Readiness",
    status: TopicStatus.NotStarted,
    isCountable: true,
    description: "Final checks and balances before the application goes live in a high-stakes environment.",
    children: [
      { id: "p6-1", title: "Testing", status: TopicStatus.NotStarted, isCountable: true },
      { id: "p6-2", title: "Logging", status: TopicStatus.NotStarted, isCountable: true },
      { id: "p6-3", title: "Deployment Basics", status: TopicStatus.NotStarted, isCountable: true },
      { id: "p6-4", title: "Performance Review", status: TopicStatus.NotStarted, isCountable: true },
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
