"use client"

import { useState } from "react"
import { Send, Image, Link2, AtSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface CommentFormProps {
  onSubmit?: (content: string) => void
  placeholder?: string
  replyTo?: string
}

export function CommentForm({ onSubmit, placeholder = "What are your thoughts?", replyTo }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <div className={`bg-card/80 backdrop-blur-sm rounded-xl border transition-all ${
      isFocused ? "border-primary/50 ring-1 ring-primary/20" : "border-border/50"
    }`}>
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 border border-border flex-shrink-0">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {replyTo && (
              <div className="text-xs text-muted-foreground mb-2">
                Replying to <span className="text-primary font-medium">@{replyTo}</span>
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={isFocused || content ? 3 : 1}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {(isFocused || content) && (
        <div className="px-4 py-3 border-t border-border/30 flex items-center justify-between bg-secondary/20 rounded-b-xl">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Link2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <AtSign className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Send className="w-4 h-4" />
            Comment
          </Button>
        </div>
      )}
    </div>
  )
}
