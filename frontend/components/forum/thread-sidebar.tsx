"use client"

import Link from "next/link"
import { Users, Calendar, Shield, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ThreadSidebarProps {
  community: {
    name: string
    description: string
    members: number
    online: number
    createdAt: string
    rules: string[]
  }
}

export function ThreadSidebar({ community }: ThreadSidebarProps) {
  return (
    <aside className="space-y-4">
      {/* Community Info */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
        {/* Header with gradient */}
        <div className="h-16 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10" />
        
        <div className="p-4 -mt-8">
          <div className="flex items-end gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xl border-4 border-card">
              {community.name[0].toUpperCase()}
            </div>
            <div className="pb-1">
              <h3 className="font-bold text-foreground">c/{community.name}</h3>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {community.description}
          </p>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/30">
            <div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Users className="w-4 h-4 text-primary" />
                {community.members.toLocaleString('en-US')}
              </div>
              <span className="text-xs text-muted-foreground">Members</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                {community.online.toLocaleString('en-US')}
              </div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>

          <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Created {community.createdAt}
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            Join Community
          </Button>
        </div>
      </div>

      {/* Community Rules */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Community Rules</h3>
        </div>
        <ol className="space-y-3">
          {community.rules.map((rule, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{rule}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Moderators */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4">
        <h3 className="font-semibold text-foreground mb-4">Moderators</h3>
        <div className="space-y-3">
          {["ModeratorOne", "ModeratorTwo"].map((mod) => (
            <Link
              key={mod}
              href={`/u/${mod}`}
              className="flex items-center gap-3 group"
            >
              <Avatar className="w-8 h-8 border border-border">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {mod[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                u/{mod}
              </span>
            </Link>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground hover:text-foreground gap-2">
          View All
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </aside>
  )
}
