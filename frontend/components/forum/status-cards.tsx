import { Users, MessageSquare, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Online Users",
    value: "1,234",
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
  },
  {
    label: "Total Topics",
    value: "27.6k",
    icon: MessageSquare,
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    label: "Posts Today",
    value: "842",
    icon: TrendingUp,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
]

export function StatusCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
        >
          <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
