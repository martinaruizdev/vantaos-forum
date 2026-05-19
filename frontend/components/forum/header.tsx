"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  User,
  Moon,
  Home,
  Compass,
  Users,
} from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary/50" />
              <div className="absolute inset-[2px] rounded-md bg-background flex items-center justify-center">
                <span className="font-bold text-primary text-sm">V</span>
              </div>
            </div>
            <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              VantaOS
            </span>
          </div>

          {/* Search - Desktop */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VantaOS..."
                className="w-full pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 focus:bg-secondary/70"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
              <Compass className="h-4 w-4" />
              Explore
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
              <Users className="h-4 w-4" />
              Communities
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>

            {/* Create Post */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 hidden sm:flex"
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground sm:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">U</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">username</p>
                  <p className="text-xs text-muted-foreground">1,234 karma</p>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Expanded */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start gap-2 text-foreground">
                <Home className="h-4 w-4" />
                Home
              </Button>
              <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                <Compass className="h-4 w-4" />
                Explore
              </Button>
              <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                Communities
              </Button>
              <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                Messages
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
