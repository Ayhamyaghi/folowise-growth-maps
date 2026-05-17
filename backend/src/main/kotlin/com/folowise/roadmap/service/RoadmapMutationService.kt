package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.enums.TopicStatus
import com.folowise.roadmap.dto.roadmap.AddRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class RoadmapMutationService(
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val roadmapQueryService: RoadmapQueryService
) {

    /**
     * Adds a new topic to the roadmap and returns the refreshed [RoadmapTreeResponse].
     *
     * Rules:
     *  - Roadmap must exist.
     *  - If [AddRoadmapTopicRequest.parentId] is supplied, the parent topic must exist
     *    and must belong to the same roadmap.
     *  - [displayOrder] is calculated as one more than the current maximum among siblings
     *    sharing the same parent (or root level). Starts at 0 when there are no siblings.
     *  - Topic is saved with status [TopicStatus.NOT_STARTED].
     *  - The full refreshed tree is returned so the caller can update the UI in one round-trip.
     */
    @Transactional
    fun addTopic(roadmapId: UUID, request: AddRoadmapTopicRequest): RoadmapTreeResponse {
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val trimmedTitle = request.title.trim()
        require(trimmedTitle.isNotEmpty()) { "Title must not be blank" }

        val parent = if (request.parentId != null) {
            val parentTopic = roadmapTopicRepository.findById(request.parentId)
                .orElseThrow { NoSuchElementException("Parent topic not found: ${request.parentId}") }
            require(roadmapTopicRepository.existsByIdAndRoadmapId(request.parentId, roadmapId)) {
                "Parent topic does not belong to this roadmap"
            }
            parentTopic
        } else null

        val nextOrder = if (request.parentId == null) {
            (roadmapTopicRepository.findMaxDisplayOrderByRoadmapIdAndParentIsNull(roadmapId) ?: -1) + 1
        } else {
            (roadmapTopicRepository.findMaxDisplayOrderByRoadmapIdAndParentId(roadmapId, request.parentId) ?: -1) + 1
        }

        val topic = RoadmapTopicEntity(
            roadmap = roadmap,
            title = trimmedTitle
        ).apply {
            description = request.description?.trim()?.takeIf { it.isNotEmpty() }
            this.parent = parent
            status = TopicStatus.NOT_STARTED
            isCountable = request.countable
            displayOrder = nextOrder
        }

        roadmapTopicRepository.save(topic)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }
}
