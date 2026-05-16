package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.enums.TopicStatus
import com.folowise.roadmap.dto.roadmap.RoadmapProgressResponse
import com.folowise.roadmap.dto.roadmap.RoadmapTopicNodeResponse
import com.folowise.roadmap.dto.roadmap.RoadmapTreeResponse
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class RoadmapQueryService(
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository
) {

    /**
     * Loads a roadmap by [roadmapId] and returns a fully nested tree response
     * ready for both List View and Tree View rendering.
     *
     * Throws [NoSuchElementException] if no roadmap exists with the given id.
     */
    fun getRoadmapTree(roadmapId: UUID): RoadmapTreeResponse {
        val roadmap = roadmapRepository.findById(roadmapId)
            .orElseThrow { NoSuchElementException("Roadmap not found: $roadmapId") }

        val flatTopics = roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId)

        return RoadmapTreeResponse(
            roadmapId = requireNotNull(roadmap.id),
            title = roadmap.title,
            description = roadmap.description,
            status = roadmap.status.name,
            progress = calculateProgress(flatTopics),
            topics = buildTopicTree(flatTopics)
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
    fun buildTopicTree(topics: List<RoadmapTopicEntity>): List<RoadmapTopicNodeResponse> {
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
            nodeMap[id] = MutableNode(
                response = RoadmapTopicNodeResponse(
                    id = id,
                    parentId = topic.parent?.id,
                    title = topic.title,
                    description = topic.description,
                    status = topic.status.name,
                    countable = topic.isCountable,
                    displayOrder = topic.displayOrder,
                    children = emptyList() // replaced below after sorting
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
