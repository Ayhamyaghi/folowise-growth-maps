package com.folowise.roadmap.domain.entity

import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

/**
 * Extends a TRAINEE user with profile-specific data.
 * Maps to the [trainee_profiles] table (V2 migration).
 *
 * Owns the FK to [users] (user_id) — OneToOne, owning side.
 * Owns the FK to [specializations] (specialization_id).
 */
@Entity
@Table(name = "trainee_profiles")
open class TraineeProfileEntity(

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true, updatable = false)
    open var user: UserEntity,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "specialization_id", nullable = false)
    open var specialization: SpecializationEntity

) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    @Column(name = "avatar_url", length = 512)
    open var avatarUrl: String? = null

    // Populated when a manager flags a trainee (e.g. "Low progress", "Pending review").
    @Column(name = "attention_reason", length = 512)
    open var attentionReason: String? = null

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: OffsetDateTime = OffsetDateTime.now()
}
