package com.folowise.roadmap.dto.auth

import java.util.UUID

data class AuthResponse(
    val accessToken: String,
    val tokenType: String = "Bearer",
    val userId: UUID,
    val email: String,
    val role: String,
    val displayName: String
)
