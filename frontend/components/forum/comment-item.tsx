"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  MoreHorizontal,
  Flag,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CommentForm } from "./comment-form"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

export interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
    role?: string
  }
  content: string
  votes: number
  createdAt: string
  replies?: Comment[]
}

interface CommentItemProps {
  comment: Comment
  /** ID del post al que pertenece este hilo — necesario para publicar replies */
  postId: number
  depth?: number
}

export function CommentItem({ comment, postId, depth = 0 }: CommentItemProps) {
  const router = useRouter()
  const { user } = useAuth()

  const [score, setScore] = useState(comment.votes)
  const [userVote, setUserVote] = useState<1 | -1 | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [currentContent, setCurrentContent] = useState(comment.content)
  const [isSaving, setIsSaving] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user?.username === comment.author.name

  const handleDelete = async () => {
    if (!user) return
    setIsDeleting(true)
    try {
      await api.deleteComment(parseInt(comment.id, 10), user.token)
      setIsDeleted(true)
    } catch {
      setIsDeleting(false)
      setDeleteOpen(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!user || !editContent.trim()) return
    setIsSaving(true)
    try {
      await api.updateComment(parseInt(comment.id, 10), editContent.trim(), user.token)
      setCurrentContent(editContent.trim())
      setIsEdited(true)
      setEditMode(false)
    } catch { /* mantener estado */ } finally {
      setIsSaving(false)
    }
  }

  const handleVote = async (value: 1 | -1) => {
    if (!user) {
      router.push("/login")
      return
    }

    if (isVoting) return
    setIsVoting(true)

    try {
      const result = await api.vote(
        { targetId: parseInt(comment.id, 10), targetType: "comment", value },
        user.token
      )
      setScore(result.newScore)
      setUserVote(result.userVote)
    } catch {
      // mantener estado previo en caso de error
    } finally {
      setIsVoting(false)
    }
  }

  const replies = comment.replies || []
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2)
  const hasMoreReplies = replies.length > 2 && !showAllReplies

  if (isDeleted) return null

  return (
    <>
    <div className={`${depth > 0 ? "ml-4 sm:ml-8 pl-4 border-l-2 border-border/30" : ""}`}>
      <div className="py-4">
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 border border-border shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
              {comment.author.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground text-sm">{comment.author.name}</span>
              {comment.author.role && (
                <Badge variant="outline" className="text-xs border-primary/30 text-primary py-0 h-5">
                  {comment.author.role}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
              {isEdited && (
                <span className="text-xs text-muted-foreground italic">· edited</span>
              )}
            </div>

            {/* Content */}
            {!collapsed && (
              <>
                {editMode ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="text-sm bg-secondary/50 border-border/50 focus:border-primary/50 min-h-[80px] resize-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" disabled={isSaving} onClick={handleSaveEdit}
                        className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                        {isSaving ? "Saving…" : "Save"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditMode(false); setEditContent(currentContent) }}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {currentContent}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 mt-3">
                  {/* Votes */}
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isVoting}
                      onClick={() => handleVote(1)}
                      className={`h-7 w-7 p-0 transition-colors ${
                        userVote === 1
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <ArrowBigUp className="w-4 h-4" />
                    </Button>
                    <span className={`text-xs font-medium min-w-6 text-center tabular-nums ${
                      userVote === 1
                        ? "text-primary"
                        : userVote === -1
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}>
                      {score}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isVoting}
                      onClick={() => handleVote(-1)}
                      className={`h-7 w-7 p-0 transition-colors ${
                        userVote === -1
                          ? "text-destructive"
                          : "text-muted-foreground hover:text-destructive"
                      }`}
                    >
                      <ArrowBigDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Reply */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-muted-foreground hover:text-foreground gap-1 h-7 text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Reply
                  </Button>

                  {/* More */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-popover border-border">
                      {isOwner && (
                        <>
                          <DropdownMenuItem className="gap-2 text-sm cursor-pointer" onClick={() => { setEditMode(true); setEditContent(currentContent) }}>
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive text-sm cursor-pointer" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem className="gap-2 text-destructive text-sm">
                        <Flag className="w-3.5 h-3.5" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                  <div className="mt-4">
                    <CommentForm
                      postId={postId}
                      parentId={parseInt(comment.id, 10)}
                      replyTo={comment.author.name}
                      placeholder="Write a reply..."
                      onCommentAdded={() => setShowReplyForm(false)}
                    />
                  </div>
                )}
              </>
            )}

            {/* Collapse Toggle */}
            {replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className="text-muted-foreground hover:text-foreground gap-1 h-7 text-xs mt-2 -ml-2"
              >
                {collapsed ? (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Show {replies.length} {replies.length === 1 ? "reply" : "replies"}
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Hide replies
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {!collapsed && replies.length > 0 && (
          <div className="mt-2">
            {visibleReplies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
            ))}
            {hasMoreReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllReplies(true)}
                className="text-primary hover:text-primary/80 text-xs ml-12 mt-2"
              >
                Show {replies.length - 2} more {replies.length - 2 === 1 ? "reply" : "replies"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>

    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" disabled={isDeleting} onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
