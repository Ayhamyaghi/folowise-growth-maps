# Folowise Growth Maps

Folowise Growth Maps is a high-fidelity frontend prototype for managing individualized trainee learning roadmaps inside an internal training environment. The application is designed around a manager-led workflow where each trainee can have a personalized roadmap, topic-level progress tracking, structured learning resources, and a controlled approval process for roadmap changes.

The current repository implements a polished React-based prototype using mock data, role-based UI flows, animated dashboard experiences, hierarchical roadmap visualization, change-request handling, trainee management, account views, and activity tracking.

This project should be understood as a product and UX foundation for a future production-grade roadmap management platform, not yet as a complete full-stack production system.

---

## Executive Summary

Folowise Growth Maps addresses a common operational problem in internship, trainee, and internal upskilling programs: every trainee progresses differently, but many organizations still manage learning paths through static documents, spreadsheets, chat messages, or generic roadmap templates.

This application introduces a structured alternative.

Instead of forcing all trainees into one fixed curriculum, Folowise Growth Maps models learning as a personalized, hierarchical roadmap that can evolve over time. Managers can monitor trainee progress, inspect roadmap structure, review pending changes, and maintain accountability through an activity log. Trainees can view their own roadmap, track progress, and request structural changes without directly mutating the approved learning path.

The result is a controlled but flexible roadmap system that balances autonomy, visibility, governance, and operational clarity.

---

## Product Purpose

The primary purpose of Folowise Growth Maps is to help a manager oversee individualized learning paths for trainees across different specializations.

The system is designed to support:

- Personalized roadmap planning.
- Hierarchical topic organization.
- Topic-level progress tracking.
- Manager review of trainee progress.
- Trainee-specific roadmap visibility.
- Change requests for roadmap structure updates.
- Activity logging for important actions.
- Account and trainee management.
- Resource attachment per roadmap topic.
- A polished internal SaaS-style user experience.

The product is especially suitable for teams where trainees may belong to different tracks such as:

- Software Development
- QA Engineering
- AI Engineering
- Marketing
- Product Design
- Future specializations added by the organization

The current mock data includes these specializations, but the product concept should not be limited to them.

---

## Current Implementation Status

This repository is currently a frontend-first prototype.

It includes:

- React 19 application structure.
- Vite-based development environment.
- TypeScript implementation.
- React Router-based navigation.
- Role-based manager and trainee views.
- Mock authentication through role selection.
- Mock trainee, roadmap, change request, and activity data.
- Manager dashboard.
- Trainee dashboard.
- Trainee registry.
- Trainee profile page.
- Hierarchical roadmap page.
- Change request page.
- Activity log page.
- Account management page.
- Premium SaaS-style UI built with Tailwind CSS.
- Page transitions and animations using Motion.
- Icon system using lucide-react.
- Utility class composition using clsx and tailwind-merge.

It does not currently include:

- Real backend API integration.
- Persistent database.
- Production authentication.
- Server-side authorization.
- Real account credentials.
- Server-side roadmap mutation logic.
- Approval workflow persistence.
- File upload or resource storage.
- Audit log persistence.
- Automated tests.
- CI/CD pipeline.
- Production deployment configuration.

The current implementation should be treated as a strong product prototype and UI architecture baseline.

---

## Technology Stack

### Core Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4

### UI and Styling

- Tailwind CSS theme tokens
- Custom design tokens in `src/index.css`
- lucide-react icons
- motion animations
- clsx
- tailwind-merge

### Data and State

- Mock data stored in `src/data/mockData.ts`
- Local React state for prototype authentication
- Derived UI state inside pages
- No external server-state management yet

### Build and Tooling

- npm
- Vite development server
- TypeScript compiler validation

### Notable Dependencies

The project currently includes the following major dependencies:

- `react`
- `react-dom`
- `react-router-dom`
- `vite`
- `typescript`
- `tailwindcss`
- `@tailwindcss/vite`
- `lucide-react`
- `motion`
- `recharts`
- `clsx`
- `tailwind-merge`
- `@google/genai`
- `dotenv`
- `express`

Some dependencies, such as `@google/genai`, `dotenv`, and `express`, appear to be inherited from the original AI Studio template or intended for future expansion. They are not central to the current frontend roadmap workflow.

---

## Repository Structure

```text
.
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components
    │   └── Sidebar.tsx
    ├── data
    │   └── mockData.ts
    ├── lib
    │   └── utils.ts
    └── pages
        ├── AccountsPage.tsx
        ├── ActivityPage.tsx
        ├── DashboardPage.tsx
        ├── LoginPage.tsx
        ├── RequestsPage.tsx
        ├── RoadmapPage.tsx
        ├── TraineeProfilePage.tsx
        └── TraineesPage.tsx
```

---

## Application Architecture

The current architecture is intentionally lightweight and optimized for rapid prototyping.

At a high level:

