"use client"

import { useState } from "react"
import { Send, Image, Link2, AtSign, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import Link from "next/link"

interface CommentFormProps {
  postId: number
  onCommentAdded?: (comment: any) => void
  placeholder?: string
  replyTo?: string
  parentId?: number
}

export function CommentForm({
  postId,
  onCommentAdded,
  placeholder = "What are your thoughts?",
  replyTo,
  parentId,
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!content.trim() || !user) return
    setIsSubmitting(true)
    setError(null)
    try {
      const comment = await api.createComment(
        { content: content.trim(), postId, parentId },
        user.token
      )
      setContent("")
      setIsFocused(false)
      onCommentAdded?.(comment)
    } catch (e: any) {
      setError(e.message ?? "Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Usuario no autenticado
  if (!user) {
    return (
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-5 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Log in to join the discussion.
        </p>
        <Link href="/login">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <LogIn className="w-4 h-4" />
            Log in
          </Button>
        </Link>
      </div>
    )
  }

  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <div className={`bg-card/80 backdrop-blur-sm rounded-xl border transition-all ${
      isFocused ? "border-primary/50 ring-1 ring-primary/20" : "border-border/50"
    }`}>
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 border border-border flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {replyTo && (
              <div className="text-xs text-muted-foreground mb-2">
                Replying to <span className="text-primary font-medium">@{replyTo}</span>
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={isFocused || content ? 3 : 1}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="px-4 pb-2 text-xs text-destructive">{error}</p>
      )}

      {(isFocused || content) && (
        <div className="px-4 py-3 border-t border-border/30 flex items-center justify-between bg-secondary/20 rounded-b-xl">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Link2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <AtSign className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Posting…" : "Comment"}
          </Button>
        </div>
      )}
    </div>
  )
}
