package com.folowise.roadmap.domain.entity

import com.folowise.roadmap.domain.enums.TopicStatus
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

/**
 * A single node in a roadmap's topic hierarchy.
 * Maps to the [roadmap_topics] table (V3 migration).
 *
 * Hierarchy:
 *   - [parent] is null for root-level topics.
 *   - [children] is the inverse side; do not use for writes.
 *   - Deleting a topic cascades to all descendants via DB ON DELETE CASCADE.
 *     No JPA cascade is added here to avoid double-delete conflicts.
 *
 * Progress:
 *   - Only topics with [isCountable] = true contribute to progress.
 *   - Progress = completed countable topics / total countable topics.
 *   - Calculated by the service layer, not stored as a column.
 *
 * View:
 *   - The same table data is used for both Tree View and List View.
 *   - [displayOrder] controls sibling ordering within the same parent.
 */
@Entity
@Table(name = "roadmap_topics")
open class RoadmapTopicEntity(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false, updatable = false)
    open var roadmap: RoadmapEntity,

    @Column(name = "title", nullable = false, length = 255)
    open var title: String

) : BaseAuditableEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    // Null for root-level topics. Self-referencing FK.
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "parent_id", nullable = true)
    open var parent: RoadmapTopicEntity? = null

    // Inverse side of the parent/child self-reference.
    // Read-only from JPA perspective; DB cascade handles deletes.
    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    open var children: MutableList<RoadmapTopicEntity> = mutableListOf()

    @Column(name = "description", columnDefinition = "TEXT")
    open var description: String? = null

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    open var status: TopicStatus = TopicStatus.NOT_STARTED

    // When false, this topic is excluded from progress calculations.
    // Use for grouping/phase header topics that are not leaf-level work items.
    @Column(name = "is_countable", nullable = false)
    open var isCountable: Boolean = true

    // Ordering position among siblings sharing the same parent.
    @Column(name = "display_order", nullable = false)
    open var displayOrder: Int = 0

    @Column(name = "estimated_hours")
    open var estimatedHours: Int? = null

    @Column(name = "last_activity_at")
    open var lastActivityAt: OffsetDateTime? = null
}
