import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { CategoriesGrid } from "@/components/forum/categories-grid"
import { StatusCards } from "@/components/forum/status-cards"
import { Footer } from "@/components/forum/footer"
import { MobileFab } from "@/components/forum/mobile-fab"
import { api } from "@/lib/api"

export const revalidate = 60 // ISR: refrescar cada 60 segundos

export default async function HomePage() {
  const subforums: any[] = await api.getSubforums()

  const today = new Date().toDateString()
  const allPosts = subforums.flatMap((s: any) => s.posts ?? [])
  const stats = {
    subforumCount: subforums.length,
    totalPosts: allPosts.length,
    postsToday: allPosts.filter((p: any) => new Date(p.createdAt).toDateString() === today).length,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:ml-64">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Welcome Section */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-primary uppercase tracking-widest">
                  vantaos://forum
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                  Welcome to VantaOS Community Forums
                </h1>
                <p className="text-muted-foreground text-pretty max-w-xl">
                  From kernel optimizations to interface paradigms, contribute to the most sophisticated open-source ecosystem.
                </p>
              </div>

              {/* Categories Grid — datos reales desde la API */}
              <CategoriesGrid subforums={subforums} />

              {/* Status Cards */}
              <StatusCards stats={stats} />
            </div>
          </div>

          <Footer />
        </main>
      </div>

      {/* Mobile FAB */}
      <MobileFab />
    </div>
  )
}
