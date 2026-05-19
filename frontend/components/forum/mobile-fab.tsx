"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileFab() {
  return (
    <Button
      size="icon"
      className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
    >
      <Plus className="w-6 h-6" />
    </Button>
  )
}
