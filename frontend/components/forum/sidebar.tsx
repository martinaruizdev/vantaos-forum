"use client"

import Link from "next/link"
import {
  RefreshCw,
  Plus,
  BarChart3,
  Scale,
  Compass,
  Users,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Flame, label: "Trending", href: "#", active: true },
  { icon: RefreshCw, label: "Latest", href: "#" },
  { icon: Compass, label: "Explore", href: "#" },
  { icon: Users, label: "Communities", href: "#" },
]

const footerLinks = [
  { icon: BarChart3, label: "Status", href: "#" },
  { icon: Scale, label: "Legal", href: "#" },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-14 bottom-0 border-r border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Project Status */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-primary font-semibold font-display">VantaOS Community Forums</span>
        </div>
        <span className="text-xs text-muted-foreground">v1.0.0 - Online</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              item.active
                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* New Discussion Button */}
      <div className="p-4">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" />
          New Discussion
        </Button>
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-4">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              <item.icon className="w-3 h-3" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
