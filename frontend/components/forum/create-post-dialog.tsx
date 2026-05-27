"use client"

import { useState, useEffect } from "react"
import { X, Send, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

interface CreatePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pre-selecciona el subforum si venimos desde una página de subforum */
  defaultSubforumId?: number
  defaultSubforumSlug?: string
}

export function CreatePostDialog({
  open,
  onOpenChange,
  defaultSubforumId,
  defaultSubforumSlug,
}: CreatePostDialogProps) {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [subforumId, setSubforumId] = useState<number | "">(defaultSubforumId ?? "")
  const [subforums, setSubforums] = useState<{ id: number; name: string; slug: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      api.getSubforums().then(setSubforums)
    }
  }, [open])

  useEffect(() => {
    if (defaultSubforumId) setSubforumId(defaultSubforumId)
  }, [defaultSubforumId])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !content.trim() || !subforumId) return
    setIsSubmitting(true)
    setError(null)
    try {
      const post = await api.createPost(
        { title: title.trim(), content: content.trim(), subforumId: Number(subforumId) },
        user.token
      )
      onOpenChange(false)
      setTitle("")
      setContent("")
      // Navega al hilo recién creado
      const slug =
        subforums.find((s) => s.id === Number(subforumId))?.slug ??
        defaultSubforumSlug ??
        "general"
      router.push(`/f/${slug}/${post.id}`)
    } catch (e: any) {
      setError(e.message ?? "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Dialog */}
      <div
        className="relative w-full max-w-2xl bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="font-bold text-foreground text-lg">Create a post</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subforum selector */}
          <div className="relative">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Community
            </label>
            <div className="relative">
              <select
                value={subforumId}
                onChange={(e) => setSubforumId(e.target.value ? Number(e.target.value) : "")}
                required
                className="w-full appearance-none rounded-lg bg-secondary/40 border border-border/50 px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 cursor-pointer"
              >
                <option value="" disabled>Select a community…</option>
                {subforums.map((s) => (
                  <option key={s.id} value={s.id}>
                    f/{s.slug} — {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An interesting title..."
              maxLength={300}
              required
              className="bg-secondary/40 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            <p className="text-right text-xs text-muted-foreground mt-1">{title.length}/300</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post here..."
              rows={6}
              required
              className="w-full rounded-lg bg-secondary/40 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim() || !subforumId}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Posting…" : "Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
