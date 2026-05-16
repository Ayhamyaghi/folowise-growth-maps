-- V3: Roadmap Topics
-- Topics form a hierarchical tree within a roadmap using a self-referencing parent_id.
-- Deleting a topic cascades to all descendants (ON DELETE CASCADE on parent_id).
-- Progress is derived: completed countable topics / total countable topics.
-- No separate List View or Tree View data — both views use this same table.

CREATE TYPE topic_status AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED',
    'PAUSED',
    'SKIPPED',
    'NEEDS_REVIEW'
);

CREATE TABLE roadmap_topics (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id       UUID         NOT NULL REFERENCES roadmaps (id) ON DELETE CASCADE,

    -- Self-referencing FK: deleting a parent cascades to all children.
    parent_id        UUID         REFERENCES roadmap_topics (id) ON DELETE CASCADE,

    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    status           topic_status NOT NULL DEFAULT 'NOT_STARTED',

    -- countable = TRUE means this topic counts toward progress calculation.
    -- Set to FALSE for container/grouping topics (e.g. phase headers).
    is_countable     BOOLEAN      NOT NULL DEFAULT TRUE,

    -- display_order controls sibling ordering within the same parent.
    display_order    INT          NOT NULL DEFAULT 0,

    estimated_hours  INT,
    last_activity_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),

    -- A topic cannot be its own parent.
    CONSTRAINT chk_topic_not_own_parent CHECK (id <> parent_id)
);

CREATE INDEX idx_roadmap_topics_roadmap_id     ON roadmap_topics (roadmap_id);
CREATE INDEX idx_roadmap_topics_parent_id      ON roadmap_topics (parent_id);
CREATE INDEX idx_roadmap_topics_status         ON roadmap_topics (status);

-- Composite index for efficient sibling ordering queries.
CREATE INDEX idx_roadmap_topics_parent_order
    ON roadmap_topics (roadmap_id, parent_id, display_order);
