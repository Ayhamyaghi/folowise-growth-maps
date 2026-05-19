package com.folowise.roadmap.service

import com.folowise.roadmap.dto.activity.ActivityEventResponse
import com.folowise.roadmap.repository.ActivityEventRepository
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ActivityService(
    private val activityEventRepository: ActivityEventRepository
) {

    @Transactional(readOnly = true)
    fun listEvents(principal: UserPrincipal): List<ActivityEventResponse> {
        val isManager = principal.authorities.any { it.authority == "ROLE_MANAGER" }
        val events = if (isManager) {
            activityEventRepository.findAllByOrderByCreatedAtDesc()
        } else {
            activityEventRepository.findAllByActorIdOrderByCreatedAtDesc(principal.id)
        }
        return events.map { event ->
            ActivityEventResponse(
                id = requireNotNull(event.id),
                eventType = event.eventType.name,
                summary = event.summary,
                actorName = event.actor?.displayName,
                createdAt = event.createdAt
            )
        }
    }
}
