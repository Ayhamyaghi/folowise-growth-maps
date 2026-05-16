package com.folowise.roadmap.security

import com.folowise.roadmap.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

/**
 * Loads a [UserPrincipal] by email for Spring Security authentication.
 *
 * Called by Spring Security during the authentication process and by
 * [JwtAuthenticationFilter] when validating an incoming JWT.
 *
 * Throws [UsernameNotFoundException] if no user with the given email exists.
 * Spring Security catches this and treats it as authentication failure.
 */
@Service
class UserDetailsServiceImpl(
    private val userRepository: UserRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByEmail(username)
            .orElseThrow { UsernameNotFoundException("No user found with email: $username") }
        return UserPrincipal.fromEntity(user)
    }
}