```text
App.tsx
  ├── Auth Context
  ├── Router
  ├── Protected Route Wrapper
  ├── Dashboard Layout
  └── Page Routes

src/pages
  ├── Manager-facing pages
  ├── Trainee-facing pages
  └── Shared role-aware pages

src/data/mockData.ts
  ├── Trainees
  ├── Roadmap topics
  ├── Change requests
  └── Activity events

src/components
  └── Shared layout/navigation components

src/lib
  └── Utility helpers
```

The application currently uses `App.tsx` as the composition root for:

- Auth context.
- Role state.
- Route declarations.
- Protected route behavior.
- Dashboard shell layout.
- Animated route transitions.

This is acceptable at the prototype stage. For production, responsibility should be split into dedicated modules for routing, authentication, layout, feature domains, API access, and shared UI primitives.

---

## Domain Model

The project currently defines the core domain model inside `src/data/mockData.ts`.

The most important domain concepts are:

- Trainee
- RoadmapTopic
- Resource
- ChangeRequest
- ActivityEvent

---

## Trainee Model

A trainee represents a person enrolled in an internal learning track.

Current fields:

```text
id
name
email
avatar
specialization
progress
activeTopic
lastUpdate
roadmapStatus
attentionReason
```

Supported roadmap statuses:

```text
Active
Completed
On Hold
```

The `attentionReason` field allows the system to flag trainees who need manager review, such as low progress, pending review, or stagnant roadmap activity.

In production, this model should likely evolve into:

```text
id
fullName
email
avatarUrl
specializationId
status
progressSnapshot
activeRoadmapId
createdAt
updatedAt
lastActivityAt
createdBy
deactivatedAt
deactivatedBy
```

---

## Specialization Model

The current implementation uses a TypeScript enum for trainee specializations:

```text
QA Engineering
Software Development
AI Engineering
Marketing
Product Design
```

This is suitable for a prototype.

In production, specializations should not be hard-coded in frontend enums. They should be represented as database-managed records or backend-provided configuration.

Recommended production model:

```text
specializations
  id
  name
  description
  isActive
  createdAt
  updatedAt
```

This makes the platform extensible without requiring frontend deployments whenever a new training track is introduced.

---

## Roadmap Topic Model

A roadmap topic represents a node inside a hierarchical roadmap tree.

Current fields:

```text
id
title
status
isCountable
description
children
estimatedHours
lastActivity
parentId
resources
```

Supported topic statuses:

```text
Not Started
In Progress
Completed
Paused
Skipped
Needs Review
```

Important design detail:

The roadmap supports parent-child hierarchy through the `children` field. This means the roadmap is not a flat checklist. It is a structured learning tree where topics can contain nested subtopics.

The `isCountable` field is important because not every node should contribute to progress calculation. Parent categories such as `Engineering Foundation` or `Backend Architecture` may organize the roadmap but should not always count as progress-bearing work items.

This is a strong architectural signal because it separates structural nodes from measurable learning units.

---

## Resource Model

A resource represents learning material attached to a roadmap topic.

Current fields:

```text
id
title
type
url
note
addedBy
addedDate
```

Supported resource types:

```text
YouTube
Article
Course
Documentation
GitHub
Notes
Other
```

This model allows each roadmap topic to become actionable rather than purely descriptive.

Examples of resources include:

- YouTube videos.
- Technical articles.
- Courses.
- Official documentation.
- GitHub repositories.
- Internal notes.
- Other custom resources.

In production, resources should be persisted independently and associated with roadmap topics through a relational mapping.

---

## Change Request Model

A change request represents a proposed structural modification to a roadmap.

Current fields:

```text
id
traineeId
traineeName
action
topicName
description
date
status
managerNote
```

Supported actions:

```text
Add
Edit
Delete
Move
```

Supported statuses:

```text
Pending
Approved
Rejected
```

This is one of the most important parts of the product design.

The system separates progress updates from structural roadmap changes. A trainee may be allowed to update learning progress directly, but changes to roadmap structure should go through manager approval.

This prevents uncontrolled roadmap drift while still allowing trainees to suggest relevant improvements.

---

## Activity Event Model

An activity event represents a historical record of something important that happened in the system.

Current fields:

```text
id
user
action
target
time
type
```

Supported activity types:

```text
progress
approval
rejection
system
```

Activity logging is critical for a system like this because roadmap changes, approvals, rejections, and progress updates should be traceable.

The current implementation uses mock activity data. In production, this should become a real audit trail persisted by the backend.

---

## Role Model

The application currently supports two roles:

```text
manager
trainee
```

The selected role is stored in local React state through a prototype auth context.

### Manager

A manager can access:

- Dashboard
- Trainees
- Roadmaps
- Change Requests
- Activity Log
- Accounts

The manager experience is designed around oversight, review, and governance.

### Trainee

A trainee can access:

- Dashboard
- My Roadmap
- My Requests
- My Account

The trainee experience is intentionally scoped to the trainee's own learning journey.

Important:

The current role protection is frontend-only and should not be treated as real security.

In production, roles must be enforced by the backend through authenticated sessions or tokens and server-side authorization checks.

---

## Routing Model

The application uses React Router and defines the following routes:

