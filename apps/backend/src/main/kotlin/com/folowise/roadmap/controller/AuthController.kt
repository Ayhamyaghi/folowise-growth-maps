package com.folowise.roadmap.controller

import com.folowise.roadmap.dto.auth.AuthResponse
import com.folowise.roadmap.dto.auth.CurrentUserResponse
import com.folowise.roadmap.dto.auth.LoginRequest
import com.folowise.roadmap.security.UserPrincipal
import com.folowise.roadmap.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.login(request))

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal principal: UserPrincipal): ResponseEntity<CurrentUserResponse> =
        ResponseEntity.ok(authService.getCurrentUser(principal))
}
