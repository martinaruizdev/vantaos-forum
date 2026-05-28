import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** Path base sin query string, ej. "/f/kernel" */
  basePath: string
  /** Otros params a preservar en la URL, ej. { q: "memory" } */
  extraParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, basePath, extraParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const makeHref = (page: number) => {
    const params = new URLSearchParams({ ...extraParams, page: String(page) })
    return `${basePath}?${params}`
  }

  // Mostrar máximo 5 páginas alrededor de la actual
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav className="flex items-center justify-center gap-1 py-4">
      {currentPage > 1 && (
        <Link
          href={makeHref(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      )}

      {start > 1 && (
        <>
          <Link href={makeHref(1)} className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            1
          </Link>
          {start > 2 && <span className="px-2 text-muted-foreground text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={makeHref(p)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors font-mono ${
            p === currentPage
              ? "bg-primary/20 text-primary font-semibold border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-muted-foreground text-sm">…</span>}
          <Link href={makeHref(totalPages)} className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link
          href={makeHref(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}