```text
/login
/
/trainees
/trainee/:id
/roadmap/:id
/requests
/activity
/accounts
```

Route behavior:

- `/login` renders the public login and role-selection page.
- `/` renders the dashboard.
- `/trainees` renders the trainee registry.
- `/trainee/:id` renders an individual trainee profile.
- `/roadmap/:id` renders a roadmap view.
- `/requests` renders change requests.
- `/activity` renders activity history.
- `/accounts` renders role-aware account views.
- Unknown routes redirect to `/`.

Authenticated pages are wrapped with a protected route component.

Current protection logic:

```text
If no role exists:
  redirect to /login

If role exists:
  render the dashboard layout
```

This is appropriate for a prototype but must be replaced with real authentication and authorization in production.

---

## Page-Level Overview

### Login Page

The login page provides a polished landing and authentication entry experience.

Current behavior:

- Presents the product positioning.
- Shows a premium SaaS-style hero section.
- Allows the user to select a manager or trainee workspace.
- Calls the prototype `login(role)` function.
- Redirects to the application dashboard.

This page is not a real login implementation. It is a role-selection mechanism for prototype navigation.

Production requirements:

- Email/password login.
- Session or JWT handling.
- Account status checks.
- Role retrieval from backend.
- Secure logout.
- Error handling.
- Rate limiting.
- Optional SSO later.

---

### Dashboard Page

The dashboard page is role-aware.

For managers, it provides operational visibility across trainees and roadmap activity.

Manager dashboard responsibilities:

- Show overall trainee progress.
- Surface trainees requiring attention.
- Display recent activity.
- Highlight pending change requests.
- Provide quick access to core manager workflows.

For trainees, it provides a personalized learning overview.

Trainee dashboard responsibilities:

- Show personal progress.
- Display current roadmap status.
- Highlight recently completed topics.
- Provide access to the trainee’s roadmap and requests.

This split is important because manager and trainee dashboards serve different decision-making needs.

---

### Trainees Page

The trainees page acts as the manager-facing registry of all trainees.

Current capabilities:

- List trainees.
- Search or filter trainees through local UI state.
- Display specialization.
- Display progress.
- Display active topic.
- Display attention reason.
- Link to trainee profile.
- Link to trainee roadmap.

This page is the operational entry point for manager review.

Production improvements should include:

- Server-side pagination.
- Filtering by specialization.
- Filtering by progress range.
- Filtering by status.
- Sorting by last activity.
- Searching by name or email.
- Bulk actions if needed.

---

### Trainee Profile Page

The trainee profile page provides a more detailed view of an individual trainee.

Current capabilities:

- Shows trainee identity.
- Shows specialization.
- Shows email.
- Shows progress.
- Links to the trainee roadmap.
- Presents profile-style metrics and contextual information.

In production, this page should become the manager’s single source of truth for one trainee.

Recommended future sections:

- Active roadmap summary.
- Progress trend.
- Pending requests.
- Recently completed topics.
- Manager notes.
- Activity timeline.
- Account status.
- Assigned specialization.
- Historical roadmap snapshots.

---

### Roadmap Page

The roadmap page is the core experience of the product.

It displays a hierarchical roadmap using nested roadmap topics.

Current capabilities:

- Render a roadmap tree.
- Show topic status.
- Show countable and non-countable topics.
- Show topic resources.
- Support manager and trainee role variations.
- Open modals for roadmap operations.
- Present roadmap details in a polished visual style.

Important roadmap concepts:

- Parent-child hierarchy.
- Topic status.
- Countable progress units.
- Resource attachments.
- Structural operations such as add, edit, delete, and move.
- Different authority levels for manager and trainee roles.

This page represents the central product differentiator.

The roadmap is not merely a checklist. It is a governed learning structure that can evolve per trainee.

---

### Requests Page

The requests page handles roadmap change governance.

Current behavior:

- Manager view shows change requests across trainees.
- Trainee view shows the trainee’s own requests.
- Requests include action type, topic name, description, status, and optional manager note.
- Manager can conceptually approve or reject pending changes through the UI flow.

The approval model is essential because it allows trainees to participate in roadmap evolution without compromising the manager’s control over the official learning plan.

Production implementation should ensure that approved requests are applied transactionally to the roadmap tree.

---

### Activity Page

The activity page provides a manager-facing log of important roadmap events.

Current behavior:

- Displays activity records in a table.
- Supports visual classification by event type.
- Includes search and filter UI affordances.
- Includes export/date action buttons as prototype controls.

In production, this should become a real audit log.

Recommended activity events:

- Roadmap created.
- Roadmap copied.
- Topic added.
- Topic edited.
- Topic deleted.
- Topic moved.
- Topic marked completed.
- Topic paused.
- Change request created.
- Change request approved.
- Change request rejected.
- Resource attached.
- Account created.
- Account deactivated.

---

### Accounts Page

The accounts page is role-aware.

For managers, it displays:

- Manager account section.
- Trainee account overview.
- Active directory of trainee accounts.
- Account management controls.

For trainees, it displays:

