import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import Link from "next/link"
import { api } from "@/lib/api"

interface ForumPageProps {
  params: Promise<{ slug: string }>
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { slug } = await params

  const [subforum, posts] = await Promise.all([
    api.getSubforumBySlug(slug),
    api.getPosts(slug),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-20">
        <div className="max-w-4xl mx-auto">

          {/* Forum Header */}
          <div className="bg-card/80 border border-border/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                {slug[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">f/{slug}</h1>
                <p className="text-muted-foreground mt-1">
                  {subforum?.description ?? "Community forum"}
                </p>
              </div>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-3">
            {posts.length === 0 && (
              <p className="text-muted-foreground text-sm">No posts yet.</p>
            )}
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/f/${slug}/${post.id}`}
                className="block bg-card/80 border border-border/50 rounded-xl p-4 hover:border-primary/30 hover:bg-card transition-all"
              >
                <h2 className="font-semibold text-foreground mb-2">{post.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>by {post.user?.username ?? "unknown"}</span>
                  <span>{post.score} votes</span>
                  <span>{post.comments?.length ?? 0} comments</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('es-AR')}</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}