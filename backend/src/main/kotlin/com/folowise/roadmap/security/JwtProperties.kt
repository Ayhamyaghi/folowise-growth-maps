package com.folowise.roadmap.security

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * JWT configuration bound from the [app.jwt.*] namespace.
 *
 * [secret]       — Base64-encoded HMAC-SHA256 signing key.
 *                  Must be supplied via JWT_SECRET environment variable in production.
 *                  Application-dev.yml provides a development-only fallback.
 *
 * [expirationMs] — Token lifetime in milliseconds (default: 86_400_000 = 24 h).
 *                  Override with JWT_EXPIRATION_MS environment variable.
 *
 * Registered via @EnableConfigurationProperties in SecurityConfig.
 */
@ConfigurationProperties(prefix = "app.jwt")
class JwtProperties(
    val secret: String,
    val expirationMs: Long = 86_400_000L
)
