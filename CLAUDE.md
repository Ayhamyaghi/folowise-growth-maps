# CLAUDE.md — Claude Code Instructions for Folowise Roadmap Manager

## Working Principles

- Work step by step. Never implement multiple major steps at once.
- Do not make assumptions. If something is unclear, ask before changing files.
- Before modifying files, explain the planned changes.
- After modifying files, summarize exactly what changed.
- Do not rewrite unrelated files.
- Do not redesign UI unless explicitly requested.
- Do not change approved product decisions unless explicitly requested.
- Do not introduce unnecessary abstractions.
- Keep production-grade quality.
- Prefer clear, maintainable code over clever code.

## Architecture Rules

- Keep backend and frontend separated.
- Backend must use Kotlin + Spring Boot.
- Frontend must remain React + TypeScript.
- Database must be PostgreSQL.
- Migrations must use Flyway.

## Domain and Business Rules

- Authentication must support Manager and Trainee roles.
- Roadmap logic must use hierarchical parent-child topics.
- Trainee structural roadmap edits require manager approval.
- Manager structural roadmap edits apply directly.
- Trainee progress updates apply immediately.
- Topic resources are personal/study references and do not require approval.
- Any destructive roadmap action must require confirmation.

## Security Rules

- Do not expose secrets.
- Do not hard-code environment-specific secrets.
- Use environment variables for all sensitive configuration.

## Required Workflow

For every implementation step:

1. Read SPEC.md.
2. State the exact scope of the current step.
3. List all files that will be created or changed.
4. Wait for approval if the user asks for review before proceeding.
5. Implement only the approved scope.
6. Run relevant checks if available (build, lint, tests).
7. Summarize exactly what changed.
