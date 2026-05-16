package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.RoadmapChangeRequestEntity
import com.folowise.roadmap.domain.enums.ChangeRequestStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface RoadmapChangeRequestRepository : JpaRepository<RoadmapChangeRequestEntity, UUID> {

    // Manager view: all requests for a specific roadmap, newest first.
    // Traverses the @ManyToOne roadmap relationship: roadmap.id
    fun findAllByRoadmapIdOrderByCreatedAtDesc(roadmapId: UUID): List<RoadmapChangeRequestEntity>

    // Trainee view: requests submitted by a specific user, newest first.
    // Traverses the @ManyToOne requestedBy relationship: requestedBy.id
    fun findAllByRequestedByIdOrderByCreatedAtDesc(requestedById: UUID): List<RoadmapChangeRequestEntity>

    // Manager review queue: all requests of a given status, oldest first (FIFO review order).
    // status is a direct field on RoadmapChangeRequestEntity — no traversal needed.
    fun findAllByStatusOrderByCreatedAtAsc(status: ChangeRequestStatus): List<RoadmapChangeRequestEntity>
}