- Personal account identity.
- Profile details.
- Account status.
- Specialization or unit information.
- Personal progress indicator.

This split correctly reflects the expected data-access model:

- Managers can manage or inspect trainee accounts.
- Trainees should only see their own account information.

Production implementation should enforce this server-side.

---

## Design System and UI Direction

The project uses a premium internal SaaS visual language.

Design characteristics:

- Soft application background.
- White elevated cards.
- Subtle borders.
- Rounded corners.
- Small uppercase operational labels.
- Strong typographic hierarchy.
- Space Grotesk for display typography.
- Inter for body typography.
- Brand-centered accent color.
- Status-specific visual tokens.
- Motion-based page transitions.
- Clean manager dashboard aesthetics.

Tailwind theme tokens are defined in `src/index.css`.

Key token categories:

- Brand colors.
- App surfaces.
- Sidebar surfaces.
- Card surfaces.
- Border colors.
- Typography colors.
- Status colors.
- Status backgrounds.
- Shadows.
- Transition timing.

This is a good direction for an internal tool because it feels professional without becoming visually noisy.

---

## Current Styling Foundation

The styling layer defines custom tokens such as:

```text
--color-brand
--color-brand-hover
--color-background-app
--color-surface-sidebar
--color-surface-card
--color-surface-secondary
--color-surface-soft
--color-border-subtle
--color-border-standard
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-status-success
--color-status-pending
--color-status-danger
--color-status-info
--color-bg-success
--color-bg-pending
--color-bg-danger
--color-bg-info
--color-bg-brand-soft
--color-bg-nav-active
```

Reusable utility patterns include:

```text
glass
card-elevation
text-premium
custom-scrollbar
roadmap-branch-line
```

This is a strong starting point, but production UI should eventually extract more reusable primitives.

Recommended future UI primitives:

- Button
- Input
- Select
- Badge
- Card
- Modal
- Table
- EmptyState
- PageHeader
- ProgressBar
- StatusPill
- Avatar
- ConfirmDialog
- RoadmapNode
- ResourceList
- RequestStatusBadge

---

## Running the Project Locally

### Prerequisites

```text
Node.js
npm
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The Vite development server is configured to run on:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run lint
```

Note:

The current `lint` script runs TypeScript validation:

```bash
tsc --noEmit
```

It is not currently configured as a full ESLint pipeline.

---

## Available Scripts

The project currently defines the following npm scripts:

```json
{
  "dev": "vite --port=3000 --host=0.0.0.0",
  "build": "vite build",
  "preview": "vite preview",
  "clean": "rm -rf dist",
  "lint": "tsc --noEmit"
}
```

### Script Responsibilities

- `npm run dev`
  - Starts the local Vite development server.

- `npm run build`
  - Generates the production build.

- `npm run preview`
  - Serves the production build locally for preview.

- `npm run clean`
  - Removes the `dist` directory.

- `npm run lint`
  - Runs TypeScript validation using `tsc --noEmit`.

---

## Environment Variables

The repository includes an `.env.example` file and the Vite configuration exposes:

```text
GEMINI_API_KEY
```

through:

```text
process.env.GEMINI_API_KEY
```

The current implementation does not appear to depend on Gemini functionality for the core roadmap workflow.

This likely comes from the original AI Studio project template.

Before production hardening, environment usage should be reviewed.

Recommended frontend environment variables:

```text
VITE_API_BASE_URL
VITE_APP_ENV
VITE_APP_VERSION
VITE_SENTRY_DSN
```

Important:

Do not expose server-side secrets through Vite environment variables. Anything shipped to the browser must be treated as public.

---

## Current Limitations

The current prototype has several intentional limitations.

### Authentication Is Mocked

The application uses role selection instead of real credentials.

Current behavior:

```text
Select manager or trainee
Set local role state
Navigate into the app
```

Production behavior should include:

- Login with credentials.
- Secure password hashing.
- Token or session management.
- Backend-provided user identity.
- Backend-provided roles.
- Logout invalidation.
- Account status enforcement.

---

### Authorization Is Frontend-Only

The current app hides or shows navigation based on the selected role.

This is useful for prototyping but not secure.

Production must enforce authorization at the API level.

A trainee should not be able to access:

- Other trainees.
- Manager dashboard data.
- Global activity logs.
- Account management.
- Other trainees’ roadmaps.
- Other trainees’ change requests.

---

### Data Is Mocked

All core data is currently loaded from `mockData.ts`.

This includes:

- Trainees.
- Roadmap topics.
- Resources.
- Change requests.
- Activity events.

Production requires:

- Database persistence.
- Backend APIs.
- Server-side validation.
- Server-side ownership checks.
- Transactional roadmap mutations.
- Persistent audit logging.

---

### Roadmap Mutations Are Not Persisted

The UI models roadmap operations, but a production system must implement these operations safely.

Important roadmap operations:

- Add topic.
- Edit topic.
- Delete topic.
- Move topic.
- Mark topic completed.
- Pause topic.
- Skip topic.
- Attach resource.
- Copy roadmap.
- Copy branch.
- Approve structural request.
- Reject structural request.

