package com.folowise.roadmap.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

/**
 * Intercepts every request and validates the JWT from the Authorization header.
 *
 * Flow:
 *   1. Read the Authorization header. If missing or not a Bearer token, pass through.
 *   2. Extract the email from the token via [JwtService].
 *   3. If a valid email is found and no authentication is already set for this request,
 *      load the user via [UserDetailsService] and validate the full token.
 *   4. On success, populate the [SecurityContextHolder] with a
 *      [UsernamePasswordAuthenticationToken] so downstream filters and controllers
 *      can access the authenticated principal.
 *
 * Any exception during JWT parsing is swallowed — an invalid token is simply
 * treated as an unauthenticated request, letting Spring Security return 401.
 */
@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.removePrefix("Bearer ")
        val email = jwtService.extractEmail(token)

        if (email != null && SecurityContextHolder.getContext().authentication == null) {
            val userDetails = runCatching { userDetailsService.loadUserByUsername(email) }
                .getOrNull()

            if (userDetails != null && jwtService.isTokenValid(token, userDetails)) {
                val authentication = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        }

        filterChain.doFilter(request, response)
    }
}
