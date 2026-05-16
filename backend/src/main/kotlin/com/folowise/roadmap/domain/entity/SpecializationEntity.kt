package com.folowise.roadmap.domain.entity

import jakarta.persistence.*
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

) : BaseAuditableEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null
}