These operations should be implemented as transactional backend use cases.

---

### Change Requests Are Mocked

The change request workflow is conceptually present but not backed by real state transitions.

Production requirements:

- Persist request creation.
- Validate requested action.
- Store before and after payloads.
- Allow manager approval or rejection.
- Apply approved changes transactionally.
- Preserve rejected request history.
- Record manager notes.
- Write audit log events.

---

### Activity Log Is Mocked

The activity page shows a strong UX direction, but it does not yet represent real auditability.

Production requirements:

- Append-only activity or audit records.
- Actor identification.
- Entity type.
- Entity ID.
- Action type.
- Metadata payload.
- Timestamp.
- Optional IP or device metadata for sensitive actions.

---

## Recommended Production Architecture

A production implementation should use a clear client-server architecture.

```text
React Frontend
  ↓
REST API
  ↓
Backend Application Layer
  ↓
Domain Services
  ↓
Database
  ↓
Audit Log / Storage
```

Recommended backend stack:

```text
Kotlin
Spring Boot
Spring Security
Spring Data JPA
PostgreSQL
Flyway
OpenAPI
JWT or secure session cookies
Object storage for uploaded resources if needed
```

Recommended frontend stack evolution:

```text
React
TypeScript
Vite
React Router
TanStack Query
Zod or Valibot
Tailwind CSS
React Hook Form
MSW for API mocks
Vitest
Playwright
```

---

## Recommended Frontend Refactor

As the application grows, the current flat page structure should evolve into feature modules.

Recommended structure:

```text
src
├── app
│   ├── router
│   ├── providers
│   ├── layout
│   └── config
├── features
│   ├── auth
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   └── types
│   ├── dashboard
│   │   ├── components
│   │   └── pages
│   ├── trainees
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   └── types
│   ├── roadmaps
│   │   ├── api
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   ├── tree
│   │   └── types
│   ├── requests
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   └── types
│   ├── activity
│   │   ├── api
│   │   ├── pages
│   │   └── types
│   └── accounts
│       ├── api
│       ├── pages
│       └── types
├── shared
│   ├── api
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── types
│   ├── utils
│   └── validation
└── styles
```

This structure keeps each domain isolated while preserving shared primitives.

---

## Recommended Backend Structure

A production backend could follow this package structure:

```text
src/main/kotlin
└── com/folowise/growthmaps
    ├── auth
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   ├── dto
    │   └── security
    ├── users
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   ├── repository
    │   └── dto
    ├── trainees
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   ├── repository
    │   └── dto
    ├── specializations
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   └── repository
    ├── roadmaps
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   ├── repository
    │   ├── tree
    │   └── dto
    ├── roadmaprequests
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   ├── repository
    │   └── dto
    ├── resources
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   └── repository
    ├── activity
    │   ├── controller
    │   ├── service
    │   ├── domain
    │   └── repository
    ├── common
    │   ├── error
    │   ├── security
    │   ├── validation
    │   ├── pagination
    │   └── web
    └── config
```

The backend should treat roadmap mutation as a domain problem, not a controller-level CRUD operation.

---

## Recommended API Surface

### Auth

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

### Trainees

```text
GET    /api/v1/trainees
POST   /api/v1/trainees
GET    /api/v1/trainees/{traineeId}
PUT    /api/v1/trainees/{traineeId}
PATCH  /api/v1/trainees/{traineeId}/status
```

### Specializations

```text
GET    /api/v1/specializations
POST   /api/v1/specializations
PUT    /api/v1/specializations/{specializationId}
PATCH  /api/v1/specializations/{specializationId}/status
```

### Roadmaps

```text
GET    /api/v1/roadmaps/{roadmapId}
GET    /api/v1/trainees/{traineeId}/roadmap
POST   /api/v1/trainees/{traineeId}/roadmap
PUT    /api/v1/roadmaps/{roadmapId}
POST   /api/v1/roadmaps/{roadmapId}/copy
POST   /api/v1/roadmaps/{roadmapId}/branches/{topicId}/copy
```

### Roadmap Topics

```text
POST   /api/v1/roadmaps/{roadmapId}/topics
PUT    /api/v1/roadmaps/{roadmapId}/topics/{topicId}
DELETE /api/v1/roadmaps/{roadmapId}/topics/{topicId}
PATCH  /api/v1/roadmaps/{roadmapId}/topics/{topicId}/status
PATCH  /api/v1/roadmaps/{roadmapId}/topics/{topicId}/move
```

### Topic Resources

```text
POST   /api/v1/topics/{topicId}/resources
PUT    /api/v1/topics/{topicId}/resources/{resourceId}
DELETE /api/v1/topics/{topicId}/resources/{resourceId}
```

### Change Requests

```text
GET    /api/v1/change-requests
GET    /api/v1/change-requests/my
POST   /api/v1/change-requests
POST   /api/v1/change-requests/{requestId}/approve
POST   /api/v1/change-requests/{requestId}/reject
```

### Activity

