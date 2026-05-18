-- V7: Add proposed topic fields to roadmap_change_requests
-- Required for ADD_TOPIC requests to store the full topic proposal
-- so it can be applied on approval without data loss.

ALTER TABLE roadmap_change_requests
    ADD COLUMN proposed_description TEXT,
    ADD COLUMN proposed_countable    BOOLEAN NOT NULL DEFAULT TRUE;
