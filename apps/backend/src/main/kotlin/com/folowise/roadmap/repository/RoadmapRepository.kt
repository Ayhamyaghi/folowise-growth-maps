package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.RoadmapEntity
import com.folowise.roadmap.domain.enums.RoadmapStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface RoadmapRepository : JpaRepository<RoadmapEntity, UUID> {

    // Traverses the @ManyToOne trainee relationship: trainee.id
    // Used to locate a trainee's active roadmap (enforced unique by DB partial index).
    fun findByTraineeIdAndStatus(traineeId: UUID, status: RoadmapStatus): Optional<RoadmapEntity>

    fun findAllByTraineeIdOrderByCreatedAtDesc(traineeId: UUID): List<RoadmapEntity>
}
