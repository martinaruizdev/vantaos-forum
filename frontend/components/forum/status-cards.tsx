import { Users, MessageSquare, TrendingUp } from "lucide-react"

interface StatusCardsProps {
  stats: {
    subforumCount: number
    totalPosts: number
    postsToday: number
  }
}

export function StatusCards({ stats }: StatusCardsProps) {
  const cards = [
    {
      label: "Communities",
      value: stats.subforumCount.toLocaleString("en-US"),
      icon: Users,
    },
    {
      label: "Total Posts",
      value: stats.totalPosts.toLocaleString("en-US"),
      icon: MessageSquare,
    },
    {
      label: "Posted Today",
      value: stats.postsToday.toLocaleString("en-US"),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <card.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground font-mono">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
