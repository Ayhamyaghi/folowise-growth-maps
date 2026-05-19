package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.enums.RoadmapStatus
import com.folowise.roadmap.domain.enums.TopicStatus
import com.folowise.roadmap.dto.roadmap.AddRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.EditRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.MoveRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.dto.roadmap.UpdateRoadmapTopicStatusRequest
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import com.folowise.roadmap.repository.TraineeProfileRepository
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

@Service
class RoadmapMutationService(
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val roadmapQueryService: RoadmapQueryService,
    private val traineeProfileRepository: TraineeProfileRepository
) {

    /**
     * Validates that [principal] is allowed to mutate [roadmapId].
     * MANAGER may mutate any roadmap. TRAINEE may only mutate their own active roadmap.
     */
    private fun checkAccess(roadmapId: UUID, principal: UserPrincipal) {
        if (principal.authorities.any { it.authority == "ROLE_MANAGER" }) return
        val profile = traineeProfileRepository.findByUserId(principal.id)
            .orElseThrow { AccessDeniedException("No trainee profile found for current user") }
        val activeRoadmap = roadmapRepository.findByTraineeIdAndStatus(requireNotNull(profile.id), RoadmapStatus.ACTIVE)
            .orElseThrow { AccessDeniedException("No active roadmap found for current user") }
        if (activeRoadmap.id != roadmapId) throw AccessDeniedException("Roadmap does not belong to current user")
    }


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
    fun addTopic(roadmapId: UUID, request: AddRoadmapTopicRequest, principal: UserPrincipal? = null): RoadmapTreeResponse {
        if (principal != null) checkAccess(roadmapId, principal)
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

    /**
     * Deletes an existing topic and returns the refreshed [RoadmapTreeResponse].
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - All descendant topics are removed by the database ON DELETE CASCADE constraint.
     *  - The full refreshed tree is returned so the caller can update the UI in one round-trip.
     */
    @Transactional
    fun deleteTopic(roadmapId: UUID, topicId: UUID, principal: UserPrincipal? = null): RoadmapTreeResponse {
        if (principal != null) checkAccess(roadmapId, principal)
        roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(topicId)
            .orElseThrow { NoSuchElementException("Topic not found: $topicId") }

        require(roadmapTopicRepository.existsByIdAndRoadmapId(topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        roadmapTopicRepository.delete(topic)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }

    /**
     * Updates the mutable fields of an existing topic and returns the refreshed [RoadmapTreeResponse].
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - Only [title], [description], and [isCountable] are updated.
     *  - [parentId], [displayOrder], and [status] are not changed.
     */
    @Transactional
    fun editTopic(roadmapId: UUID, topicId: UUID, request: EditRoadmapTopicRequest, principal: UserPrincipal? = null): RoadmapTreeResponse {
        if (principal != null) checkAccess(roadmapId, principal)
        roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(topicId)
            .orElseThrow { NoSuchElementException("Topic not found: $topicId") }

        require(roadmapTopicRepository.existsByIdAndRoadmapId(topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        val trimmedTitle = request.title.trim()
        require(trimmedTitle.isNotEmpty()) { "Title must not be blank" }

        topic.title = trimmedTitle
        topic.description = request.description?.trim()?.takeIf { it.isNotEmpty() }
        topic.isCountable = request.countable

        roadmapTopicRepository.save(topic)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }

    /**
     * Moves an existing topic to a new parent (or to the top level) and returns the
     * refreshed [RoadmapTreeResponse].
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - [MoveRoadmapTopicRequest.newParentId] null means move to top level.
     *  - If [newParentId] is provided: parent must exist, belong to the same roadmap,
     *    must not equal [topicId], and must not be a descendant of [topicId].
     *  - All descendants of the moved topic are preserved (hierarchy intact).
     *  - [displayOrder] is recalculated as the next sibling order under the new parent.
     *  - Title, description, status, and countable are unchanged.
     */
    @Transactional
    fun moveTopic(roadmapId: UUID, topicId: UUID, request: MoveRoadmapTopicRequest, principal: UserPrincipal? = null): RoadmapTreeResponse {
        if (principal != null) checkAccess(roadmapId, principal)
        roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(topicId)
            .orElseThrow { NoSuchElementException("Topic not found: $topicId") }

        require(roadmapTopicRepository.existsByIdAndRoadmapId(topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        val newParentId = request.newParentId

        if (newParentId != null) {
            require(newParentId != topicId) { "A topic cannot be moved under itself" }

            val newParent = roadmapTopicRepository.findById(newParentId)
                .orElseThrow { NoSuchElementException("Target parent topic not found: $newParentId") }

            require(roadmapTopicRepository.existsByIdAndRoadmapId(newParentId, roadmapId)) {
                "Target parent topic does not belong to this roadmap"
            }

            val allTopics = roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId)
            require(!isDescendant(allTopics, ancestorId = topicId, candidateId = newParentId)) {
                "Cannot move a topic under one of its own descendants"
            }

            topic.parent = newParent
        } else {
            topic.parent = null
        }

        topic.displayOrder = if (newParentId == null) {
            (roadmapTopicRepository.findMaxDisplayOrderByRoadmapIdAndParentIsNull(roadmapId) ?: -1) + 1
        } else {
            (roadmapTopicRepository.findMaxDisplayOrderByRoadmapIdAndParentId(roadmapId, newParentId) ?: -1) + 1
        }

        roadmapTopicRepository.save(topic)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }

    /**
     * Updates the status of an existing topic and returns the refreshed [RoadmapTreeResponse].
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - Only [status] is updated; parent, displayOrder, title, description, and countable
     *    are unchanged.
     *  - When status is set to [TopicStatus.COMPLETED], [lastActivityAt] is also updated.
     *  - The full refreshed tree is returned so progress recalculates immediately.
     */
    @Transactional
    fun updateTopicStatus(roadmapId: UUID, topicId: UUID, request: UpdateRoadmapTopicStatusRequest, principal: UserPrincipal? = null): RoadmapTreeResponse {
        if (principal != null) checkAccess(roadmapId, principal)
        roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(topicId)
            .orElseThrow { NoSuchElementException("Topic not found: $topicId") }

        require(roadmapTopicRepository.existsByIdAndRoadmapId(topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        topic.status = request.status
        if (request.status == TopicStatus.COMPLETED) {
            topic.lastActivityAt = OffsetDateTime.now()
        }

        roadmapTopicRepository.save(topic)

        return roadmapQueryService.getRoadmapTree(roadmapId)
    }

    /**
     * Returns true if [candidateId] is a descendant of [ancestorId] within the flat topic list.
     * Used to prevent circular parent assignments during a move operation.
     */
    private fun isDescendant(
        allTopics: List<RoadmapTopicEntity>,
        ancestorId: UUID,
        candidateId: UUID
    ): Boolean {
        val childrenMap = mutableMapOf<UUID, MutableList<UUID>>()
        for (t in allTopics) {
            val pid = t.parent?.id ?: continue
            childrenMap.getOrPut(pid) { mutableListOf() }.add(t.id!!)
        }
        val queue = ArrayDeque<UUID>()
        queue.addAll(childrenMap[ancestorId] ?: emptyList())
        while (queue.isNotEmpty()) {
            val current = queue.removeFirst()
            if (current == candidateId) return true
            queue.addAll(childrenMap[current] ?: emptyList())
        }
        return false
    }
}
