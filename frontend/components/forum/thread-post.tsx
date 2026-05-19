"use client"

import { useState } from "react"
import Link from "next/link"
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
}

export function ThreadPost({ post }: ThreadPostProps) {
  const [votes, setVotes] = useState(post.votes)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [saved, setSaved] = useState(false)

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setVotes(post.votes)
      setUserVote(null)
    } else {
      setVotes(post.votes + (type === "up" ? 1 : -1) - (userVote ? (userVote === "up" ? 1 : -1) : 0))
      setUserVote(type)
    }
  }

  return (
    <article className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
      {/* Post Header */}
      <div className="p-6 pb-4 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/c/${post.community}`} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold">
                {post.communityIcon || post.community[0].toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  c/{post.community}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{post.createdAt}</span>
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
        <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>

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
      <div className="p-6 prose prose-invert max-w-none">
        <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
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
                onClick={() => handleVote("up")}
                className={`h-9 px-3 rounded-r-none ${
                  userVote === "up" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <ArrowBigUp className="w-5 h-5" />
              </Button>
              <span className={`px-2 font-semibold text-sm ${
                userVote === "up" ? "text-primary" : userVote === "down" ? "text-destructive" : "text-foreground"
              }`}>
                {votes}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("down")}
                className={`h-9 px-3 rounded-l-none ${
                  userVote === "down" ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive"
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
  )
}
