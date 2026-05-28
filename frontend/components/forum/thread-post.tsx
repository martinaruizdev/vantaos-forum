"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  Link2,
  Eye,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

interface ThreadPostProps {
  post: {
    id: string
    title: string
    content: string
    author: {
      name: string
      avatar?: string
      role?: string
    }
    community: string
    communityIcon?: string
    votes: number
    comments: number
    views: number
    createdAt: string
    tags?: string[]
  }
  onDeleted?: () => void
}

export function ThreadPost({ post, onDeleted }: ThreadPostProps) {
  const router = useRouter()
  const { user } = useAuth()

  const [score, setScore] = useState(post.votes)
  const [userVote, setUserVote] = useState<1 | -1 | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editContent, setEditContent] = useState(post.content)
  const [currentTitle, setCurrentTitle] = useState(post.title)
  const [currentContent, setCurrentContent] = useState(post.content)
  const [isSaving, setIsSaving] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user?.username === post.author.name

  const handleDelete = async () => {
    if (!user) return
    setIsDeleting(true)
    try {
      await api.deletePost(parseInt(post.id, 10), user.token)
      onDeleted?.()
    } catch {
      setIsDeleting(false)
      setDeleteOpen(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!user || !editTitle.trim() || !editContent.trim()) return
    setIsSaving(true)
    try {
      await api.updatePost(parseInt(post.id, 10), { title: editTitle.trim(), content: editContent.trim() }, user.token)
      setCurrentTitle(editTitle.trim())
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
        { targetId: parseInt(post.id, 10), targetType: "post", value },
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

  return (
    <>
    <article className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
      {/* Post Header */}
      <div className="p-6 pb-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/f/${post.community}`} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold">
                {post.communityIcon || post.community[0].toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  f/{post.community}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{post.createdAt}</span>
                  {isEdited && <span className="italic">· edited</span>}
                </div>
              </div>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              {isOwner && (
                <>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setEditMode(true); setEditTitle(currentTitle); setEditContent(currentContent) }}>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="gap-2">
                <Link2 className="w-4 h-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-destructive">
                <Flag className="w-4 h-4" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        {editMode ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-xl font-bold mb-4 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
        ) : (
          <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
            {currentTitle}
          </h1>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 border border-border">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
              {post.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{post.author.name}</span>
            {post.author.role && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {post.author.role}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        {editMode ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary/50 min-h-[160px] resize-none text-sm leading-relaxed"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={isSaving} onClick={handleSaveEdit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditMode(false); setEditTitle(currentTitle); setEditContent(currentContent) }}
                className="text-muted-foreground hover:text-foreground">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {currentContent}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-border/30 bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Votes */}
            <div className="flex items-center bg-secondary/50 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                disabled={isVoting}
                onClick={() => handleVote(1)}
                className={`h-9 px-3 rounded-r-none transition-colors ${
                  userVote === 1
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <ArrowBigUp className="w-5 h-5" />
              </Button>
              <span className={`px-2 font-semibold text-sm tabular-nums ${
                userVote === 1
                  ? "text-primary"
                  : userVote === -1
                  ? "text-destructive"
                  : "text-foreground"
              }`}>
                {score}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={isVoting}
                onClick={() => handleVote(-1)}
                className={`h-9 px-3 rounded-l-none transition-colors ${
                  userVote === -1
                    ? "text-destructive bg-destructive/10"
                    : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <ArrowBigDown className="w-5 h-5" />
              </Button>
            </div>

            {/* Comments */}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2 h-9">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments} Comments</span>
            </Button>

            {/* Views */}
            <div className="hidden sm:flex items-center gap-1 px-3 text-muted-foreground text-sm">
              <Eye className="w-4 h-4" />
              <span>{post.views} views</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Share */}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2 h-9">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            {/* Save */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSaved(!saved)}
              className={`gap-2 h-9 ${saved ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
            </Button>
          </div>
        </div>
      </div>
    </article>

    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. The post and all its comments will be removed.
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
