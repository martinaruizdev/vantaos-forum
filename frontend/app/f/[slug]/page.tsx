import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { Pagination } from "@/components/forum/pagination"
import Link from "next/link"
import { ArrowBigUp, ArrowLeft, MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

interface ForumPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 20

export default async function ForumPage({ params, searchParams }: ForumPageProps) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)

  const [subforum, postsResult] = await Promise.all([
    api.getSubforumBySlug(slug),
    api.getPosts(slug, page, PAGE_SIZE),
  ])

  const { posts, total } = postsResult
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-20">
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Forum Header */}
          <div className="bg-card/80 border border-border/50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-2xl font-mono">
                  {slug[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">f/{slug}</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {subforum?.description ?? "Community forum"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {total} posts
                  </p>
                </div>
              </div>
              <Link href={`/f/${slug}/create`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <Plus className="w-4 h-4" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-3">
            {posts.length === 0 && (
              <div className="bg-card/80 border border-border/50 rounded-xl p-8 text-center">
                <p className="text-muted-foreground text-sm">No posts yet. Be the first!</p>
              </div>
            )}
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/f/${slug}/${post.id}`}
                className="block bg-card/80 border border-border/50 rounded-xl p-4 hover:border-primary/30 hover:bg-card transition-all group"
              >
                <h2 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span className="text-foreground/70">by {post.user?.username ?? "unknown"}</span>
                  <span className="flex items-center gap-1">
                    <ArrowBigUp className="w-3 h-3" />
                    {post.score}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post.comments?.length ?? 0}
                  </span>
                  <span>{new Date(post.createdAt).toLocaleDateString("es-AR")}</span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/f/${slug}`}
          />

        </div>
      </main>
    </div>
  )
}
