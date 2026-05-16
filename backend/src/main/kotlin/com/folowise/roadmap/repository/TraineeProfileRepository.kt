package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.TraineeProfileEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface TraineeProfileRepository : JpaRepository<TraineeProfileEntity, UUID> {

    // Traverses the @OneToOne user relationship: user.id
    fun findByUserId(userId: UUID): Optional<TraineeProfileEntity>

    fun findAllByOrderByCreatedAtDesc(): List<TraineeProfileEntity>
}
