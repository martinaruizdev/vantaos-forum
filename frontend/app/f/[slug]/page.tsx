import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import Link from "next/link"

interface ForumPageProps {
  params: { slug: string }
}

// Datos de ejemplo — después vendrán de la API
const mockThreads = [
  { id: "1", title: "How to write a basic kernel module?", author: "user123", votes: 42, comments: 12, createdAt: "2h ago" },
  { id: "2", title: "Understanding memory management in Linux", author: "devguru", votes: 87, comments: 34, createdAt: "5h ago" },
  { id: "3", title: "Best resources for OS development?", author: "newbie99", votes: 15, comments: 8, createdAt: "1d ago" },
]

export default async function ForumPage({ params }: ForumPageProps) {
    const { slug } = await params
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
                <p className="text-muted-foreground mt-1">Discussions about {slug}.</p>
              </div>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-3">
            {mockThreads.map((thread) => (
              <Link
                key={thread.id}
                href={`/f/${slug}/${thread.id}`}
                className="block bg-card/80 border border-border/50 rounded-xl p-4 hover:border-primary/30 hover:bg-card transition-all"
              >
                <h2 className="font-semibold text-foreground mb-2">{thread.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>by {thread.author}</span>
                  <span>{thread.votes} votes</span>
                  <span>{thread.comments} comments</span>
                  <span>{thread.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  )
}