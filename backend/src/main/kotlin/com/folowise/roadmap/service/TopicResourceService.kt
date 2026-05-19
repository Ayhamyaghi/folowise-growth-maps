package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.TopicResourceEntity
import com.folowise.roadmap.domain.enums.ResourceType
import com.folowise.roadmap.dto.resource.AddResourceRequest
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import com.folowise.roadmap.repository.TopicResourceRepository
import com.folowise.roadmap.repository.UserRepository
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TopicResourceService(
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val topicResourceRepository: TopicResourceRepository,
    private val userRepository: UserRepository,
    private val roadmapQueryService: RoadmapQueryService
) {

    @Transactional
    fun addResource(
        roadmapId: UUID,
        topicId: UUID,
        request: AddResourceRequest,
        principal: UserPrincipal
    ): RoadmapTreeResponse {
        roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(topicId)
            .orElseThrow { NoSuchElementException("Topic not found: $topicId") }

        if (!roadmapTopicRepository.existsByIdAndRoadmapId(topicId, roadmapId)) {
            throw IllegalArgumentException("Topic $topicId does not belong to roadmap $roadmapId")
        }

        if (request.resourceType != ResourceType.NOTES && request.url.isNullOrBlank()) {
            throw IllegalArgumentException("URL is required for resource type ${request.resourceType}")
        }

        val addedBy = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("User not found: ${principal.id}") }

        val resource = TopicResourceEntity(
            topic = topic,
            addedBy = addedBy,
            title = request.title,
            resourceType = request.resourceType
        ).apply {
            url = request.url
            note = request.note
        }

        topicResourceRepository.save(resource)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }

    @Transactional
    fun deleteResource(
        roadmapId: UUID,
        topicId: UUID,
        resourceId: UUID
    ): RoadmapTreeResponse {
        val resource = topicResourceRepository.findById(resourceId)
            .orElseThrow { NoSuchElementException("Resource not found: $resourceId") }

        topicResourceRepository.delete(resource)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }
}
