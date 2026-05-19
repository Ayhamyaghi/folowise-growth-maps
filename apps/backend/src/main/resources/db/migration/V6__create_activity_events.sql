-- V6: Activity Events
-- Append-only audit log of significant actions within the system.
-- Events are never deleted or updated — only inserted.
-- actor_id can be NULL for system-generated events.
-- target references are stored as plain UUIDs (not FK) so that deleting
-- a roadmap or topic does not cascade-delete historical activity records.

CREATE TYPE activity_event_type AS ENUM (
    'PROGRESS_UPDATE',
    'REQUEST_SUBMITTED',
    'REQUEST_APPROVED',
    'REQUEST_REJECTED',
    'TOPIC_ADDED',
    'TOPIC_EDITED',
    'TOPIC_DELETED',
    'TOPIC_MOVED',
    'ROADMAP_CREATED',
    'ROADMAP_COPIED',
    'RESOURCE_ADDED',
    'RESOURCE_DELETED',
    'SYSTEM'
);

CREATE TABLE activity_events (
    id           UUID                PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Who performed the action. NULL for system-generated events.
    actor_id     UUID                REFERENCES users (id) ON DELETE SET NULL,

    event_type   activity_event_type NOT NULL,

    -- Human-readable description of the event (e.g. "marked Spring Boot Security as Completed").
    summary      TEXT                NOT NULL,

    -- Soft references to affected entities — stored as plain UUIDs so historical
    -- records survive deletions of the referenced rows.
    roadmap_id   UUID,
    topic_id     UUID,
    request_id   UUID,

    created_at   TIMESTAMPTZ         NOT NULL DEFAULT now()

    -- No updated_at: activity events are immutable.
);

CREATE INDEX idx_activity_events_actor_id   ON activity_events (actor_id);
CREATE INDEX idx_activity_events_event_type ON activity_events (event_type);
CREATE INDEX idx_activity_events_roadmap_id ON activity_events (roadmap_id);
CREATE INDEX idx_activity_events_created_at ON activity_events (created_at DESC);
