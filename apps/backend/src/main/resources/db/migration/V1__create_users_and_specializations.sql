-- V1: Users and Specializations
-- Users are the authentication principals (MANAGER or TRAINEE role).
-- Specializations are a reference table for trainee tracks (e.g. Software Development, QA).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('MANAGER', 'TRAINEE');

CREATE TABLE users (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email        VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role         user_role    NOT NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email  ON users (email);
CREATE INDEX idx_users_role   ON users (role);

-- Specializations are predefined tracks managed by the application.
-- Stored in DB so they can be referenced by trainee_profiles with a FK.
CREATE TABLE specializations (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO specializations (name) VALUES
    ('Software Development'),
    ('QA Engineering'),
    ('AI Engineering'),
    ('Product Design'),
    ('Marketing');
