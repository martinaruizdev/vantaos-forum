const API_URL = "http://localhost:5149/api"

// Helper: cabeceras con o sin JWT
function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export const api = {
  // ── Subforums ──────────────────────────────────────────────────────────────

  getSubforums: async () => {
    const res = await fetch(`${API_URL}/subforums`)
    if (!res.ok) return []
    return res.json()
  },

  getSubforumBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/subforums/${slug}`)
    if (!res.ok) return null
    return res.json()
  },

  // ── Posts ──────────────────────────────────────────────────────────────────

  getPosts: async (subforumSlug?: string) => {
    const url = subforumSlug
      ? `${API_URL}/posts?subforumSlug=${subforumSlug}`
      : `${API_URL}/posts`
    const res = await fetch(url)
    if (!res.ok) return []
    return res.json()
  },

  getPostById: async (id: number) => {
    const res = await fetch(`${API_URL}/posts/${id}`)
    if (!res.ok) return null
    return res.json()
  },

  /** Requiere JWT */
  createPost: async (
    data: { title: string; content: string; subforumId: number },
    token: string
  ) => {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || "Failed to create post")
    }
    return res.json()
  },

  /** Requiere JWT */
  deletePost: async (id: number, token: string) => {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
    if (!res.ok) throw new Error("Failed to delete post")
  },

  // ── Users ──────────────────────────────────────────────────────────────────

  getUserProfile: async (username: string) => {
    const res = await fetch(`${API_URL}/users/${username}`)
    if (res.status === 404) return null
    if (!res.ok) return null
    return res.json()
  },

  // ── Comments ───────────────────────────────────────────────────────────────

  getComments: async (postId: number) => {
    const res = await fetch(`${API_URL}/comments?postId=${postId}`)
    if (!res.ok) return []
    return res.json()
  },

  /** Requiere JWT */
  createComment: async (
    data: { content: string; postId: number; parentId?: number },
    token: string
  ) => {
    const res = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || "Failed to create comment")
    }
    return res.json()
  },

  // ── Votes ───────────────────────────────────────────────────────────────────

  /** Requiere JWT. Toggle: mismo valor → quita el voto; distinto → cambia. */
  vote: async (
    data: { targetId: number; targetType: "post" | "comment"; value: 1 | -1 },
    token: string
  ): Promise<{ newScore: number; userVote: 1 | -1 | null }> => {
    const res = await fetch(`${API_URL}/votes`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error || "Failed to vote")
    }
    return res.json()
  },
}
