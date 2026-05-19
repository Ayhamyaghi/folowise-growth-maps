package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.SpecializationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface SpecializationRepository : JpaRepository<SpecializationEntity, UUID> {

    fun findByName(name: String): Optional<SpecializationEntity>

    fun existsByName(name: String): Boolean
}
