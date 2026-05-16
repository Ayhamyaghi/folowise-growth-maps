package com.folowise.roadmap.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.folowise.roadmap.web.error.ApiError
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.stereotype.Component
import java.time.OffsetDateTime

/**
 * Returns a JSON 403 response when an authenticated user lacks the required authority.
 * Triggered by Spring Security before the request reaches any controller.
 */
@Component
class Http403AccessDeniedHandler(
    private val objectMapper: ObjectMapper
) : AccessDeniedHandler {

    override fun handle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        accessDeniedException: AccessDeniedException
    ) {
        val error = ApiError(
            timestamp = OffsetDateTime.now(),
            status = HttpStatus.FORBIDDEN.value(),
            error = HttpStatus.FORBIDDEN.reasonPhrase,
            message = "Access denied",
            path = request.requestURI
        )
        response.status = HttpStatus.FORBIDDEN.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        objectMapper.writeValue(response.outputStream, error)
    }
}
