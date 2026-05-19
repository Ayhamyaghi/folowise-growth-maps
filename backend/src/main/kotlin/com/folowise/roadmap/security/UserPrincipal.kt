package com.folowise.roadmap.security

import com.folowise.roadmap.domain.entity.UserEntity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.UUID

/**
 * Spring Security principal wrapping a [UserEntity].
 *
 * [username] maps to the user's email (unique identifier for authentication).
 * [authorities] maps [UserRole] → Spring Security role string (ROLE_MANAGER / ROLE_TRAINEE).
 * [isEnabled] reflects [UserEntity.isActive] so inactive users are rejected at auth time.
 *
 * [id] is exposed for use in service-layer ownership checks without requiring
 * an additional DB lookup after authentication.
 *
 * This class is intentionally not a data class — it is an auth principal, not a value object.
 */
class UserPrincipal(
    val id: UUID,
    val displayName: String,
    private val email: String,
    private val password: String,
    private val authorities: Collection<GrantedAuthority>,
    private val enabled: Boolean
) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> = authorities
    override fun getPassword(): String = password
    override fun getUsername(): String = email
    override fun isEnabled(): Boolean = enabled

    // Account locking / expiry is not implemented; all non-disabled accounts are valid.
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true

    companion object {
        /**
         * Creates a [UserPrincipal] from a fully-loaded [UserEntity].
         * Caller must ensure [user.id] is non-null (i.e. the entity was persisted).
         */
        fun fromEntity(user: UserEntity): UserPrincipal = UserPrincipal(
            id = requireNotNull(user.id) { "UserEntity.id must not be null when building UserPrincipal" },
            displayName = user.displayName,
            email = user.email,
            password = user.passwordHash,
            authorities = listOf(SimpleGrantedAuthority("ROLE_${user.role.name}")),
            enabled = user.isActive
        )
    }
}
