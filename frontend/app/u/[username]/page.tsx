import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Calendar, MessageSquare,
  Eye, Award, Terminal, Zap, Star, Shield,
  TrendingUp, ArrowBigUp, Clock,
} from "lucide-react"
import { api } from "@/lib/api"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Logros desbloqueables basados en actividad real
function getAchievements(karma: number, postCount: number, commentCount: number, role: string) {
  return [
    {
      icon: ArrowBigUp,
      label: "Top Author",
      color: "text-primary",
      unlocked: karma >= 50,
    },
    {
      icon: Terminal,
      label: "Code Master",
      color: "text-[#a8b4f8]",
      unlocked: postCount >= 5,
    },
    {
      icon: Zap,
      label: "Helpful Hand",
      color: "text-primary",
      unlocked: commentCount >= 5,
    },
    {
      icon: Star,
      label: "Bug Squasher",
      color: "text-[#a8b4f8]",
      unlocked: karma >= 100,
    },
    {
      icon: Shield,
      label: "Moderator",
      color: "text-primary",
      unlocked: role === "admin" || role === "moderator",
    },
    {
      icon: TrendingUp,
      label: "Trending",
      color: "text-[#a8b4f8]",
      unlocked: karma >= 200,
    },
  ]
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const user = await api.getUserProfile(username)

  if (!user) notFound()

  const joinedAt = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const initials = user.username.slice(0, 2).toUpperCase()
  const achievements = getAchievements(user.karma, user.postCount, user.commentCount, user.role)

  // Intercalar posts y comentarios en actividad reciente, ordenado por fecha
  const recentPosts = (user.posts ?? []).slice(0, 5).map((p: any) => ({
    type: "post" as const,
    title: `Published: ${p.title}`,
    description: "",
    forum: p.subforumSlug,
    time: new Date(p.createdAt).toLocaleDateString("es-AR"),
    votes: p.score,
    meta: `${p.commentCount} comments`,
    href: `/f/${p.subforumSlug}/${p.id}`,
    accentColor: "border-[#10b981]",
  }))

  const recentComments = (user.comments ?? []).slice(0, 3).map((c: any) => ({
    type: "comment" as const,
    title: `Replied to: ${c.postTitle}`,
    description: c.content,
    forum: c.subforumSlug,
    time: new Date(c.createdAt).toLocaleDateString("es-AR"),
    votes: c.score,
    meta: "",
    href: `/f/${c.subforumSlug}/${c.postId}`,
    accentColor: "border-primary",
  }))

  const activity = [...recentPosts, ...recentComments]
    .sort((a, b) => {
      // Reordenar cronológicamente (más reciente primero)
      return b.time.localeCompare(a.time)
    })
    .slice(0, 6)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Profile Header */}
          <div className="relative bg-card/80 border border-border/50 rounded-2xl overflow-hidden mb-6">
            {/* Banner con gradiente único por usuario */}
            <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/5" />

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
                <div className="flex items-end gap-4">
                  <Avatar className="w-24 h-24 border-4 border-card rounded-2xl">
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold rounded-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mb-1">
                    <h1 className="text-2xl font-bold text-foreground">@{user.username}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-muted-foreground text-sm font-mono">{user.email}</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs uppercase font-mono">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  Joined {joinedAt}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/30">
                {[
                  { icon: ArrowBigUp,    label: "Karma",    value: user.karma.toLocaleString("en-US") },
                  { icon: MessageSquare, label: "Posts",    value: user.postCount.toLocaleString("en-US") },
                  { icon: MessageSquare, label: "Comments", value: user.commentCount.toLocaleString("en-US") },
                  { icon: Eye,           label: "Views",    value: "—" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground font-mono">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-foreground text-lg">Recent Activity</h2>

              {activity.length === 0 && (
                <div className="bg-card/80 border border-border/50 rounded-xl p-8 text-center">
                  <p className="text-muted-foreground text-sm">No activity yet.</p>
                </div>
              )}

              {activity.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`block bg-card/80 border border-border/50 rounded-xl p-5 border-l-4 ${item.accentColor} hover:border-primary/30 transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold text-foreground text-sm leading-snug">{item.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      f/{item.forum}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ArrowBigUp className="w-3 h-3" />
                      {item.votes}
                    </span>
                    {item.meta && (
                      <span className="text-xs text-muted-foreground">{item.meta}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">

              {/* Achievements */}
              <div className="bg-card/80 border border-border/50 rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Achievements
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((a, i) => (
                    <div
                      key={i}
                      title={a.unlocked ? a.label : `${a.label} (locked)`}
                      className={`flex flex-col items-center gap-2 ${!a.unlocked ? "opacity-30" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                        <a.icon className={`w-5 h-5 ${a.color}`} />
                      </div>
                      <span className="text-[10px] text-center text-muted-foreground leading-tight">
                        {a.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats card */}
              <div className="bg-card/80 border border-border/50 rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Overview
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Posts published", value: user.postCount },
                    { label: "Comments written", value: user.commentCount },
                    { label: "Total karma",      value: user.karma },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-sm font-bold text-foreground font-mono">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
