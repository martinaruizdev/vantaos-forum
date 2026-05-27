const API_URL = "http://localhost:5149/api"

export interface AuthUser {
  userId: number
  token: string
  username: string
  email: string
  role: string
}

export const authApi = {
  register: async (data: { username: string; email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }
    return res.json() as Promise<AuthUser>
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }
    return res.json() as Promise<AuthUser>
  },
}

// Guardar y leer el token en localStorage
export const saveAuth = (user: AuthUser) => {
  localStorage.setItem("vantaos_user", JSON.stringify(user))
}

export const getAuth = (): AuthUser | null => {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("vantaos_user")
  return data ? JSON.parse(data) : null
}

export const clearAuth = () => {
  localStorage.removeItem("vantaos_user")
}