"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./comment-form"
import { CommentItem, type Comment } from "./comment-item"

interface CommentSectionProps {
  postId: number
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const handleCommentAdded = (raw: any) => {
    if (!raw?.id) return
    const newComment: Comment = {
      id: String(raw.id),
      author: {
        name: raw.user?.username ?? "unknown",
        avatar: "",
      },
      content: raw.content,
      votes: raw.score ?? 0,
      createdAt: new Date(raw.createdAt).toLocaleDateString("es-AR"),
      replies: [],
    }
    setComments((prev) => [newComment, ...prev])
  }

  return (
    <div className="space-y-4">
      <CommentForm
        postId={postId}
        placeholder="What are your thoughts?"
        onCommentAdded={handleCommentAdded}
      />

      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Comments ({comments.length})
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
            <Filter className="w-4 h-4" />
            Best
          </Button>
        </div>
        <div className="divide-y divide-border/30">
          {comments.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">
              No comments yet. Be the first!
            </p>
          )}
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      </div>
    </div>
  )
}
