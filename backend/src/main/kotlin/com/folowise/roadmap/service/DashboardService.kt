package com.folowise.roadmap.service

import com.folowise.roadmap.domain.entity.RoadmapTopicEntity
import com.folowise.roadmap.domain.entity.TraineeProfileEntity
import com.folowise.roadmap.domain.enums.ChangeRequestStatus
import com.folowise.roadmap.domain.enums.RoadmapStatus
import com.folowise.roadmap.domain.enums.TopicStatus
import com.folowise.roadmap.dto.dashboard.CompletedTopicSummary
import com.folowise.roadmap.dto.dashboard.ManagerDashboardResponse
import com.folowise.roadmap.dto.dashboard.PendingRequestSummary
import com.folowise.roadmap.dto.dashboard.RecentRequestSummary
import com.folowise.roadmap.dto.dashboard.TraineeDashboardResponse
import com.folowise.roadmap.dto.dashboard.TraineeProgressSummary
import com.folowise.roadmap.repository.RoadmapChangeRequestRepository
import com.folowise.roadmap.repository.RoadmapRepository
import com.folowise.roadmap.repository.RoadmapTopicRepository
import com.folowise.roadmap.repository.TraineeProfileRepository
import com.folowise.roadmap.security.UserPrincipal
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime

@Service
class DashboardService(
    private val traineeProfileRepository: TraineeProfileRepository,
    private val roadmapRepository: RoadmapRepository,
    private val roadmapTopicRepository: RoadmapTopicRepository,
    private val changeRequestRepository: RoadmapChangeRequestRepository,
    private val roadmapQueryService: RoadmapQueryService
) {

    /**
     * Returns aggregated statistics and per-trainee progress for the manager dashboard.
     *
     * For each trainee with an active roadmap, calculates progress using the same
     * logic as the roadmap tree endpoint. Trainees without an active roadmap are
     * included in the summaries list with zero progress.
     */
    @Transactional(readOnly = true)
    fun getManagerDashboard(): ManagerDashboardResponse {
        val allProfiles = traineeProfileRepository.findAllByOrderByCreatedAtDesc()

        // Build per-trainee summaries, loading topics only for active roadmaps.
        val summaries = allProfiles.map { profile -> buildTraineeProgressSummary(profile) }

        val activeRoadmaps = summaries.count { it.summary.roadmapId != null }

        val averageProgress = if (activeRoadmaps == 0) 0.0
            else summaries.filter { it.summary.roadmapId != null }
                .map { it.summary.progressPercentage }
                .average()
                .let { avg -> Math.round(avg * 10.0) / 10.0 }

        val pendingRequests = changeRequestRepository
            .findAllByStatusOrderByCreatedAtAsc(ChangeRequestStatus.PENDING)

        val pendingChangeRequestsCount = pendingRequests.size

        val completedTopicsThisWeek = summaries.sumOf { it.completedThisWeek }

        val recentPendingRequests = pendingRequests.take(3).map { cr ->
            PendingRequestSummary(
                id = requireNotNull(cr.id),
                requestedByDisplayName = cr.requestedBy.displayName,
                action = cr.action.name,
                proposedTitle = cr.proposedTitle,
                description = cr.description
            )
        }

        return ManagerDashboardResponse(
            totalTrainees = allProfiles.size,
            activeRoadmaps = activeRoadmaps,
            averageProgress = averageProgress,
            pendingChangeRequests = pendingChangeRequestsCount,
            completedTopicsThisWeek = completedTopicsThisWeek,
            traineeProgressSummaries = summaries.map { it.summary },
            recentPendingRequests = recentPendingRequests
        )
    }

    /**
     * Returns dashboard data for the currently authenticated trainee.
     * Only the trainee's own roadmap and requests are included.
     */
    @Transactional(readOnly = true)
    fun getTraineeDashboard(principal: UserPrincipal): TraineeDashboardResponse {
        val profile = traineeProfileRepository.findByUserId(principal.id)
            .orElseThrow { NoSuchElementException("Trainee profile not found for user: ${principal.id}") }

        val profileId = requireNotNull(profile.id)
        val activeRoadmap = roadmapRepository
            .findByTraineeIdAndStatus(profileId, RoadmapStatus.ACTIVE)
            .orElse(null)

        val topics: List<RoadmapTopicEntity> = if (activeRoadmap != null) {
            roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(requireNotNull(activeRoadmap.id))
        } else emptyList()

        val progress = roadmapQueryService.calculateProgress(topics)

        val activeTopic = topics.firstOrNull { it.status == TopicStatus.IN_PROGRESS }?.title

        val recentlyCompleted = topics
            .filter { it.status == TopicStatus.COMPLETED }
            .sortedByDescending { it.lastActivityAt ?: it.updatedAt }
            .take(5)
            .map { topic ->
                CompletedTopicSummary(
                    id = requireNotNull(topic.id),
                    title = topic.title,
                    completedAt = topic.lastActivityAt ?: topic.updatedAt
                )
            }

        val allMyRequests = changeRequestRepository
            .findAllByRequestedByIdOrderByCreatedAtDesc(principal.id)

        val pendingRequestsCount = allMyRequests.count { it.status == ChangeRequestStatus.PENDING }

        val recentRequests = allMyRequests.take(5).map { cr ->
            RecentRequestSummary(
                id = requireNotNull(cr.id),
                action = cr.action.name,
                status = cr.status.name,
                proposedTitle = cr.proposedTitle,
                description = cr.description,
                createdAt = cr.createdAt
            )
        }

        return TraineeDashboardResponse(
            traineeId = profileId,
            traineeName = profile.user.displayName,
            specialization = profile.specialization.name,
            roadmapId = activeRoadmap?.id,
            roadmapTitle = activeRoadmap?.title,
            roadmapStatus = activeRoadmap?.status?.name,
            progressPercentage = progress.percentage,
            completedCount = progress.completedCount,
            totalCount = progress.totalCount,
            activeTopic = activeTopic,
            pendingRequestsCount = pendingRequestsCount,
            recentRequests = recentRequests,
            recentlyCompletedTopics = recentlyCompleted
        )
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Internal holder to carry both the DTO and the "completed this week" count
     * without an extra pass over the data.
     */
    private data class TraineeSummaryResult(
        val summary: TraineeProgressSummary,
        val completedThisWeek: Int
    )

    private fun buildTraineeProgressSummary(profile: TraineeProfileEntity): TraineeSummaryResult {
        val profileId = requireNotNull(profile.id)
        val activeRoadmap = roadmapRepository
            .findByTraineeIdAndStatus(profileId, RoadmapStatus.ACTIVE)
            .orElse(null)

        if (activeRoadmap == null) {
            return TraineeSummaryResult(
                summary = TraineeProgressSummary(
                    traineeId = profileId,
                    traineeName = profile.user.displayName,
                    traineeEmail = profile.user.email,
                    avatarUrl = profile.avatarUrl,
                    roadmapId = null,
                    roadmapTitle = null,
                    progressPercentage = 0.0,
                    completedCount = 0,
                    totalCount = 0,
                    attentionReason = profile.attentionReason,
                    lastUpdated = null
                ),
                completedThisWeek = 0
            )
        }

        val roadmapId = requireNotNull(activeRoadmap.id)
        val topics = roadmapTopicRepository.findAllByRoadmapIdOrderByDisplayOrderAsc(roadmapId)
        val progress = roadmapQueryService.calculateProgress(topics)

        val sevenDaysAgo = OffsetDateTime.now().minusDays(7)
        val completedThisWeek = topics.count { topic ->
            topic.status == TopicStatus.COMPLETED &&
                topic.lastActivityAt != null &&
                topic.lastActivityAt!!.isAfter(sevenDaysAgo)
        }

        return TraineeSummaryResult(
            summary = TraineeProgressSummary(
                traineeId = profileId,
                traineeName = profile.user.displayName,
                traineeEmail = profile.user.email,
                avatarUrl = profile.avatarUrl,
                roadmapId = roadmapId,
                roadmapTitle = activeRoadmap.title,
                progressPercentage = progress.percentage,
                completedCount = progress.completedCount,
                totalCount = progress.totalCount,
                attentionReason = profile.attentionReason,
                lastUpdated = activeRoadmap.updatedAt
            ),
            completedThisWeek = completedThisWeek
        )
    }
}
