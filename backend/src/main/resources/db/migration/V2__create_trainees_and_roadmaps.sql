-- V2: Trainee Profiles and Roadmaps
-- trainee_profiles extend the users table with trainee-specific data.
-- Each trainee has exactly one active roadmap at a time (enforced via partial unique index).

CREATE TABLE trainee_profiles (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID         NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    specialization_id UUID         NOT NULL REFERENCES specializations (id) ON DELETE RESTRICT,
    avatar_url        VARCHAR(512),
    attention_reason  VARCHAR(512),
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_trainee_profiles_user_id ON trainee_profiles (user_id);
CREATE INDEX idx_trainee_profiles_specialization_id ON trainee_profiles (specialization_id);

-- Roadmap status reflects the overall state of the trainee's learning plan.
CREATE TYPE roadmap_status AS ENUM ('ACTIVE', 'COMPLETED', 'ON_HOLD');

CREATE TABLE roadmaps (
    id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id  UUID           NOT NULL REFERENCES trainee_profiles (id) ON DELETE CASCADE,
    title       VARCHAR(255)   NOT NULL,
    description TEXT,
    status      roadmap_status NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_roadmaps_trainee_id ON roadmaps (trainee_id);
CREATE INDEX idx_roadmaps_status     ON roadmaps (status);

-- Each trainee may have at most one ACTIVE roadmap at a time.
CREATE UNIQUE INDEX idx_roadmaps_one_active_per_trainee
    ON roadmaps (trainee_id)
    WHERE status = 'ACTIVE';
