"use client"

import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThreadSidebarProps {
  community: {
    name: string
    slug: string
    description: string
    postCount: number
  }
}

export function ThreadSidebar({ community }: ThreadSidebarProps) {
  return (
    <aside className="space-y-4">
      {/* Community Info */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10" />

        <div className="p-4 -mt-8">
          <div className="flex items-end gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-xl border-4 border-card font-mono">
              {community.slug[0].toUpperCase()}
            </div>
            <div className="pb-1">
              <h3 className="font-bold text-foreground">f/{community.slug}</h3>
              <p className="text-xs text-muted-foreground font-mono">{community.name}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {community.description}
          </p>

          <div className="py-4 border-y border-border/30 mb-4">
            <div className="flex items-center gap-2 text-foreground font-semibold font-mono">
              <FileText className="w-4 h-4 text-primary" />
              {community.postCount.toLocaleString("en-US")}
            </div>
            <span className="text-xs text-muted-foreground">Posts</span>
          </div>

          <Link href={`/f/${community.slug}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
              View Community
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
