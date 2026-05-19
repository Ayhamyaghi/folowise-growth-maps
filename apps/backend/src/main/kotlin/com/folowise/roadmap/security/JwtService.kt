package com.folowise.roadmap.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

/**
 * JWT generation, validation, and claim extraction using JJWT 0.12.x.
 *
 * Signing algorithm: HMAC-SHA256 (HS256).
 * The signing key is derived from the Base64-encoded [JwtProperties.secret].
 *
 * Token claims:
 *   - subject  : user email (unique identifier)
 *   - role     : Spring Security authority string (e.g. "ROLE_MANAGER")
 *   - iat      : issued-at timestamp
 *   - exp      : expiration timestamp
 *
 * All claim-parsing methods return null on any [JwtException] (expired, malformed,
 * unsupported, invalid signature) so callers do not need to handle JWT exceptions.
 */
@Service
class JwtService(private val jwtProperties: JwtProperties) {

    private val signingKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret))
    }

    /**
     * Generates a signed JWT for the given [principal].
     * The role claim stores the first authority in the principal's authority set.
     */
    fun generateToken(principal: UserPrincipal): String {
        val role = principal.authorities.firstOrNull()?.authority ?: ""
        return Jwts.builder()
            .subject(principal.username)
            .claim("role", role)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + jwtProperties.expirationMs))
            .signWith(signingKey)
            .compact()
    }

    /**
     * Extracts the subject (email) from the token.
     * Returns null if the token is invalid or expired.
     */
    fun extractEmail(token: String): String? =
        extractClaim(token) { it.subject }

    /**
     * Returns true if the token is valid for the given [userDetails]:
     *   - subject matches the username
     *   - token is not expired
     *   - user account is enabled (isActive)
     */
    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        val email = extractEmail(token) ?: return false
        return email == userDetails.username
            && !isTokenExpired(token)
            && userDetails.isEnabled
    }

    private fun isTokenExpired(token: String): Boolean =
        extractClaim(token) { it.expiration }?.before(Date()) ?: true

    /**
     * Extracts a single claim from the token using the provided [resolver].
     * Returns null on any [JwtException] — callers treat null as "invalid token".
     */
    private fun <T> extractClaim(token: String, resolver: (Claims) -> T): T? {
        return try {
            val claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .payload
            resolver(claims)
        } catch (e: JwtException) {
            null
        } catch (e: IllegalArgumentException) {
            null
        }
    }
}
