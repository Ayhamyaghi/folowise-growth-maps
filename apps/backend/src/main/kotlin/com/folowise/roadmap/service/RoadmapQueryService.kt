package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.entity.TopicResourceEntity
import com.folowise.roadmap.domain.enums.RoadmapStatus
import com.folowise.roadmap.domain.enums.TopicStatus
import com.folowise.roadmap.dto.resource.TopicResourceNodeResponse
import com.folowise.roadmap.dto.roadmap.RoadmapProgressResponse
import com.folowise.roadmap.dto.roadmap.RoadmapTopicNodeResponse
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import com.folowise.roadmap.repository.TopicResourceRepository
import com.folowise.roadmap.repository.TraineeProfileRepository
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class RoadmapQueryService(
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val topicResourceRepository: TopicResourceRepository,
    private val traineeProfileRepository: TraineeProfileRepository
) {

    /**
     * Loads the active roadmap for the authenticated trainee.
     * Throws [NoSuchElementException] if the user has no trainee profile or no active roadmap.
     */
    @Transactional(readOnly = true)
    fun getMyRoadmapTree(principal: UserPrincipal): RoadmapTreeResponse {
        val profile = traineeProfileRepository.findByUserId(principal.id)
            .orElseThrow { NoSuchElementException("No trainee profile found for current user") }
        val roadmap = roadmapRepository.findByTraineeIdAndStatus(requireNotNull(profile.id), RoadmapStatus.ACTIVE)
            .orElseThrow { NoSuchElementException("No active roadmap found for current user") }
        return getRoadmapTree(requireNotNull(roadmap.id))
    }

    /**
     * Validates that [principal] is allowed to access [roadmapId].
     * MANAGER may access any roadmap. TRAINEE may only access their own active roadmap.
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
     * Loads a roadmap by [roadmapId] and returns a fully nested tree response
     * ready for both List View and Tree View rendering.
     *
     * When [principal] is supplied, ownership is validated before loading.
     * Throws [NoSuchElementException] if no roadmap exists with the given id.
     */
    @Transactional(readOnly = true)
    fun getRoadmapTree(roadmapId: UUID, principal: UserPrincipal? = null): RoadmapTreeResponse {
        if (principal != null) checkAccess(roadmapId, principal)
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val flatTopics = roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId)

        val topicIds = flatTopics.mapNotNull { it.id }
        val resourcesByTopicId: Map<UUID, List<TopicResourceEntity>> = if (topicIds.isEmpty()) emptyMap()
            else topicResourceRepository.findAllByTopicIdIn(topicIds)
                .groupBy { requireNotNull(it.topic.id) }

        val trainee = roadmap.trainee

        return RoadmapTreeResponse(
            roadmapId = requireNotNull(roadmap.id),
            title = roadmap.title,
            description = roadmap.description,
            status = roadmap.status.name,
            progress = calculateProgress(flatTopics),
            topics = buildTopicTree(flatTopics, resourcesByTopicId),
            traineeId = trainee.id,
            traineeName = trainee.user.displayName,
            traineeAvatarUrl = trainee.avatarUrl,
            traineeSpecialization = trainee.specialization.name
        )
    }

    /**
     * Builds a nested tree from a flat list of [topics] that all belong to the same roadmap.
     *
     * Algorithm:
     *   1. Map every topic by its UUID for O(1) parent lookup.
     *   2. For each topic, create a mutable node and register it.
     *   3. Assign each non-root node to its parent's children list.
     *   4. Sort each node's children by [displayOrder] — sibling ordering is
     *      local to each parent and cannot be inferred from the flat DB ordering alone.
     *
     * Returns only the root-level nodes; children are nested recursively inside them.
     */
    fun buildTopicTree(
        topics: List<RoadmapTopicEntity>,
        resourcesByTopicId: Map<UUID, List<TopicResourceEntity>> = emptyMap()
    ): List<RoadmapTopicNodeResponse> {
        // Intermediate mutable node used only during tree assembly.
        data class MutableNode(
            val response: RoadmapTopicNodeResponse,
            val children: MutableList<MutableNode> = mutableListOf()
        )

        // Pass 1: register every node in the map.
        // Must complete before pass 2 so that all parents are present regardless
        // of the order topics arrive in (global displayOrder sort is NOT topological).
        val nodeMap = LinkedHashMap<UUID, MutableNode>(topics.size)
        for (topic in topics) {
            val id = requireNotNull(topic.id) { "Topic id must not be null" }
            val resources = resourcesByTopicId[id]?.map { r ->
                TopicResourceNodeResponse(
                    id = requireNotNull(r.id),
                    title = r.title,
                    resourceType = r.resourceType.name,
                    url = r.url,
                    note = r.note,
                    addedByName = r.addedBy.displayName
                )
            } ?: emptyList()
            nodeMap[id] = MutableNode(
                response = RoadmapTopicNodeResponse(
                    id = id,
                    parentId = topic.parent?.id,
                    title = topic.title,
                    description = topic.description,
                    status = topic.status.name,
                    countable = topic.isCountable,
                    displayOrder = topic.displayOrder,
                    children = emptyList(), // replaced below after sorting
                    resources = resources
                )
            )
        }

        // Pass 2: wire parent → child relationships.
        // Every parent is guaranteed to be in nodeMap at this point.
        val roots = mutableListOf<MutableNode>()
        for (topic in topics) {
            val id = requireNotNull(topic.id) { "Topic id must not be null" }
            val node = nodeMap[id]!!
            val parentId = topic.parent?.id
            if (parentId == null) {
                roots.add(node)
            } else {
                nodeMap[parentId]?.children?.add(node)
            }
        }

        // Recursively materialise the final immutable response tree with sorted children.
        fun MutableNode.toResponse(): RoadmapTopicNodeResponse {
            val sortedChildren = children
                .sortedBy { it.response.displayOrder }
                .map { it.toResponse() }
            return response.copy(children = sortedChildren)
        }

        return roots
            .sortedBy { it.response.displayOrder }
            .map { it.toResponse() }
    }

    /**
     * Calculates roadmap progress from a flat list of [topics].
     *
     * Only topics with [isCountable] = true are included.
     * A topic counts as completed when its status is [TopicStatus.COMPLETED].
     * Returns 0.0 percentage when there are no countable topics.
     */
    fun calculateProgress(topics: List<RoadmapTopicEntity>): RoadmapProgressResponse {
        val countable = topics.filter { it.isCountable }
        val completed = countable.count { it.status == TopicStatus.COMPLETED }
        val total = countable.size
        val percentage = if (total == 0) 0.0
            else Math.round(completed.toDouble() / total * 1000.0) / 10.0

        return RoadmapProgressResponse(
            completedCount = completed,
            totalCount = total,
            percentage = percentage
        )
    }
}
