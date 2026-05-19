package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapEntity
import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.entity.TraineeProfileEntity
import com.folowise.roadmap.domain.entity.UserEntity
import com.folowise.roadmap.domain.enums.RoadmapStatus
import com.folowise.roadmap.domain.enums.TopicStatus
import com.folowise.roadmap.domain.enums.UserRole
import com.folowise.roadmap.dto.trainee.CreateTraineeRequest
import com.folowise.roadmap.dto.trainee.TraineeListItemResponse
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import com.folowise.roadmap.repository.SpecializationRepository
import com.folowise.roadmap.repository.TraineeProfileRepository
import com.folowise.roadmap.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TraineeService(
    private val traineeProfileRepository: TraineeProfileRepository,
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val roadmapQueryService: RoadmapQueryService,
    private val userRepository: UserRepository,
    private val specializationRepository: SpecializationRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional
    fun createTrainee(request: CreateTraineeRequest): TraineeListItemResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("Email already in use: ${request.email}")
        }

        val specialization = specializationRepository.findByName(request.specializationName)
            .orElseThrow { IllegalArgumentException("Specialization not found: ${request.specializationName}") }

        val user = userRepository.save(
            UserEntity(
                email = request.email,
                displayName = request.displayName,
                passwordHash = passwordEncoder.encode(request.password),
                role = UserRole.TRAINEE
            )
        )

        val profile = traineeProfileRepository.save(TraineeProfileEntity(user = user, specialization = specialization))

        val roadmapTitle = request.roadmapTitle?.takeIf { it.isNotBlank() } ?: "${request.displayName} Roadmap"
        val roadmap = roadmapRepository.save(RoadmapEntity(trainee = profile, title = roadmapTitle))
        roadmapTopicRepository.save(
            RoadmapTopicEntity(roadmap = roadmap, title = "Learning Path").apply {
                isCountable = false
                status = TopicStatus.NOT_STARTED
                displayOrder = 0
            }
        )

        return buildItem(profile)
    }

    @Transactional(readOnly = true)
    fun listAll(): List<TraineeListItemResponse> =
        traineeProfileRepository.findAllByOrderByCreatedAtDesc().map { buildItem(it) }

    @Transactional(readOnly = true)
    fun getById(traineeId: UUID): TraineeListItemResponse {
        val profile = traineeProfileRepository.findById(traineeId)
            .orElseThrow { NoSuchElementException("Trainee not found: $traineeId") }
        return buildItem(profile)
    }

    private fun buildItem(profile: TraineeProfileEntity): TraineeListItemResponse {
        val profileId = requireNotNull(profile.id)
        val activeRoadmap = roadmapRepository
            .findByTraineeIdAndStatus(profileId, RoadmapStatus.ACTIVE)
            .orElse(null)

        if (activeRoadmap == null) {
            return TraineeListItemResponse(
                traineeId = profileId,
                traineeName = profile.user.displayName,
                traineeEmail = profile.user.email,
                avatarUrl = profile.avatarUrl,
                specialization = profile.specialization.name,
                roadmapId = null,
                roadmapTitle = null,
                roadmapStatus = null,
                progressPercentage = 0.0,
                completedCount = 0,
                totalCount = 0,
                activeTopic = null,
                lastUpdated = null,
                attentionReason = profile.attentionReason
            )
        }

        val roadmapId = requireNotNull(activeRoadmap.id)
        val topics = roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId)
        val progress = roadmapQueryService.calculateProgress(topics)
        val activeTopic = topics.firstOrNull { it.status == TopicStatus.IN_PROGRESS }?.title

        return TraineeListItemResponse(
            traineeId = profileId,
            traineeName = profile.user.displayName,
            traineeEmail = profile.user.email,
            avatarUrl = profile.avatarUrl,
            specialization = profile.specialization.name,
            roadmapId = roadmapId,
            roadmapTitle = activeRoadmap.title,
            roadmapStatus = activeRoadmap.status.name,
            progressPercentage = progress.percentage,
            completedCount = progress.completedCount,
            totalCount = progress.totalCount,
            activeTopic = activeTopic,
            lastUpdated = activeRoadmap.updatedAt,
            attentionReason = profile.attentionReason
        )
    }
}