```text
GET    /api/v1/activity
GET    /api/v1/trainees/{traineeId}/activity
GET    /api/v1/roadmaps/{roadmapId}/activity
```

### Accounts

```text
GET    /api/v1/accounts
POST   /api/v1/accounts
PATCH  /api/v1/accounts/{accountId}/status
PATCH  /api/v1/accounts/{accountId}/role
```

---

## Recommended Database Model

### users

```text
id
full_name
email
password_hash
role
status
created_at
updated_at
last_login_at
created_by
deactivated_at
deactivated_by
```

### trainees

```text
id
user_id
specialization_id
avatar_url
status
created_at
updated_at
last_activity_at
```

### specializations

```text
id
name
description
is_active
created_at
updated_at
```

### roadmaps

```text
id
trainee_id
title
status
version
created_at
updated_at
created_by
```

### roadmap_topics

```text
id
roadmap_id
parent_id
title
description
status
is_countable
sort_order
estimated_hours
created_at
updated_at
last_activity_at
```

### topic_resources

```text
id
topic_id
title
type
url
note
added_by
created_at
updated_at
```

### change_requests

```text
id
trainee_id
roadmap_id
topic_id
action
status
payload
description
manager_note
created_at
reviewed_at
reviewed_by
```

### activity_events

```text
id
actor_user_id
event_type
entity_type
entity_id
target_label
metadata
created_at
```

---

## Roadmap Tree Persistence Strategy

The roadmap is hierarchical, so the database must support parent-child relationships.

Recommended initial approach:

```text
Adjacency List
```

Each topic stores:

```text
id
parent_id
roadmap_id
sort_order
```

Advantages:

- Simple to implement.
- Easy to understand.
- Works well for moderate tree sizes.
- Compatible with JPA.
- Easy to move nodes by changing `parent_id` and `sort_order`.

Potential future alternatives:

```text
Materialized Path
Closure Table
Nested Set
```

For this product, adjacency list is sufficient unless roadmaps become very deep, require complex subtree analytics, or need high-performance ancestor and descendant queries at scale.

---

## Progress Calculation

Progress should be calculated automatically from roadmap topics.

Recommended rule:

```text
completed_countable_topics / total_countable_topics * 100
```

Only topics where:

```text
is_countable = true
```

should contribute to progress.

Recommended status handling:

```text
Completed     -> counts as completed
Not Started   -> counts as incomplete
In Progress   -> counts as incomplete
Needs Review  -> counts as incomplete
Paused        -> depends on product decision
Skipped       -> should usually be excluded or handled explicitly
```

A robust implementation should avoid storing progress as the primary source of truth. Progress can be computed dynamically or stored as a denormalized snapshot updated after roadmap changes.

Recommended approach:

- Store topic statuses as truth.
- Compute progress from countable topics.
- Optionally cache progress on roadmap or trainee for fast dashboards.
- Recalculate progress when topic status or countability changes.

---

## Change Request Application Model

The approval workflow should be transactional.

Recommended flow:

```text
Trainee submits structural change request
  ↓
System validates requested operation
  ↓
Request stored as Pending
  ↓
Manager reviews request
  ↓
Manager approves or rejects
  ↓
If approved:
    apply roadmap mutation inside transaction
    mark request Approved
    write activity event
  ↓
If rejected:
    mark request Rejected
    store manager note
    write activity event
```

Important:

A change request should store enough payload to apply the operation later.

Example payload for adding a topic:

```json
{
  "parentTopicId": "topic-123",
  "title": "Claude Code Masterclass",
  "description": "AI-assisted development workflow",
  "isCountable": true,
  "estimatedHours": 12,
  "sortOrder": 4
}
```

Example payload for moving a topic:

```json
{
  "topicId": "topic-123",
  "newParentTopicId": "topic-456",
  "newSortOrder": 2
}
```

This makes approvals deterministic and auditable.

---

## Security Considerations

The current project is not secure because authentication and authorization are mocked.

Production security requirements:

- Password hashing using Argon2id or BCrypt.
- Server-side authentication.
- Server-side authorization.
- Role-based access control.
- Trainee ownership checks.
- Manager-only administrative endpoints.
- Secure session or JWT handling.
- Token expiration.
- Refresh token rotation if JWT is used.
- Protected API routes.
- Secure CORS configuration.
- Input validation.
- Output sanitization where needed.
- Rate limiting on authentication endpoints.
- Audit logging for sensitive operations.
- No secrets in frontend code.
- No direct trust in frontend role state.

Frontend checks should be treated as UX only. The backend must be the authority.

---

## Authorization Matrix

### Manager

A manager can:

```text
View all trainees
View all roadmaps
Create roadmaps
Edit any trainee roadmap
Approve change requests
Reject change requests
View activity log
Manage trainee accounts
View dashboard metrics
Attach resources
Copy roadmaps
Copy roadmap branches
```

### Trainee

A trainee can:

```text
View own dashboard
View own roadmap
Update own topic progress
Create own change requests
View own change requests
View own account
Attach suggested resources if allowed
```

A trainee must not be able to:

