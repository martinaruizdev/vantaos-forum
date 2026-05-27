import { Terminal, Palette, Settings2, MessageSquare, ArrowRight, Users, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SubforumPost {
  id: number
  title: string
  createdAt: string
  user?: { username: string }
}

interface Subforum {
  id: number
  name: string
  slug: string
  description: string
  posts?: SubforumPost[]
}

interface CategoriesGridProps {
  subforums: Subforum[]
}

export function CategoriesGrid({ subforums }: CategoriesGridProps) {
  const bySlug = (slug: string) => subforums.find((s) => s.slug === slug)

  const kernel  = bySlug("kernel")
  const ui      = bySlug("ui")
  const drivers = bySlug("drivers")
  const general = bySlug("general")

  const kernelLatest  = kernel?.posts?.[0]
  const uiLatest      = ui?.posts?.[0]
  const driversLatest = drivers?.posts?.[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Kernel Development — featured large card */}
      <Link
        href="/f/kernel"
        className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 hover:border-primary/30 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Terminal className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-primary uppercase">CORE SYSTEMS</span>
              <h3 className="text-2xl font-bold text-foreground">
                {kernel?.name ?? "Kernel Development"}
              </h3>
            </div>
          </div>
          <p className="text-muted-foreground mb-6 max-w-lg">
            {kernel?.description ?? "Discussions regarding process scheduling, memory management, and file system architecture."}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {kernel?.posts?.length ?? 0}
              </span>
              <span className="text-xs text-muted-foreground">posts</span>
            </div>
            {kernelLatest && (
              <>
                <div className="h-4 w-px bg-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary font-medium truncate">
                    Latest: {kernelLatest.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {kernelLatest.user?.username ?? "unknown"} ·{" "}
                    {new Date(kernelLatest.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* User Interface card */}
      <Link
        href="/f/ui"
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-6 hover:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {ui?.name ?? "User Interface"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {ui?.description ?? "Designing the visual language and interaction patterns of VantaOS."}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {uiLatest ? (
              <>
                <img
                  alt={uiLatest.user?.username ?? ""}
                  className="w-6 h-6 rounded-full ring-2 ring-card bg-primary/20"
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${uiLatest.user?.username ?? "u"}&backgroundColor=7c3aed&textColor=ffffff`}
                />
                <span className="text-xs text-muted-foreground">
                  New post by {uiLatest.user?.username ?? "unknown"}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No posts yet</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{ui?.posts?.length ?? 0} posts</span>
        </div>
      </Link>

      {/* Drivers card */}
      <Link
        href="/f/drivers"
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-6 hover:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {drivers?.name ?? "Drivers"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {drivers?.description ?? "Hardware abstraction layers and device driver implementation for legacy and modern peripherals."}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {driversLatest ? (
              <>
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">
                  {new Date(driversLatest.createdAt).toLocaleDateString("es-AR")}
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">No posts yet</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{drivers?.posts?.length ?? 0} posts</span>
        </div>
      </Link>

      {/* General Discussion — wide card */}
      <Link
        href="/f/general"
        className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-6 hover:border-primary/30 transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {general?.name ?? "General Discussion"}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {general?.description ?? "Community lounge for non-technical banter, project news, and ecosystem updates."}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary border-0"
              >
                Browse Threads
              </Button>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {general?.posts?.length ?? 0} posts
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
