package com.folowise.roadmap.domain.entity

import com.folowise.roadmap.domain.enums.ActivityEventType
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

/**
 * An immutable entry in the system-wide activity audit log.
 * Maps to the [activity_events] table (V6 migration).
 *
 * Events are append-only — never updated or deleted.
 * There is no [updatedAt] column.
 *
 * Target references ([roadmapId], [topicId], [requestId]) are stored as plain
 * UUID values without JPA relationships. This is intentional: deleting a roadmap
 * or topic must not cascade-delete historical activity records.
 * The [actor] FK uses ON DELETE SET NULL so system events survive user deletion.
 */
@Entity
@Table(name = "activity_events")
open class ActivityEventEntity(

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "event_type", nullable = false)
    open var eventType: ActivityEventType,

    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    open var summary: String

) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    // Null for system-generated events (no human actor).
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "actor_id", nullable = true)
    open var actor: UserEntity? = null

    // Soft UUID references — no FK constraint, survives row deletion.
    @Column(name = "roadmap_id")
    open var roadmapId: UUID? = null

    @Column(name = "topic_id")
    open var topicId: UUID? = null

    @Column(name = "request_id")
    open var requestId: UUID? = null

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()
}
