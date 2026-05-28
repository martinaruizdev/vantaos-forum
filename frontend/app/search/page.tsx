import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { Pagination } from "@/components/forum/pagination"
import Link from "next/link"
import { ArrowBigUp, MessageSquare, Search } from "lucide-react"
import { api } from "@/lib/api"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

const PAGE_SIZE = 20

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)

  const { posts, total } = q.trim()
    ? await api.getPosts(undefined, page, PAGE_SIZE, q.trim())
    : { posts: [], total: 0 }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 p-6 pt-20">
        <div className="max-w-4xl mx-auto">

          {/* Search header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <Search className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                {q.trim() ? `Results for "${q}"` : "Explore"}
              </h1>
            </div>
            {q.trim() && (
              <p className="text-sm text-muted-foreground font-mono ml-8">
                {total} post{total !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {/* No query state */}
          {!q.trim() && (
            <div className="bg-card/80 border border-border/50 rounded-xl p-10 text-center">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Type something in the search bar and press Enter.
              </p>
            </div>
          )}

          {/* No results */}
          {q.trim() && posts.length === 0 && (
            <div className="bg-card/80 border border-border/50 rounded-xl p-10 text-center">
              <p className="text-muted-foreground text-sm">
                No posts found for <span className="text-foreground font-medium">"{q}"</span>.
              </p>
            </div>
          )}

          {/* Results list */}
          {posts.length > 0 && (
            <div className="space-y-3">
              {posts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/f/${post.subforum?.slug ?? "general"}/${post.id}`}
                  className="block bg-card/80 border border-border/50 rounded-xl p-4 hover:border-primary/30 hover:bg-card transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <span className="text-xs text-primary font-mono shrink-0 bg-primary/10 px-2 py-0.5 rounded">
                      f/{post.subforum?.slug ?? "?"}
                    </span>
                  </div>
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
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/search"
            extraParams={q.trim() ? { q: q.trim() } : {}}
          />

        </div>
      </main>
    </div>
  )
}
