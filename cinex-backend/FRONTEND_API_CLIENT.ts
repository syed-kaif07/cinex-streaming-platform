/**
 * cinex-frontend/src/lib/api.ts
 *
 * Drop this file into your CineX frontend at src/lib/api.ts
 * It wraps all calls to the CineX backend API.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',   // Send HTTP-only cookies with every request
    ...options,
  })

  const data: ApiResponse<T> = await res.json()
  return data
}

// ─── Auth ──────────────────────────────────────────────────

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  me: () =>
    request('/auth/me'),
}

// ─── User / Watchlist ──────────────────────────────────────

export const userApi = {
  getProfile: () => request('/user/profile'),

  updateProfile: (name: string) =>
    request('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }),

  getWatchlist: () => request('/user/watchlist'),

  addToWatchlist: (payload: {
    mediaId: number
    mediaType: 'movie' | 'tv'
    title: string
    posterPath?: string
  }) =>
    request('/user/watchlist', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  removeFromWatchlist: (mediaId: number, mediaType: 'movie' | 'tv') =>
    request(`/user/watchlist/${mediaId}?mediaType=${mediaType}`, { method: 'DELETE' }),
}
