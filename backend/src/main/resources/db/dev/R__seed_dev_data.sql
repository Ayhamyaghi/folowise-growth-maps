-- =============================================================================
-- DEV SEED DATA — LOCAL DEVELOPMENT ONLY
-- These credentials and records exist solely to support local testing.
-- This file is NEVER loaded in production because classpath:db/dev is only
-- added to Flyway locations in application-dev.yml.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Users
-- Passwords are BCrypt-hashed via pgcrypto crypt() — compatible with Spring's
-- BCryptPasswordEncoder. Plain-text credentials: Password123!
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, display_name, password_hash, role)
VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'manager@folowise.dev',
        'Dev Manager',
        crypt('Password123!', gen_salt('bf', 10)),
        'MANAGER'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'trainee@folowise.dev',
        'Dev Trainee',
        crypt('Password123!', gen_salt('bf', 10)),
        'TRAINEE'
    )
ON CONFLICT (email) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Trainee Profile
-- Linked to trainee@folowise.dev. Specialization looked up by name.
-- -----------------------------------------------------------------------------
INSERT INTO trainee_profiles (id, user_id, specialization_id)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM specializations WHERE name = 'Software Development')
)
ON CONFLICT (user_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Roadmap
-- One active roadmap for the dev trainee.
-- -----------------------------------------------------------------------------
INSERT INTO roadmaps (id, trainee_id, title, description, status)
VALUES (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000010',
    'Software Developer Roadmap',
    'A structured learning roadmap covering programming foundations, backend development, and AI-assisted development practices.',
    'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Roadmap Topics — Level 1 (roots, is_countable=false — structural containers)
-- -----------------------------------------------------------------------------
INSERT INTO roadmap_topics (id, roadmap_id, parent_id, title, status, is_countable, display_order)
VALUES
    (
        '00000000-0000-0000-0001-000000000001',
        '00000000-0000-0000-0000-000000000100',
        NULL,
        'Programming Foundation',
        'IN_PROGRESS',
        false,
        0
    ),
    (
        '00000000-0000-0000-0001-000000000002',
        '00000000-0000-0000-0000-000000000100',
        NULL,
        'Backend Development',
        'IN_PROGRESS',
        false,
        1
    ),
    (
        '00000000-0000-0000-0001-000000000003',
        '00000000-0000-0000-0000-000000000100',
        NULL,
        'AI-Assisted Development',
        'IN_PROGRESS',
        false,
        2
    )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Roadmap Topics — Level 2 (branches, is_countable=false — structural groupings)
-- -----------------------------------------------------------------------------
INSERT INTO roadmap_topics (id, roadmap_id, parent_id, title, status, is_countable, display_order)
VALUES
    (
        '00000000-0000-0000-0002-000000000001',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000001',
        'Language Core',
        'IN_PROGRESS',
        false,
        0
    ),
    (
        '00000000-0000-0000-0002-000000000002',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000001',
        'Version Control',
        'COMPLETED',
        false,
        1
    ),
    (
        '00000000-0000-0000-0002-000000000003',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000002',
        'Spring Boot',
        'IN_PROGRESS',
        false,
        0
    ),
    (
        '00000000-0000-0000-0002-000000000004',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000002',
        'Security',
        'NOT_STARTED',
        false,
        1
    )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Roadmap Topics — Level 2 (AI-Assisted Development direct children — countable)
-- These are leaf topics directly under the AI section.
-- -----------------------------------------------------------------------------
INSERT INTO roadmap_topics (id, roadmap_id, parent_id, title, status, is_countable, display_order)
VALUES
    (
        '00000000-0000-0000-0002-000000000005',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000003',
        'Claude Code',
        'IN_PROGRESS',
        true,
        0
    ),
    (
        '00000000-0000-0000-0002-000000000006',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000003',
        'AI Code Review',
        'NOT_STARTED',
        true,
        1
    ),
    (
        '00000000-0000-0000-0002-000000000007',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0001-000000000003',
        'Refactoring with AI',
        'NOT_STARTED',
        true,
        2
    )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Roadmap Topics — Level 3 (leaves under Language Core and Version Control)
-- -----------------------------------------------------------------------------
INSERT INTO roadmap_topics (id, roadmap_id, parent_id, title, status, is_countable, display_order)
VALUES
    (
        '00000000-0000-0000-0003-000000000001',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000001',
        'Java Fundamentals',
        'COMPLETED',
        true,
        0
    ),
    (
        '00000000-0000-0000-0003-000000000002',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000001',
        'OOP Principles',
        'COMPLETED',
        true,
        1
    ),
    (
        '00000000-0000-0000-0003-000000000003',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000001',
        'Collections',
        'IN_PROGRESS',
        true,
        2
    ),
    (
        '00000000-0000-0000-0003-000000000004',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000002',
        'Git',
        'COMPLETED',
        true,
        0
    ),
    (
        '00000000-0000-0000-0003-000000000005',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000002',
        'GitHub',
        'COMPLETED',
        true,
        1
    )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Roadmap Topics — Level 3 (leaves under Spring Boot and Security)
-- -----------------------------------------------------------------------------
INSERT INTO roadmap_topics (id, roadmap_id, parent_id, title, status, is_countable, display_order)
VALUES
    (
        '00000000-0000-0000-0003-000000000006',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000003',
        'REST APIs',
        'COMPLETED',
        true,
        0
    ),
    (
        '00000000-0000-0000-0003-000000000007',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000003',
        'Validation',
        'IN_PROGRESS',
        true,
        1
    ),
    (
        '00000000-0000-0000-0003-000000000008',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000003',
        'Spring Data JPA',
        'NOT_STARTED',
        true,
        2
    ),
    (
        '00000000-0000-0000-0003-000000000009',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000004',
        'JWT Authentication',
        'NOT_STARTED',
        true,
        0
    ),
    (
        '00000000-0000-0000-0003-000000000010',
        '00000000-0000-0000-0000-000000000100',
        '00000000-0000-0000-0002-000000000004',
        'Role-Based Access',
        'NOT_STARTED',
        true,
        1
    )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Topic Resources — sample study materials (added by manager)
-- -----------------------------------------------------------------------------
INSERT INTO topic_resources (id, topic_id, added_by_id, title, resource_type, url)
VALUES
    (
        '00000000-0000-0000-0004-000000000001',
        '00000000-0000-0000-0003-000000000001',  -- Java Fundamentals
        '00000000-0000-0000-0000-000000000001',  -- manager
        'Java SE 17 Documentation',
        'DOCUMENTATION',
        'https://docs.oracle.com/en/java/javase/17/'
    ),
    (
        '00000000-0000-0000-0004-000000000002',
        '00000000-0000-0000-0003-000000000004',  -- Git
        '00000000-0000-0000-0000-000000000001',  -- manager
        'Git for Beginners — The Ultimate Guide',
        'YOUTUBE',
        'https://www.youtube.com/watch?v=8JJ101D3knE'
    ),
    (
        '00000000-0000-0000-0004-000000000003',
        '00000000-0000-0000-0003-000000000006',  -- REST APIs
        '00000000-0000-0000-0000-000000000001',  -- manager
        'Building a RESTful Web Service — Spring Guides',
        'GITHUB',
        'https://github.com/spring-guides/gs-rest-service'
    )
ON CONFLICT (id) DO NOTHING;
