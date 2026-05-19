package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.ActivityEventEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ActivityEventRepository : JpaRepository<ActivityEventEntity, UUID> {

    // Global activity log (manager view): all events, newest first.
    fun findAllByOrderByCreatedAtDesc(): List<ActivityEventEntity>

    // Events performed by a specific user (manager or trainee), newest first.
    // Traverses the @ManyToOne actor relationship: actor.id
    fun findAllByActorIdOrderByCreatedAtDesc(actorId: UUID): List<ActivityEventEntity>

    // Events scoped to a specific roadmap, newest first.
    // roadmapId is a plain UUID field (soft reference, no JPA relationship) —
    // resolves directly without traversal.
    fun findAllByRoadmapIdOrderByCreatedAtDesc(roadmapId: UUID): List<ActivityEventEntity>
}
