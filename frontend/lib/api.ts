const API_URL = "http://localhost:5149/api"

export const api = {
  // Subforums
  getSubforums: async () => {
    const res = await fetch(`${API_URL}/subforums`)
    return res.json()
  },

  getSubforumBySlug: async (slug: string) => {
    const res = await fetch(`${API_URL}/subforums/${slug}`)
    return res.json()
  },

  // Posts
  getPosts: async (subforumSlug?: string) => {
    const url = subforumSlug
      ? `${API_URL}/posts?subforumSlug=${subforumSlug}`
      : `${API_URL}/posts`
    const res = await fetch(url)
    return res.json()
  },

  getPostById: async (id: number) => {
    const res = await fetch(`${API_URL}/posts/${id}`)
    return res.json()
  },

  createPost: async (data: {
    title: string
    content: string
    userId: number
    subforumId: number
  }) => {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  },
}