package com.folowise.roadmap.web.error

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.AuthenticationException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.OffsetDateTime

@RestControllerAdvice
class GlobalExceptionHandler {

    // 400 — Bean Validation failure (@Valid on request DTOs)
    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleValidation(
        ex: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ApiError {
        val message = ex.bindingResult.allErrors
            .joinToString("; ") { error ->
                if (error is FieldError) "${error.field}: ${error.defaultMessage}"
                else error.defaultMessage ?: "Invalid value"
            }
        return apiError(HttpStatus.BAD_REQUEST, message, request)
    }

    // 400 — Illegal argument passed to a service method
    @ExceptionHandler(IllegalArgumentException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleIllegalArgument(
        ex: IllegalArgumentException,
        request: HttpServletRequest
    ): ApiError = apiError(HttpStatus.BAD_REQUEST, ex.message ?: "Bad request", request)

    // 401 — Bad credentials at login
    @ExceptionHandler(BadCredentialsException::class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    fun handleBadCredentials(
        request: HttpServletRequest
    ): ApiError = apiError(HttpStatus.UNAUTHORIZED, "Invalid email or password", request)

    // 401 — Any other Spring Security AuthenticationException reaching a controller
    @ExceptionHandler(AuthenticationException::class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    fun handleAuthentication(
        request: HttpServletRequest
    ): ApiError = apiError(HttpStatus.UNAUTHORIZED, "Authentication required", request)

    // 403 — Ownership/access check failed in service layer
    @ExceptionHandler(AccessDeniedException::class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    fun handleAccessDenied(
        ex: AccessDeniedException,
        request: HttpServletRequest
    ): ApiError = apiError(HttpStatus.FORBIDDEN, ex.message ?: "Access denied", request)

    // 404 — Entity not found
    @ExceptionHandler(NoSuchElementException::class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    fun handleNotFound(
        ex: NoSuchElementException,
        request: HttpServletRequest
    ): ApiError = apiError(HttpStatus.NOT_FOUND, ex.message ?: "Resource not found", request)

    // 500 — Catch-all for unexpected exceptions
    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    fun handleUnexpected(
        request: HttpServletRequest
    ): ApiError = apiError(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request)

    private fun apiError(status: HttpStatus, message: String, request: HttpServletRequest) = ApiError(
        timestamp = OffsetDateTime.now(),
        status = status.value(),
        error = status.reasonPhrase,
        message = message,
        path = request.requestURI
    )
}
