package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RoadmapTopicRepository : JpaRepository<RoadmapTopicEntity, UUID> {

    // All topics in a roadmap, ordered for consistent list/tree rendering.
    // Traverses the @ManyToOne roadmap relationship: roadmap.id
    fun findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId: UUID): List<RoadmapTopicEntity>

    // Root-level topics only (parent IS NULL) — entry points for tree traversal.
    fun findAllByRoadmapIdAndParentIsNullOrderByDisplayOrderAsc(roadmapId: UUID): List<RoadmapTopicEntity>

    // Direct children of a given parent topic, in display order.
    // Traverses the @ManyToOne parent relationship: parent.id
    fun findAllByParentIdOrderByDisplayOrderAsc(parentId: UUID): List<RoadmapTopicEntity>

    // Ownership guard: confirm a topic belongs to a specific roadmap before
    // applying any structural change. Traverses roadmap.id.
    fun existsByIdAndRoadmapId(id: UUID, roadmapId: UUID): Boolean
}
