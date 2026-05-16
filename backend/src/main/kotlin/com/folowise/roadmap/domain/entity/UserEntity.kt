package com.folowise.roadmap.domain.entity

import com.folowise.roadmap.domain.enums.UserRole
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

/**
 * Represents an authenticated principal in the system.
 * Maps to the [users] table (V1 migration).
 * Role determines access: MANAGER or TRAINEE.
 */
@Entity
@Table(name = "users")
open class UserEntity(

    @Column(name = "email", nullable = false, unique = true, length = 255)
    open var email: String,

    @Column(name = "display_name", nullable = false, length = 255)
    open var displayName: String,

    @Column(name = "password_hash", nullable = false, length = 255)
    open var passwordHash: String,

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "role", nullable = false)
    open var role: UserRole

) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    @Column(name = "is_active", nullable = false)
    open var isActive: Boolean = true

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: OffsetDateTime = OffsetDateTime.now()
}
