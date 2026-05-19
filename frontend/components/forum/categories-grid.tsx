import { Terminal, Palette, Settings2, MessageSquare, ArrowRight, Users, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: 1,
    title: "Technology",
    description: "Discussions about the latest in tech, programming, and software development.",
    icon: Terminal,
    topics: "12.4k",
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    latestPost: {
      title: "Best practices for React Server Components",
      author: "dev_ninja",
      time: "2m ago",
    },
  },
  {
    id: 2,
    title: "Design",
    description: "UI/UX design patterns, tools, and creative inspiration.",
    icon: Palette,
    topics: "4.2k",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    latestPost: {
      author: "pixel_master",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
    },
  },
  {
    id: 3,
    title: "Gaming",
    description: "Game reviews, news, and discussions about the gaming industry.",
    icon: Settings2,
    topics: "8.9k",
    gradient: "from-amber-500/20 to-amber-500/5",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    updatedAgo: "14h ago",
  },
  {
    id: 4,
    title: "Community",
    description: "General discussions, introductions, and community announcements.",
    icon: MessageSquare,
    topics: "2.1k",
    gradient: "from-rose-500/20 to-rose-500/5",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    activeUsers: 156,
  },
]

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Technology - Featured Large Card */}
      <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 hover:border-primary/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Terminal className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-primary uppercase">Featured</span>
              <h3 className="text-2xl font-bold text-foreground">Technology</h3>
            </div>
          </div>
          <p className="text-muted-foreground mb-6 max-w-lg">Discussions about the latest in tech, programming, and software development.</p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">12.4k</span>
              <span className="text-xs text-muted-foreground">topics</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-primary font-medium truncate">Latest: Best practices for React Server Components</p>
              <p className="text-xs text-muted-foreground">by dev_ninja - 2m ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Design Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 hover:border-emerald-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-emerald-400" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Design</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">UI/UX design patterns, tools, and creative inspiration.</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              alt="User avatar" 
              className="w-6 h-6 rounded-full ring-2 ring-card"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face"
            />
            <span className="text-xs text-muted-foreground">New post by pixel_master</span>
          </div>
          <span className="text-xs text-muted-foreground">4.2k topics</span>
        </div>
      </div>

      {/* Gaming Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 hover:border-amber-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-amber-400" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Gaming</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Game reviews, news, and discussions about the gaming industry.</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">Updated 14h ago</span>
          </div>
          <span className="text-xs text-muted-foreground">8.9k topics</span>
        </div>
      </div>

      {/* Community Card */}
      <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-rose-500/10 via-card to-card p-6 hover:border-rose-500/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-full md:w-48 aspect-video rounded-xl overflow-hidden relative bg-secondary">
            <img 
              className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              alt="Community gathering"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Community</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">General discussions, introductions, and community announcements.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" size="sm" className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border-0">
                Browse Threads
              </Button>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-muted-foreground">156 users online</span>
              </div>
              <span className="text-xs text-muted-foreground">2.1k topics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
