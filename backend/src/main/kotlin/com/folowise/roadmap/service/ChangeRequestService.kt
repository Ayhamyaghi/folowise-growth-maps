package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapChangeRequestEntity
import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.enums.ChangeRequestAction
import com.folowise.roadmap.domain.enums.ChangeRequestStatus
import com.folowise.roadmap.dto.changerequest.ChangeRequestResponse
import com.folowise.roadmap.dto.changerequest.RejectChangeRequestRequest
import com.folowise.roadmap.dto.changerequest.SubmitAddTopicRequest
import com.folowise.roadmap.dto.changerequest.SubmitDeleteTopicRequest
import com.folowise.roadmap.dto.changerequest.SubmitEditTopicRequest
import com.folowise.roadmap.dto.changerequest.SubmitMoveTopicRequest
import com.folowise.roadmap.dto.roadmap.AddRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.EditRoadmapTopicRequest
import com.folowise.roadmap.dto.roadmap.MoveRoadmapTopicRequest
import com.folowise.roadmap.repository.RoadmapChangeRequestRepository
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import com.folowise.roadmap.repository.UserRepository
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

@Service
class ChangeRequestService(
    private val changeRequestRepository: RoadmapChangeRequestRepository,
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val userRepository: UserRepository,
    private val roadmapMutationService: RoadmapMutationService
) {

    /**
     * Submits an ADD_TOPIC change request.
     *
     * Rules:
     *  - Roadmap must exist.
     *  - If [SubmitAddTopicRequest.parentId] is provided, the parent topic must exist
     *    and belong to the same roadmap.
     *  - Topic is NOT created immediately — request is stored as PENDING.
     */
    @Transactional
    fun submitAddTopicRequest(
        roadmapId: UUID,
        request: SubmitAddTopicRequest,
        principal: UserPrincipal
    ): ChangeRequestResponse {
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val trimmedTitle = request.title.trim()
        require(trimmedTitle.isNotEmpty()) { "Title must not be blank" }

        val proposedParent = if (request.parentId != null) {
            val parent = roadmapTopicRepository.findById(request.parentId)
                .orElseThrow { NoSuchElementException("Parent topic not found: ${request.parentId}") }
            require(roadmapTopicRepository.existsByIdAndRoadmapId(request.parentId, roadmapId)) {
                "Parent topic does not belong to this roadmap"
            }
            parent
        } else null

        val requestedBy = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("User not found: ${principal.id}") }

        val changeRequest = RoadmapChangeRequestEntity(
            roadmap = roadmap,
            requestedBy = requestedBy,
            action = ChangeRequestAction.ADD_TOPIC,
            description = "Add topic: $trimmedTitle"
        ).apply {
            proposedTitle = trimmedTitle
            proposedDescription = request.description?.trim()?.takeIf { it.isNotEmpty() }
            proposedCountable = request.countable
            this.proposedParent = proposedParent
        }

        val saved = changeRequestRepository.save(changeRequest)
        return toResponse(saved)
    }

    /**
     * Submits an EDIT_TOPIC change request.
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - Title must not be blank.
     *  - Topic is NOT edited immediately — request is stored as PENDING.
     */
    @Transactional
    fun submitEditTopicRequest(
        roadmapId: UUID,
        request: SubmitEditTopicRequest,
        principal: UserPrincipal
    ): ChangeRequestResponse {
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(request.topicId)
            .orElseThrow { NoSuchElementException("Topic not found: ${request.topicId}") }
        require(roadmapTopicRepository.existsByIdAndRoadmapId(request.topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        val trimmedTitle = request.title.trim()
        require(trimmedTitle.isNotEmpty()) { "Title must not be blank" }

        val requestedBy = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("User not found: ${principal.id}") }

        val changeRequest = RoadmapChangeRequestEntity(
            roadmap = roadmap,
            requestedBy = requestedBy,
            action = ChangeRequestAction.EDIT_TOPIC,
            description = "Edit topic: ${topic.title}"
        ).apply {
            this.topic = topic
            proposedTitle = trimmedTitle
            proposedDescription = request.description?.trim()?.takeIf { it.isNotEmpty() }
            proposedCountable = request.countable
        }

        val saved = changeRequestRepository.save(changeRequest)
        return toResponse(saved)
    }

    /**
     * Submits a DELETE_TOPIC change request.
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - Topic is NOT deleted immediately — request is stored as PENDING.
     */
    @Transactional
    fun submitDeleteTopicRequest(
        roadmapId: UUID,
        request: SubmitDeleteTopicRequest,
        principal: UserPrincipal
    ): ChangeRequestResponse {
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(request.topicId)
            .orElseThrow { NoSuchElementException("Topic not found: ${request.topicId}") }
        require(roadmapTopicRepository.existsByIdAndRoadmapId(request.topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        val requestedBy = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("User not found: ${principal.id}") }

        val changeRequest = RoadmapChangeRequestEntity(
            roadmap = roadmap,
            requestedBy = requestedBy,
            action = ChangeRequestAction.DELETE_TOPIC,
            description = "Delete topic: ${topic.title}"
        ).apply {
            this.topic = topic
        }

        val saved = changeRequestRepository.save(changeRequest)
        return toResponse(saved)
    }

    /**
     * Submits a MOVE_TOPIC change request.
     *
     * Rules:
     *  - Roadmap must exist.
     *  - Topic must exist and belong to the same roadmap.
     *  - If [SubmitMoveTopicRequest.newParentId] is provided: parent must exist, belong to
     *    the same roadmap, must not be the topic itself, and must not be a descendant of the topic.
     *  - Topic is NOT moved immediately — request is stored as PENDING.
     */
    @Transactional
    fun submitMoveTopicRequest(
        roadmapId: UUID,
        request: SubmitMoveTopicRequest,
        principal: UserPrincipal
    ): ChangeRequestResponse {
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val topic = roadmapTopicRepository.findById(request.topicId)
            .orElseThrow { NoSuchElementException("Topic not found: ${request.topicId}") }
        require(roadmapTopicRepository.existsByIdAndRoadmapId(request.topicId, roadmapId)) {
            "Topic does not belong to this roadmap"
        }

        val proposedParent = if (request.newParentId != null) {
            require(request.newParentId != request.topicId) { "A topic cannot be moved under itself" }

            val parent = roadmapTopicRepository.findById(request.newParentId)
                .orElseThrow { NoSuchElementException("Parent topic not found: ${request.newParentId}") }
            require(roadmapTopicRepository.existsByIdAndRoadmapId(request.newParentId, roadmapId)) {
                "Target parent topic does not belong to this roadmap"
            }

            val allTopics = roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId)
            require(!isDescendant(allTopics, ancestorId = request.topicId, candidateId = request.newParentId)) {
                "Cannot move a topic under one of its own descendants"
            }

            parent
        } else null

        val requestedBy = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("User not found: ${principal.id}") }

        val changeRequest = RoadmapChangeRequestEntity(
            roadmap = roadmap,
            requestedBy = requestedBy,
            action = ChangeRequestAction.MOVE_TOPIC,
            description = "Move topic: ${topic.title}"
        ).apply {
            this.topic = topic
            this.proposedParent = proposedParent
        }

        val saved = changeRequestRepository.save(changeRequest)
        return toResponse(saved)
    }

    /**
     * Returns all PENDING change requests, ordered oldest first (FIFO review queue).
     * Only MANAGER should call this; authorization is enforced at the security layer.
     */
    @Transactional(readOnly = true)
    fun getPendingRequests(): List<ChangeRequestResponse> =
        changeRequestRepository.findAllByStatusOrderByCreatedAtAsc(ChangeRequestStatus.PENDING)
            .map { toResponse(it) }

    /**
     * Returns all change requests submitted by the currently authenticated user,
     * ordered newest first.
     */
    @Transactional(readOnly = true)
    fun getMyRequests(principal: UserPrincipal): List<ChangeRequestResponse> =
        changeRequestRepository.findAllByRequestedByIdOrderByCreatedAtDesc(principal.id)
            .map { toResponse(it) }

    /**
     * Approves a PENDING change request.
     *
     * For each action type, the corresponding roadmap mutation is applied using
     * the same business rules as direct manager mutations. On success the request
     * is marked APPROVED.
     *
     * Edge case for DELETE_TOPIC: if the topic was deleted by other means after the
     * request was submitted (topic FK becomes NULL), we treat it as idempotently approved.
     */
    @Transactional
    fun approveRequest(requestId: UUID, principal: UserPrincipal): ChangeRequestResponse {
        val changeRequest = changeRequestRepository.findById(requestId)
            .orElseThrow { NoSuchElementException("Change request not found: $requestId") }

        require(changeRequest.status == ChangeRequestStatus.PENDING) {
            "Change request is not pending (current status: ${changeRequest.status})"
        }

        val manager = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("Manager user not found: ${principal.id}") }

        val roadmapId = requireNotNull(changeRequest.roadmap.id)

        when (changeRequest.action) {
            ChangeRequestAction.ADD_TOPIC -> {
                val proposedTitle = requireNotNull(changeRequest.proposedTitle) {
                    "ADD_TOPIC request is missing proposedTitle"
                }
                roadmapMutationService.addTopic(
                    roadmapId = roadmapId,
                    request = AddRoadmapTopicRequest(
                        title = proposedTitle,
                        description = changeRequest.proposedDescription,
                        parentId = changeRequest.proposedParent?.id,
                        countable = changeRequest.proposedCountable
                    )
                )
            }

            ChangeRequestAction.EDIT_TOPIC -> {
                val topicId = requireNotNull(changeRequest.topic?.id) {
                    "EDIT_TOPIC request topic no longer exists"
                }
                roadmapMutationService.editTopic(
                    roadmapId = roadmapId,
                    topicId = topicId,
                    request = EditRoadmapTopicRequest(
                        title = requireNotNull(changeRequest.proposedTitle) {
                            "EDIT_TOPIC request is missing proposedTitle"
                        },
                        description = changeRequest.proposedDescription,
                        countable = changeRequest.proposedCountable
                    )
                )
            }

            ChangeRequestAction.DELETE_TOPIC -> {
                val topicId = changeRequest.topic?.id
                if (topicId != null) {
                    // Clear the FK reference before deleting the topic. If we leave topic non-null,
                    // Hibernate's first-level cache will write the stale topic_id back to the DB
                    // when it flushes the UPDATE for this change request, violating the FK constraint
                    // (the topic row is already deleted by then via ON DELETE SET NULL).
                    changeRequest.topic = null
                    roadmapMutationService.deleteTopic(roadmapId = roadmapId, topicId = topicId)
                }
                // If topic is already gone (FK set to NULL), approval is a no-op.
            }

            ChangeRequestAction.MOVE_TOPIC -> {
                val topicId = requireNotNull(changeRequest.topic?.id) {
                    "MOVE_TOPIC request topic no longer exists"
                }
                roadmapMutationService.moveTopic(
                    roadmapId = roadmapId,
                    topicId = topicId,
                    request = MoveRoadmapTopicRequest(newParentId = changeRequest.proposedParent?.id)
                )
            }
        }

        changeRequest.status = ChangeRequestStatus.APPROVED
        changeRequest.reviewedBy = manager
        changeRequest.reviewedAt = OffsetDateTime.now()

        val saved = changeRequestRepository.save(changeRequest)
        return toResponse(saved)
    }

    /**
     * Rejects a PENDING change request. The roadmap is not modified.
     */
    @Transactional
    fun rejectRequest(
        requestId: UUID,
        request: RejectChangeRequestRequest,
        principal: UserPrincipal
    ): ChangeRequestResponse {
        val changeRequest = changeRequestRepository.findById(requestId)
            .orElseThrow { NoSuchElementException("Change request not found: $requestId") }

        require(changeRequest.status == ChangeRequestStatus.PENDING) {
            "Change request is not pending (current status: ${changeRequest.status})"
        }

        val manager = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("Manager user not found: ${principal.id}") }

        changeRequest.status = ChangeRequestStatus.REJECTED
        changeRequest.reviewedBy = manager
        changeRequest.reviewedAt = OffsetDateTime.now()
        changeRequest.managerNote = request.managerNote?.trim()?.takeIf { it.isNotEmpty() }

        val saved = changeRequestRepository.save(changeRequest)
        return toResponse(saved)
    }

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

    private fun toResponse(entity: RoadmapChangeRequestEntity) = ChangeRequestResponse(
        id = requireNotNull(entity.id),
        roadmapId = requireNotNull(entity.roadmap.id),
        roadmapTitle = entity.roadmap.title,
        action = entity.action.name,
        status = entity.status.name,
        description = entity.description,
        requestedByEmail = entity.requestedBy.email,
        requestedByDisplayName = entity.requestedBy.displayName,
        proposedTitle = entity.proposedTitle,
        proposedDescription = entity.proposedDescription,
        proposedParentId = entity.proposedParent?.id,
        proposedParentTitle = entity.proposedParent?.title,
        proposedCountable = entity.proposedCountable,
        managerNote = entity.managerNote,
        createdAt = entity.createdAt
    )
}