```text
View other trainees
View other roadmaps
Access manager dashboard
Approve requests
Reject requests
Manage accounts
Edit roadmap structure directly without approval
View global activity log
```

---

## Validation Rules

### Trainee Validation

```text
name is required
email is required
email must be unique
specialization is required
status must be valid
role must be valid
```

### Roadmap Validation

```text
roadmap must belong to one trainee
only one active roadmap should exist per trainee
title is required
status must be valid
roadmap version should be incremented on structural changes
```

### Topic Validation

```text
title is required
status must be valid
isCountable is required
parent topic must belong to the same roadmap
topic cannot be moved under itself
topic cannot be moved under one of its descendants
delete operation must include descendants
sort order must be valid
```

### Change Request Validation

```text
action is required
action must be Add, Edit, Delete, or Move
request must belong to requesting trainee
payload must match action type
pending request cannot be approved twice
rejected request cannot be approved later without reopening
manager note should be allowed on rejection
```

### Resource Validation

```text
title is required
type is required
url should be validated when provided
resource must belong to an existing topic
topic must belong to accessible roadmap
```

---

## Error Handling

A production API should expose consistent error responses.

Recommended error format:

```json
{
  "timestamp": "2026-05-20T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "code": "ROADMAP_VALIDATION_FAILED",
  "message": "Roadmap validation failed.",
  "details": [
    {
      "field": "title",
      "message": "Topic title is required."
    }
  ]
}
```

Recommended error categories:

```text
AUTHENTICATION_REQUIRED
ACCESS_DENIED
VALIDATION_FAILED
RESOURCE_NOT_FOUND
DUPLICATE_RESOURCE
INVALID_ROADMAP_OPERATION
CHANGE_REQUEST_ALREADY_REVIEWED
INTERNAL_SERVER_ERROR
```

The frontend should map these errors into user-friendly messages without exposing backend internals.

---

## Testing Strategy

The current repository does not include a complete automated testing setup.

A production version should include frontend, backend, and end-to-end tests.

### Frontend Tests

Recommended coverage:

```text
Login role flow
Protected route behavior
Manager dashboard rendering
Trainee dashboard rendering
Trainee registry filtering
Roadmap tree rendering
Topic status display
Resource rendering
Change request list
Manager request review UI
Trainee account view
Manager account view
Sidebar role filtering
```

Recommended tools:

```text
Vitest
React Testing Library
MSW
Playwright
```

### Backend Tests

Recommended coverage:

```text
Authentication service
Authorization rules
Roadmap creation
Roadmap topic creation
Roadmap topic move validation
Roadmap topic delete with descendants
Progress calculation
Change request creation
Change request approval
Change request rejection
Activity event writing
Trainee isolation
Manager-only endpoints
```

Recommended tools:

```text
JUnit 5
Spring Boot Test
Testcontainers
MockMvc
ArchUnit
```

### End-to-End Tests

Recommended flows:

```text
Manager logs in and views dashboard
Manager opens trainee profile
Manager views trainee roadmap
Trainee logs in and views own roadmap
Trainee updates topic progress
Trainee submits change request
Manager approves change request
Approved change appears in roadmap
Manager rejects change request with note
Trainee sees rejected request
Trainee cannot access manager routes
```

---

## Observability and Auditability

This product should be designed as an accountable internal management system.

Recommended observability features:

```text
Structured application logs
Request correlation IDs
Error tracking
Frontend error boundary
API latency metrics
Authentication event logging
Roadmap mutation logging
Change request lifecycle logging
Account management logging
```

Recommended audit events:

```text
USER_LOGIN
USER_LOGOUT
TRAINEE_CREATED
TRAINEE_UPDATED
ACCOUNT_DEACTIVATED
ROADMAP_CREATED
ROADMAP_COPIED
TOPIC_CREATED
TOPIC_UPDATED
TOPIC_DELETED
TOPIC_MOVED
TOPIC_STATUS_CHANGED
RESOURCE_ADDED
CHANGE_REQUEST_CREATED
CHANGE_REQUEST_APPROVED
CHANGE_REQUEST_REJECTED
```

Audit logging should be append-only and should not be silently editable by normal application flows.

---

## Production Readiness Checklist

Before this application can be considered production-ready, the following should be completed:

```text
Real authentication implemented
Server-side authorization implemented
Database schema created
Flyway migrations added
Mock data replaced with API integration
Roadmap tree persisted
Topic operations implemented transactionally
Change request approval flow persisted
Activity log persisted
Progress calculation moved to backend
Trainee isolation enforced server-side
Manager-only actions protected server-side
Input validation implemented
Consistent API error handling added
Frontend API client added
Loading and error states added
Pagination added to large lists
Search and filtering backed by API where needed
Automated frontend tests added
Automated backend tests added
End-to-end tests added
CI pipeline configured
Production environment variables documented
Deployment pipeline defined
Monitoring configured
Audit logging implemented
Security review completed
```

---

## Recommended Implementation Roadmap

### Phase 1: Frontend Stabilization

