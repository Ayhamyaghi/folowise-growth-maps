-- V4: Topic Resources
-- Resources are study/reference materials attached to a roadmap topic.
-- They are added by either the manager or the trainee directly — no approval required.
-- Deleting a topic cascades to its resources (ON DELETE CASCADE).

CREATE TYPE resource_type AS ENUM (
    'YOUTUBE',
    'ARTICLE',
    'COURSE',
    'DOCUMENTATION',
    'GITHUB',
    'NOTES',
    'OTHER'
);

CREATE TABLE topic_resources (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id    UUID          NOT NULL REFERENCES roadmap_topics (id) ON DELETE CASCADE,
    added_by_id UUID          NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
    title       VARCHAR(255)  NOT NULL,
    resource_type resource_type NOT NULL,
    url         VARCHAR(2048),
    note        TEXT,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),

    -- URL is required for all types except NOTES.
    CONSTRAINT chk_resource_url_required
        CHECK (resource_type = 'NOTES' OR url IS NOT NULL)
);

CREATE INDEX idx_topic_resources_topic_id    ON topic_resources (topic_id);
CREATE INDEX idx_topic_resources_added_by_id ON topic_resources (added_by_id);
