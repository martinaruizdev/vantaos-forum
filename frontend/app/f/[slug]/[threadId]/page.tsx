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

interface ThreadPageProps {
  params: Promise<{ slug: string; threadId: string }>
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { slug, threadId } = await params

  const post = await api.getPostById(Number(threadId))

  if (!post || post.status === 404) {
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
    comments: post.comments?.length ?? 0,
    views: 0,
    createdAt: new Date(post.createdAt).toLocaleDateString('es-AR'),
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

  const mappedComments: Comment[] = (post.comments ?? []).map((c: any) => ({
    id: String(c.id),
    author: { name: c.user?.username ?? "unknown", avatar: "" },
    content: c.content,
    votes: c.score,
    createdAt: new Date(c.createdAt).toLocaleDateString('es-AR'),
    replies: [],
  }))

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
              <CommentForm placeholder="What are your thoughts?" />

              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="p-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">
                    Comments ({mappedComments.length})
                  </h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                    <Filter className="w-4 h-4" />
                    Best
                  </Button>
                </div>
                <div className="divide-y divide-border/30">
                  {mappedComments.length === 0 && (
                    <p className="p-4 text-sm text-muted-foreground">No comments yet. Be the first!</p>
                  )}
                  {mappedComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
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