package com.folowise.roadmap.dto.auth

import java.util.UUID

data class CurrentUserResponse(
    val userId: UUID,
    val email: String,
    val role: String
)
