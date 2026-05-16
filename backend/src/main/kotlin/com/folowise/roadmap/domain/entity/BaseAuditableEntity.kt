package com.folowise.roadmap.domain.entity

import jakarta.persistence.Column
import jakarta.persistence.MappedSuperclass
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import java.time.OffsetDateTime

/**
 * Base class for all auditable entities that have both [createdAt] and [updatedAt].
 *
 * Applied to: users, specializations, trainee_profiles, roadmaps,
 *             roadmap_topics, topic_resources, roadmap_change_requests.
 *
 * NOT applied to: activity_events — that table has created_at only and is append-only.
 *
 * [createdAt] is set once on first persist and never updated (updatable = false).
 * [updatedAt] is set on every persist and update.
 *
 * Both are managed by JPA lifecycle callbacks — the service layer does not need
 * to set these fields manually.
 */
@MappedSuperclass
open class BaseAuditableEntity {

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: OffsetDateTime = OffsetDateTime.now()

    @PrePersist
    open fun onPrePersist() {
        val now = OffsetDateTime.now()
        createdAt = now
        updatedAt = now
    }

    @PreUpdate
    open fun onPreUpdate() {
        updatedAt = OffsetDateTime.now()
    }
}
