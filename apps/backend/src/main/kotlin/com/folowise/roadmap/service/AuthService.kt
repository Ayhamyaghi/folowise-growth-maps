package com.folowise.roadmap.service

import com.folowise.roadmap.dto.auth.AuthResponse
import com.folowise.roadmap.dto.auth.CurrentUserResponse
import com.folowise.roadmap.dto.auth.LoginRequest
import com.folowise.roadmap.security.JwtService
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authenticationManager: AuthenticationManager,
    private val jwtService: JwtService
) {

    fun login(request: LoginRequest): AuthResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )

        val principal = authentication.principal as UserPrincipal
        val token = jwtService.generateToken(principal)
        val role = principal.authorities.firstOrNull()?.authority
            ?.removePrefix("ROLE_") ?: ""

        return AuthResponse(
            accessToken = token,
            userId = principal.id,
            email = principal.username,
            role = role,
            displayName = principal.displayName
        )
    }

    fun getCurrentUser(principal: UserPrincipal): CurrentUserResponse {
        val role = principal.authorities.firstOrNull()?.authority
            ?.removePrefix("ROLE_") ?: ""

        return CurrentUserResponse(
            userId = principal.id,
            email = principal.username,
            role = role,
            displayName = principal.displayName
        )
    }
}
