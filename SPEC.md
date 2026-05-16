# Folowise Roadmap Manager — Specification

## 1. Product Summary

Folowise Roadmap Manager is an internal web application for Folowise that helps the manager create, manage, track, and reuse individualized trainee learning roadmaps.

The system is for one company initially, one manager, and current trainees, but the architecture should not prevent future expansion.

---

## 2. Users and Roles

### Roles

- `MANAGER`
- `TRAINEE`

### Manager can

- View all trainees.
- Manage trainee accounts.
- View all roadmaps.
- Add/edit/delete/move roadmap topics directly.
- Copy entire roadmaps or specific branches to another trainee.
- Review trainee structural change requests.
- Approve/reject requests.
- View activity log.
- Manage topic resources.

### Trainee can

- View only their own dashboard.
- View only their own roadmap.
- Update progress immediately.
- Mark topics completed directly.
- Add personal study resources directly.
- Request structural roadmap changes.
- View their own request approval status.
- View only their own account.

### Trainee must NOT see

- Other trainees.
- Trainees page.
- Global Activity Log.
- Global Accounts page.
- Manager-wide dashboard data.
- Other trainees' requests.

---

## 3. Core Product Rules

- Each trainee has one active roadmap.
- Roadmaps are hierarchical.
- Topics can have parent-child relationships.
- Tree View and List View must render the same roadmap data.
- Do not store separate data for Tree View and List View.
- Store topics using `parent_id` / `parentTopicId` relationship.
- Manager structural edits apply directly.
- Trainee structural edits create pending requests.
- Progress updates apply immediately.
- Progress is calculated automatically.
- Progress = completed countable topics / total countable topics.
- Each topic has `countable = true` by default.
- Not-countable topics are excluded from progress calculation.
- Deleting a topic deletes all descendants.
- Delete operations require confirmation.
- Moving a topic preserves its descendants.
- A topic cannot be moved under itself or one of its descendants.
- Roadmaps and branches should be reusable.

---

## 4. Roadmap Views

The roadmap must support:

1. **List View**
2. **Tree View**

Both views use the same hierarchical roadmap data.

### List View

- Shows topics as an indented hierarchy.
- Parent-child relationships are visible.
- Supports selecting topics.

### Tree View

- Shows topics as connected visual nodes.
- All topics and subtopics must be visible as branches.
- Child topics must not only appear inside the details panel.
- Clicking a topic opens Topic Details.

---

## 5. Topic Details

Topic details should show:

- Title
- Description
- Status
- Countable / Not Countable
- Parent topic
- Last updated
- Resources
- Actions based on role

### Resource Types

Resources can include:

- YouTube
- Article
- Course
- Documentation
- GitHub
- Notes
- Other

Resources do not require manager approval.

---

## 6. Change Requests

Trainee structural actions create requests:

- Add topic
- Edit topic
- Delete topic
- Move topic

### Request Statuses

- `PENDING`
- `APPROVED`
- `REJECTED`

Manager can approve or reject.

**When approved:**
- Apply the structural change to the roadmap.
- Mark request as `APPROVED`.

**When rejected:**
- Keep roadmap unchanged.
- Mark request as `REJECTED`.
- Store manager note if provided.

---

## 7. Reusable Roadmaps

Manager can:

- Copy an entire roadmap to another trainee.
- Copy a specific branch with all descendants to another trainee.
- Preserve hierarchy when copying.

---

## 8. Suggested Backend Stack

| Layer | Technology |
|---|---|
| Language | Kotlin |
| Framework | Spring Boot |
| Java Version | Java 17 |
| Database | PostgreSQL |
| ORM | Spring Data JPA |
| Security | Spring Security + JWT |
| Migrations | Flyway |
| Validation | Bean Validation |
| API Docs | SpringDoc OpenAPI |
| Monitoring | Spring Actuator |

---

## 9. Suggested Frontend Stack

Existing frontend:

| Layer | Technology |
|---|---|
| Framework | React |
| Language | TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Animation | Motion |
| Icons | Lucide React |
| Charts | Recharts |

Frontend should eventually replace mock data with API calls.

---

## 10. Recommended Repository Structure

Target structure:

```
folowise-growth-maps/
├── frontend/              # Existing React + TypeScript app
├── backend/               # Kotlin + Spring Boot app
├── docker-compose.yml
├── .env.example
├── README.md
├── CLAUDE.md
└── SPEC.md
```

> Do not move the frontend until explicitly approved.

---

## 11. Initial Backend Domains

Expected domains:

- `users`
- `trainees`
- `roadmaps`
- `roadmap_topics`
- `topic_progress`
- `topic_resources`
- `roadmap_change_requests`
- `activity_events`

---

## 12. Important Implementation Notes

- Use UUID primary keys.
- Use `created_at` and `updated_at` timestamps on all entities.
- Use Flyway for all schema migrations.
- Use DTOs for API requests and responses.
- Do not expose JPA entities directly from controllers.
- Keep business logic in services.
- Keep controllers thin.
- Enforce ownership rules in backend services.
- Validate Manager/Trainee permissions server-side.
- Add tests for roadmap tree operations.
