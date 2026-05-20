import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin, Calendar, MessageSquare, ThumbsUp,
  Eye, Award, Terminal, Zap, Star, Shield,
  TrendingUp, ArrowBigUp, Clock
} from "lucide-react"

interface ProfilePageProps {
  params: { username: string }
}

const mockUser = {
  name: "alex_tech",
  displayName: "Alex Thompson",
  avatar: "",
  bio: "Kernel developer focused on memory management and process scheduling. Contributor to VantaOS core systems.",
  location: "Buenos Aires, AR",
  joinedAt: "January 2023",
  role: "Core Contributor",
  karma: 12840,
  posts: 342,
  comments: 1204,
  views: 89400,
  expertise: [
    { label: "Rust / C++", value: 92 },
    { label: "Kernel Dev", value: 85 },
    { label: "Concurrency", value: 78 },
  ],
  achievements: [
    { icon: Award, label: "Top 1% Author", color: "text-amber-400", unlocked: true },
    { icon: Terminal, label: "Code Master", color: "text-primary", unlocked: true },
    { icon: Zap, label: "Helpful Hand", color: "text-emerald-400", unlocked: true },
    { icon: Star, label: "Bug Squasher", color: "text-muted-foreground", unlocked: false },
    { icon: Shield, label: "Moderator", color: "text-muted-foreground", unlocked: false },
    { icon: TrendingUp, label: "Trending", color: "text-muted-foreground", unlocked: false },
  ],
  recentActivity: [
    {
      type: "comment",
      title: "Replied to: Fix race condition in MMU handler",
      description: "The issue is likely in the TLB shootdown sequence. You need to ensure all CPUs have acknowledged before proceeding.",
      forum: "kernel",
      time: "2 hours ago",
      votes: 42,
      accentColor: "border-primary",
    },
    {
      type: "post",
      title: "Published: Async I/O Patterns with io_uring",
      description: "Comprehensive guide on implementing io_uring for high-throughput network applications in VantaOS.",
      forum: "kernel",
      time: "Yesterday",
      votes: 89,
      accentColor: "border-emerald-500",
    },
    {
      type: "thread",
      title: "Created Thread: Proposal for Memory Tiering API",
      description: "Initiating discussion on exposing tiered memory primitives to userspace via the new syscall interface.",
      forum: "drivers",
      time: "3 days ago",
      votes: 124,
      accentColor: "border-violet-500",
    },
  ],
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Profile Header */}
          <div className="relative bg-card/80 border border-border/50 rounded-2xl overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/10 to-violet-500/20" />

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
                <div className="flex items-end gap-4">
                  <Avatar className="w-24 h-24 border-4 border-card rounded-2xl">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold rounded-2xl">
                      {mockUser.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mb-1">
                    <h1 className="text-2xl font-bold text-foreground">{mockUser.displayName}</h1>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">@{username}</span>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        {mockUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Meta */}
              <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">{mockUser.bio}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {mockUser.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  Joined {mockUser.joinedAt}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/30">
                {[
                  { icon: ArrowBigUp, label: "Karma", value: mockUser.karma.toLocaleString('en-US') },
                  { icon: MessageSquare, label: "Posts", value: mockUser.posts.toLocaleString('en-US') },
                  { icon: MessageSquare, label: "Comments", value: mockUser.comments.toLocaleString('en-US') },
                  { icon: Eye, label: "Views", value: mockUser.views.toLocaleString('en-US') },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{stat.value}</p>
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
              {mockUser.recentActivity.map((item, i) => (
                <div
                  key={i}
                  className={`bg-card/80 border border-border/50 rounded-xl p-5 border-l-4 ${item.accentColor} hover:border-primary/30 transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold text-foreground text-sm leading-snug">{item.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      f/{item.forum}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ArrowBigUp className="w-3 h-3" />
                      {item.votes}
                    </span>
                  </div>
                </div>
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
                  {mockUser.achievements.map((a, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 ${!a.unlocked ? "opacity-30" : ""}`}>
                      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                        <a.icon className={`w-5 h-5 ${a.color}`} />
                      </div>
                      <span className="text-[10px] text-center text-muted-foreground leading-tight">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-card/80 border border-border/50 rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Expertise
                </h3>
                <div className="space-y-4">
                  {mockUser.expertise.map((skill) => (
                    <div key={skill.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{skill.label}</span>
                        <span className="font-semibold text-foreground">{skill.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
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