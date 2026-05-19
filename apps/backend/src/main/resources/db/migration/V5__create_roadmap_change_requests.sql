-- V5: Roadmap Change Requests
-- Trainees cannot modify the roadmap structure directly.
-- All structural changes (add/edit/delete/move topic) create a PENDING request.
-- The manager reviews and either APPROVES (applies the change) or REJECTS it.
-- Manager structural edits bypass this table and apply directly.

CREATE TYPE change_request_action AS ENUM (
    'ADD_TOPIC',
    'EDIT_TOPIC',
    'DELETE_TOPIC',
    'MOVE_TOPIC'
);

CREATE TYPE change_request_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TABLE roadmap_change_requests (
    id              UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id      UUID                   NOT NULL REFERENCES roadmaps (id) ON DELETE CASCADE,
    requested_by_id UUID                   NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    reviewed_by_id  UUID                   REFERENCES users (id) ON DELETE SET NULL,

    -- The topic the request targets. Nullable: for ADD_TOPIC the topic does not exist yet.
    topic_id        UUID                   REFERENCES roadmap_topics (id) ON DELETE SET NULL,

    action          change_request_action  NOT NULL,
    status          change_request_status  NOT NULL DEFAULT 'PENDING',

    -- Trainee-supplied description of the requested change.
    description     TEXT                   NOT NULL,

    -- For ADD_TOPIC: proposed title of the new topic.
    proposed_title  VARCHAR(255),

    -- For MOVE_TOPIC: the intended new parent topic id.
    proposed_parent_id UUID               REFERENCES roadmap_topics (id) ON DELETE SET NULL,

    -- Manager note written when approving or rejecting.
    manager_note    TEXT,

    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ            NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ            NOT NULL DEFAULT now(),

    -- A PENDING request cannot have a reviewer.
    CONSTRAINT chk_pending_has_no_reviewer
        CHECK (status <> 'PENDING' OR reviewed_by_id IS NULL),

    -- An APPROVED or REJECTED request must have a reviewer and a reviewed_at timestamp.
    CONSTRAINT chk_resolved_has_reviewer
        CHECK (status = 'PENDING' OR (reviewed_by_id IS NOT NULL AND reviewed_at IS NOT NULL))
);

CREATE INDEX idx_change_requests_roadmap_id      ON roadmap_change_requests (roadmap_id);
CREATE INDEX idx_change_requests_requested_by_id ON roadmap_change_requests (requested_by_id);
CREATE INDEX idx_change_requests_topic_id        ON roadmap_change_requests (topic_id);
CREATE INDEX idx_change_requests_status          ON roadmap_change_requests (status);
