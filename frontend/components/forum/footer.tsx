import Link from "next/link"
import { GitBranch, X } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-bold text-primary">NEXUS FORUM</span>
            <p className="text-xs text-muted-foreground">2026 Nexus Forum. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <GitBranch className="w-4 h-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