```text
Clean current structure
Extract reusable UI components
Move routing into app/router
Move auth into feature/auth
Create typed domain models outside mockData
Add form validation
Add empty, loading, and error states
Add frontend tests for critical flows
```

### Phase 2: Backend Foundation

```text
Create Spring Boot backend
Add PostgreSQL
Add Flyway migrations
Implement users and roles
Implement authentication
Implement authorization
Add global exception handling
Add OpenAPI documentation
```

### Phase 3: Roadmap Core

```text
Create roadmap tables
Create topic hierarchy model
Implement topic CRUD
Implement topic move operation
Implement subtree delete operation
Implement progress calculation
Expose roadmap query endpoints
```

### Phase 4: Change Request Workflow

```text
Create change request model
Implement request creation
Implement manager approval
Implement manager rejection
Apply approved changes transactionally
Add activity events for request lifecycle
```

### Phase 5: Manager Operations

```text
Implement trainee registry API
Implement trainee profile API
Implement dashboard metrics
Implement account management
Implement activity log filters
```

### Phase 6: Production Hardening

```text
Add automated tests
Add CI/CD
Add monitoring
Add structured logging
Add security hardening
Add deployment documentation
Add backup strategy
Add production configuration
```

---

## Engineering Risks

### Tree Mutation Complexity

Roadmap trees introduce edge cases that flat CRUD systems do not have.

Examples:

```text
Moving a topic under itself
Moving a topic under its descendant
Deleting a topic with children
Copying a branch with nested descendants
Maintaining sort order
Avoiding orphaned topics
Maintaining progress correctness
```

This logic should be centralized in a roadmap domain service.

---

### Approval Workflow Consistency

Approving a change request should not be a simple status update.

It must:

```text
Validate request is still applicable
Apply roadmap mutation
Update request status
Write activity event
Commit all changes atomically
```

If any step fails, the transaction should roll back.

---

### Frontend Role Leakage

The current UI role filtering is useful but not sufficient.

Production must assume users can manually call APIs.

Every backend endpoint must validate:

```text
Who is the user?
What role do they have?
What entity are they accessing?
Do they own it or have authority over it?
```

---

### Progress Calculation Drift

If progress is stored directly and updated manually, it can become inconsistent.

Recommended approach:

```text
Topic status is source of truth
Progress is computed or recalculated after mutations
Cached progress is treated as derived data
```

---

## Code Quality Assessment

The current implementation is strong for a prototype because it clearly expresses:

- The target user experience.
- The manager and trainee role separation.
- The roadmap hierarchy concept.
- The change request governance model.
- The intended product direction.
- A professional SaaS-like visual language.

However, the next engineering phase should avoid simply adding more UI on top of mock data.

The project should now move toward:

- Feature-based frontend boundaries.
- Typed API contracts.
- Backend domain modeling.
- Persistent storage.
- Real authentication and authorization.
- Transactional roadmap operations.
- Auditable change request workflows.
- Automated tests.

The most important architectural priority is to preserve roadmap correctness.

A roadmap is not just a UI tree. It is a governed domain model with hierarchy, progress calculation, approval workflows, permissions, and audit requirements.

---

## Long-Term Product Opportunities

Once the core roadmap workflow is stable, the product can evolve into a broader internal growth platform.

Potential future capabilities:

```text
Roadmap templates
Roadmap branch library
Multi-manager support
Multi-team support
Multi-company support
Weekly progress summaries
AI-generated trainee summaries
AI roadmap recommendations
Skill gap analysis
Manager notes
Trainee reflections
Calendar-based learning plans
Due dates
Milestones
Notifications
Email reminders
Slack or Teams integration
Export roadmap as PDF
Export progress as Excel
Historical roadmap snapshots
Performance review integration
Learning resource recommendations
```

---

## Senior Engineering Assessment

Folowise Growth Maps has a strong product direction and a solid prototype foundation. The current implementation demonstrates the intended user experience clearly: manager oversight, trainee-specific roadmaps, hierarchical learning structures, change request governance, and activity visibility.

The most important technical decision going forward is to avoid treating the roadmap as a simple checklist. The roadmap is a hierarchical domain model with structural mutations, approval workflows, progress calculation rules, and audit requirements. That means the backend should be designed around domain operations rather than generic CRUD endpoints.

The frontend should remain polished and role-focused, but the system’s correctness must come from the backend.

A production-grade version of this platform should prioritize:

```text
Domain integrity
Authorization correctness
Transactional roadmap mutations
Auditability
Clear feature boundaries
Typed API contracts
Progress calculation accuracy
Maintainable UI components
Scalable data model design
```

---

## Final Summary

Folowise Growth Maps is a premium internal roadmap management prototype for individualized trainee development. It provides a strong foundation for managing trainee learning paths through structured roadmaps, role-specific dashboards, approval-based roadmap changes, topic-level resources, and activity visibility.

The prototype is well-positioned to evolve into a production-grade internal platform if the next phase focuses on backend architecture, persistence, authentication, authorization, transactional roadmap operations, and audit logging.

The project should be developed as a governed learning management system, not just a visual roadmap viewer.
