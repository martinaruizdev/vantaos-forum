"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/auth"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const user = await authApi.register({ username, email, password })
      login(user)          // actualiza el Context + guarda en localStorage
      router.push("/")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card/80 border border-border/50 rounded-2xl p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary/50" />
            <div className="absolute inset-[2px] rounded-md bg-background flex items-center justify-center">
              <span className="font-bold text-primary text-sm">V</span>
            </div>
          </div>
          <span className="font-bold text-lg">VantaOS</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-muted-foreground text-sm mb-6">Join the VantaOS community</p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Username</label>
            <Input
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !username || !email || !password}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}