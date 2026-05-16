package com.folowise.roadmap.repository

import com.folowise.roadmap.domain.entity.TopicResourceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
interface TopicResourceRepository : JpaRepository<TopicResourceEntity, UUID> {

    // Traverses the @ManyToOne topic relationship: topic.id
    fun findAllByTopicIdOrderByCreatedAtDesc(topicId: UUID): List<TopicResourceEntity>

    // Bulk removal used when a topic is deleted via service (before the topic row is removed).
    // DB ON DELETE CASCADE also handles this, but explicit deletion keeps JPA state consistent.
    @Transactional
    fun deleteAllByTopicId(topicId: UUID)
}
