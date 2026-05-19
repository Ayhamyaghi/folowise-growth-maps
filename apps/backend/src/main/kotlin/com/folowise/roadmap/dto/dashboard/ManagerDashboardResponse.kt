package com.folowise.roadmap.dto.dashboard

data class ManagerDashboardResponse(
    val totalTrainees: Int,
    val activeRoadmaps: Int,
    val averageProgress: Double,
    val pendingChangeRequests: Int,
    val completedTopicsThisWeek: Int,
    val traineeProgressSummaries: List<TraineeProgressSummary>,
    val recentPendingRequests: List<PendingRequestSummary>
)
