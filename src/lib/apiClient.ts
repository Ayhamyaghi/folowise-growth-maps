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
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
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

export const authApi = {
  me: () => apiFetch<CurrentUserResponse>('/auth/me'),
};

export const roadmapApi = {
  getTree: (roadmapId: string) =>
    apiFetch<ApiRoadmapTree>(`/roadmaps/${roadmapId}/tree`),
};
