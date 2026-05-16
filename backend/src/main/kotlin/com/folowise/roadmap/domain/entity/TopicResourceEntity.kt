package com.folowise.roadmap.domain.entity

import com.folowise.roadmap.domain.enums.ResourceType
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.OffsetDateTime
import java.util.UUID

/**
 * A study or reference material attached to a roadmap topic.
 * Maps to the [topic_resources] table (V4 migration).
 *
 * Resources do not require manager approval — both managers and trainees
 * can add them directly.
 *
 * URL constraint (enforced at DB level):
 *   - [url] is required for all resource types except NOTES.
 *   - The service layer must validate this before persisting.
 */
@Entity
@Table(name = "topic_resources")
open class TopicResourceEntity(

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "topic_id", nullable = false, updatable = false)
    open var topic: RoadmapTopicEntity,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "added_by_id", nullable = false, updatable = false)
    open var addedBy: UserEntity,

    @Column(name = "title", nullable = false, length = 255)
    open var title: String,

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "resource_type", nullable = false)
    open var resourceType: ResourceType

) {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    open var id: UUID? = null

    // Required for all types except NOTES. Validated by the service layer.
    @Column(name = "url", length = 2048)
    open var url: String? = null

    @Column(name = "note", columnDefinition = "TEXT")
    open var note: String? = null

    @Column(name = "created_at", nullable = false, updatable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: OffsetDateTime = OffsetDateTime.now()
}
