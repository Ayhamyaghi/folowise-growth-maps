package com.folowise.roadmap.dto.trainee

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class CreateTraineeRequest(
    @field:NotBlank(message = "Display name must not be blank")
    val displayName: String,

    @field:NotBlank(message = "Email must not be blank")
    @field:Email(message = "Email must be valid")
    val email: String,

    @field:NotBlank(message = "Password must not be blank")
    val password: String,

    @field:NotBlank(message = "Specialization name must not be blank")
    val specializationName: String,

    val roadmapTitle: String? = null
)
