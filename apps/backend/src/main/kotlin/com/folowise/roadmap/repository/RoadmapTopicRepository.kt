package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
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

    // Returns the highest displayOrder among root-level siblings, or null if none exist.
    // Used to calculate the next displayOrder when adding a root-level topic.
    @Query("SELECT MAX(t.displayOrder) FROM RoadmapTopicEntity t WHERE t.roadmap.id = :roadmapId AND t.parent IS NULL")
    fun findMaxDisplayOrderByRoadmapIdAndParentIsNull(@Param("roadmapId") roadmapId: UUID): Int?

    // Returns the highest displayOrder among siblings under a given parent, or null if none exist.
    // Used to calculate the next displayOrder when adding a child topic.
    @Query("SELECT MAX(t.displayOrder) FROM RoadmapTopicEntity t WHERE t.roadmap.id = :roadmapId AND t.parent.id = :parentId")
    fun findMaxDisplayOrderByRoadmapIdAndParentId(
        @Param("roadmapId") roadmapId: UUID,
        @Param("parentId") parentId: UUID
    ): Int?
}
