package com.folowise.roadmap.domain.entity

import com.folowise.roadmap.domain.enums.ChangeRequestAction
import com.folowise.roadmap.domain.enums.ChangeRequestStatus
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

/**
 * A structural change request submitted by a trainee.
 * Maps to the [roadmap_change_requests] table (V5 migration).
 *
 * Lifecycle:
 *   - Created with status = PENDING by the trainee.
 *   - Manager sets status to APPROVED or REJECTED.
 *   - On APPROVED: the service applies the structural change to the roadmap.
 *   - On REJECTED: roadmap is unchanged; [managerNote] explains the decision.
 *
 * Nullable FK rules (match migration ON DELETE behaviour):
 *   - [topic]          nullable: null for ADD_TOPIC (topic does not yet exist).
 *                      Set to NULL if the referenced topic is deleted.
 *   - [reviewedBy]     nullable: null while PENDING. Set to NULL if reviewer deleted.
 *   - [proposedParent] nullable: only relevant for MOVE_TOPIC.
 *                      Set to NULL if the intended parent topic is deleted.
 *
 * DB-level CHECK constraints (enforced by migration, validated by service):
 *   - PENDING requests must not have a reviewer.
 *   - APPROVED/REJECTED requests must have a reviewer and reviewedAt timestamp.
 */
@Entity
@Table(name = "roadmap_change_requests")
open class RoadmapChangeRequestEntity(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "roadmap_id", nullable = false, updatable = false)
    open var roadmap: RoadmapEntity,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requested_by_id", nullable = false, updatable = false)
    open var requestedBy: UserEntity,

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "action", nullable = false)
    open var action: ChangeRequestAction,

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    open var description: String

) : BaseAuditableEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    // The manager who reviewed the request. Null while PENDING.
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "reviewed_by_id", nullable = true)
    open var reviewedBy: UserEntity? = null

    // The topic being edited, deleted, or moved. Null for ADD_TOPIC.
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "topic_id", nullable = true)
    open var topic: RoadmapTopicEntity? = null

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    open var status: ChangeRequestStatus = ChangeRequestStatus.PENDING

    // Proposed title for the new topic (ADD_TOPIC action only).
    @Column(name = "proposed_title", length = 255)
    open var proposedTitle: String? = null

    // Proposed new parent for the topic (MOVE_TOPIC action only).
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "proposed_parent_id", nullable = true)
    open var proposedParent: RoadmapTopicEntity? = null

    // Written by the manager when approving or rejecting.
    @Column(name = "manager_note", columnDefinition = "TEXT")
    open var managerNote: String? = null

    // Set when the manager takes action. Null while PENDING.
    @Column(name = "reviewed_at")
    open var reviewedAt: OffsetDateTime? = null
}
