"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { ThreadPost } from "@/components/forum/thread-post"
import { ThreadSidebar } from "@/components/forum/thread-sidebar"
import { CommentForm } from "@/components/forum/comment-form"
import { CommentItem, type Comment } from "@/components/forum/comment-item"
import { api } from "@/lib/api"

function mapComment(c: any): Comment {
  return {
    id: String(c.id),
    author: { name: c.user?.username ?? "unknown", avatar: "" },
    content: c.content,
    votes: c.score,
    createdAt: new Date(c.createdAt).toLocaleDateString("es-AR"),
    replies: (c.replies ?? []).map(mapComment),
  }
}

export default function ThreadPage() {
  const params = useParams()
  const slug = params.slug as string
  const threadId = params.threadId as string

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"new" | "best">("new")

  useEffect(() => {
    api.getPostById(Number(threadId)).then((data) => {
      if (data) {
        setPost(data)
        setComments((data.comments ?? []).map(mapComment))
      }
      setLoading(false)
    })
  }, [threadId])

  const handleCommentAdded = (newComment: any) => {
    setComments((prev) => [mapComment(newComment), ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-mono text-sm animate-pulse">loading thread…</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    )
  }

  const mappedPost = {
    id: String(post.id),
    title: post.title,
    content: post.content,
    author: {
      name: post.user?.username ?? "unknown",
      avatar: "",
      role: post.user?.role ?? "member",
    },
    community: slug,
    votes: post.score,
    comments: comments.length,
    views: 0,
    createdAt: new Date(post.createdAt).toLocaleDateString("es-AR"),
    tags: post.tags?.map((t: any) => t.name) ?? [],
  }

  const mappedCommunity = {
    name: slug,
    description: `Discussions about ${slug}.`,
    members: 0,
    online: 0,
    createdAt: "",
    rules: [],
  }

  const sorted =
    sortBy === "best"
      ? [...comments].sort((a, b) => b.votes - a.votes)
      : comments

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-6">

          <div className="mb-6">
            <Link href={`/f/${slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to f/{slug}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ThreadPost post={mappedPost} />

              <CommentForm
                postId={post.id}
                onCommentAdded={handleCommentAdded}
                placeholder="What are your thoughts?"
              />

              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="p-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">
                    Comments ({comments.length})
                  </h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={sortBy === "best" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setSortBy("best")}
                      className="text-muted-foreground hover:text-foreground gap-1 text-xs"
                    >
                      <Filter className="w-3 h-3" />
                      Best
                    </Button>
                    <Button
                      variant={sortBy === "new" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setSortBy("new")}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      New
                    </Button>
                  </div>
                </div>
                <div className="divide-y divide-border/30">
                  {sorted.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground">
                      No comments yet. Be the first!
                    </p>
                  )}
                  {sorted.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} postId={post.id} />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <ThreadSidebar community={mappedCommunity} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
