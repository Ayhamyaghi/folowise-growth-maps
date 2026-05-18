const API_BASE = '/api/v1';

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function clearToken(): void {
  localStorage.removeItem('auth_token');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    // Try to extract the backend's error message from the JSON ApiError body.
    let message = `Request failed: ${res.status}`;
    try {
      const errorBody = await res.json();
      if (errorBody.message) message = errorBody.message;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
  email: string;
  role: string;
}

export interface CurrentUserResponse {
  userId: string;
  email: string;
  role: string;
}

export interface ApiTopicNode {
  id: string;
  parentId: string | null;
  title: string;
  description: string | null;
  status: string;
  countable: boolean;
  displayOrder: number;
  children: ApiTopicNode[];
}

export interface ApiRoadmapTree {
  roadmapId: string;
  title: string;
  description: string | null;
  status: string;
  progress: {
    completedCount: number;
    totalCount: number;
    percentage: number;
  };
  topics: ApiTopicNode[];
}

export interface AddTopicRequest {
  title: string;
  description?: string;
  parentId?: string | null;
  countable: boolean;
}

export interface EditTopicRequest {
  title: string;
  description?: string;
  countable: boolean;
}

export interface MoveTopicRequest {
  newParentId: string | null;
}

export interface UpdateTopicStatusRequest {
  status: string;
}

export const authApi = {
  me: () => apiFetch<CurrentUserResponse>('/auth/me'),
};

export interface ChangeRequestResponse {
  id: string;
  roadmapId: string;
  roadmapTitle: string;
  action: string;
  status: string;
  description: string;
  requestedByEmail: string;
  requestedByDisplayName: string;
  proposedTitle: string | null;
  proposedDescription: string | null;
  proposedParentId: string | null;
  proposedParentTitle: string | null;
  proposedCountable: boolean;
  managerNote: string | null;
  createdAt: string;
}

export interface SubmitAddTopicRequest {
  title: string;
  description?: string;
  parentId?: string | null;
  countable: boolean;
}

export interface SubmitEditTopicRequest {
  topicId: string;
  title: string;
  description?: string;
  countable: boolean;
}

export interface SubmitDeleteTopicRequest {
  topicId: string;
}

export interface SubmitMoveTopicRequest {
  topicId: string;
  newParentId: string | null;
}

export interface RejectChangeRequestRequest {
  managerNote?: string;
}

export const changeRequestApi = {
  submitAddTopic: (roadmapId: string, request: SubmitAddTopicRequest) =>
    apiFetch<ChangeRequestResponse>(`/roadmaps/${roadmapId}/change-requests/add-topic`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  submitEditTopic: (roadmapId: string, request: SubmitEditTopicRequest) =>
    apiFetch<ChangeRequestResponse>(`/roadmaps/${roadmapId}/change-requests/edit-topic`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  submitDeleteTopic: (roadmapId: string, request: SubmitDeleteTopicRequest) =>
    apiFetch<ChangeRequestResponse>(`/roadmaps/${roadmapId}/change-requests/delete-topic`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  submitMoveTopic: (roadmapId: string, request: SubmitMoveTopicRequest) =>
    apiFetch<ChangeRequestResponse>(`/roadmaps/${roadmapId}/change-requests/move-topic`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getPending: () =>
    apiFetch<ChangeRequestResponse[]>('/change-requests/pending'),

  getMy: () =>
    apiFetch<ChangeRequestResponse[]>('/change-requests/my'),

  approve: (requestId: string) =>
    apiFetch<ChangeRequestResponse>(`/change-requests/${requestId}/approve`, {
      method: 'POST',
    }),

  reject: (requestId: string, request: RejectChangeRequestRequest) =>
    apiFetch<ChangeRequestResponse>(`/change-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};

// ─── Dashboard types ──────────────────────────────────────────────────────────

export interface TraineeProgressSummary {
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  avatarUrl: string | null;
  roadmapId: string | null;
  roadmapTitle: string | null;
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
  attentionReason: string | null;
  lastUpdated: string | null;
}

export interface PendingRequestSummary {
  id: string;
  requestedByDisplayName: string;
  action: string;
  proposedTitle: string | null;
  description: string;
}

export interface ManagerDashboardResponse {
  totalTrainees: number;
  activeRoadmaps: number;
  averageProgress: number;
  pendingChangeRequests: number;
  completedTopicsThisWeek: number;
  traineeProgressSummaries: TraineeProgressSummary[];
  recentPendingRequests: PendingRequestSummary[];
}

export interface RecentRequestSummary {
  id: string;
  action: string;
  status: string;
  proposedTitle: string | null;
  description: string;
  createdAt: string;
}

export interface CompletedTopicSummary {
  id: string;
  title: string;
  completedAt: string | null;
}

export interface TraineeDashboardResponse {
  traineeId: string;
  traineeName: string;
  specialization: string | null;
  roadmapId: string | null;
  roadmapTitle: string | null;
  roadmapStatus: string | null;
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
  activeTopic: string | null;
  pendingRequestsCount: number;
  recentRequests: RecentRequestSummary[];
  recentlyCompletedTopics: CompletedTopicSummary[];
}

export const dashboardApi = {
  getManager: () =>
    apiFetch<ManagerDashboardResponse>('/dashboard/manager'),

  getTrainee: () =>
    apiFetch<TraineeDashboardResponse>('/dashboard/trainee'),
};

export const roadmapApi = {
  getTree: (roadmapId: string) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/tree`),

  addTopic: (roadmapId: string, request: AddTopicRequest) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/topics`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  editTopic: (roadmapId: string, topicId: string, request: EditTopicRequest) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/topics/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }),

  deleteTopic: (roadmapId: string, topicId: string) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/topics/${topicId}`, {
      method: 'DELETE',
    }),

  moveTopic: (roadmapId: string, topicId: string, request: MoveTopicRequest) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/topics/${topicId}/move`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),

  updateTopicStatus: (roadmapId: string, topicId: string, request: UpdateTopicStatusRequest) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/topics/${topicId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),
};
