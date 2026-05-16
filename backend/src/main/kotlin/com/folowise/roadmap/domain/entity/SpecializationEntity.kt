package com.folowise.roadmap.domain.entity

import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

/**
 * A predefined learning track (e.g. Software Development, QA Engineering).
 * Maps to the [specializations] table (V1 migration).
 * Seeded with fixed values; new specializations are added via migration.
 */
@Entity
@Table(name = "specializations")
open class SpecializationEntity(

    @Column(name = "name", nullable = false, unique = true, length = 255)
    open var name: String

) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: OffsetDateTime = OffsetDateTime.now()
}
