"use client"

import { useState } from "react"
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  MoreHorizontal,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentForm } from "./comment-form"

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
  depth?: number
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [votes, setVotes] = useState(comment.votes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setVotes(comment.votes)
      setUserVote(null)
    } else {
      setVotes(comment.votes + (type === "up" ? 1 : -1) - (userVote ? (userVote === "up" ? 1 : -1) : 0))
      setUserVote(type)
    }
  }

  const replies = comment.replies || []
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2)
  const hasMoreReplies = replies.length > 2 && !showAllReplies

  return (
    <div className={`${depth > 0 ? "ml-4 sm:ml-8 pl-4 border-l-2 border-border/30" : ""}`}>
      <div className="py-4">
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 border border-border flex-shrink-0">
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
            </div>

            {/* Content */}
            {!collapsed && (
              <>
                <div className="mt-2 text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-3">
                  {/* Votes */}
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote("up")}
                      className={`h-7 w-7 p-0 ${
                        userVote === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <ArrowBigUp className="w-4 h-4" />
                    </Button>
                    <span className={`text-xs font-medium min-w-[1.5rem] text-center ${
                      userVote === "up" ? "text-primary" : userVote === "down" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {votes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote("down")}
                      className={`h-7 w-7 p-0 ${
                        userVote === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
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
                      replyTo={comment.author.name}
                      placeholder="Write a reply..."
                      onSubmit={() => setShowReplyForm(false)}
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
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
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
  )
}
