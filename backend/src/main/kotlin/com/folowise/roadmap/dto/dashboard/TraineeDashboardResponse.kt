package com.folowise.roadmap.dto.dashboard

import java.util.UUID

data class TraineeDashboardResponse(
    val traineeId: UUID,
    val traineeName: String,
    val specialization: String?,
    val roadmapId: UUID?,
    val roadmapTitle: String?,
    val roadmapStatus: String?,
    val progressPercentage: Double,
    val completedCount: Int,
    val totalCount: Int,
    val activeTopic: String?,
    val pendingRequestsCount: Int,
    val recentRequests: List<RecentRequestSummary>,
    val recentlyCompletedTopics: List<CompletedTopicSummary>
)
