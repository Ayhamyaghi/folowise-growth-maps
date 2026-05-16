package com.folowise.roadmap.domain.entity

import com.folowise.roadmap.domain.enums.RoadmapStatus
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

/**
 * A trainee's learning roadmap.
 * Maps to the [roadmaps] table (V2 migration).
 *
 * Each trainee may have at most one ACTIVE roadmap at a time.
 * This constraint is enforced by a partial unique index in the DB:
 *   UNIQUE (trainee_id) WHERE status = 'ACTIVE'
 *
 * Topics in this roadmap are stored in [roadmap_topics] via roadmap_id FK.
 */
@Entity
@Table(name = "roadmaps")
open class RoadmapEntity(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trainee_id", nullable = false, updatable = false)
    open var trainee: TraineeProfileEntity,

    @Column(name = "title", nullable = false, length = 255)
    open var title: String

) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    @Column(name = "description", columnDefinition = "TEXT")
    open var description: String? = null

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    open var status: RoadmapStatus = RoadmapStatus.ACTIVE

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: OffsetDateTime = OffsetDateTime.now()
}
