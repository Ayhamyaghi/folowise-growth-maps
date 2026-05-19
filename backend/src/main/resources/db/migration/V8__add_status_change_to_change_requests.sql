-- V8: Add STATUS_CHANGE action and proposed_status column to change requests
-- Status transitions (e.g. mark complete) from TRAINEE now create a PENDING request.
-- MANAGER approves to apply the status change, or rejects to keep current status.

ALTER TYPE change_request_action ADD VALUE 'STATUS_CHANGE';

ALTER TABLE roadmap_change_requests
    ADD COLUMN proposed_status VARCHAR(50);
