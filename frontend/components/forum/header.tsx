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
  Sun,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CreatePostDialog } from "@/components/forum/create-post-dialog"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.remove("dark")
      root.classList.add("light")
    }
  }, [isDark])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary/50" />
                <div className="absolute inset-[2px] rounded-md bg-background flex items-center justify-center">
                  <span className="font-bold text-primary text-sm">V</span>
                </div>
              </div>
              <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                VantaOS
              </span>
            </Link>

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
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
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

              {/* Create Post — solo para usuarios logueados */}
              {user && (
                <>
                  <Button
                    size="sm"
                    onClick={() => setCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 hidden sm:flex"
                  >
                    <Plus className="h-4 w-4" />
                    Create
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => setCreateOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground sm:hidden"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Notifications — solo logueados */}
              {user && (
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                </Button>
              )}

              {/* Messages — solo logueados */}
              {user && (
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden sm:flex">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              )}

              {/* Auth state: logged in → user menu / logged out → login + register */}
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-secondary animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                      <Avatar className="h-7 w-7 border border-border">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                        {user.username}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-primary mt-0.5 font-mono uppercase">{user.role}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <Link href={`/u/${user.username}`}>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => setIsDark(!isDark)}
                    >
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
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
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start gap-2 text-foreground">
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                  <Compass className="h-4 w-4" />
                  Explore
                </Button>
                <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Communities
                </Button>
                {user && (
                  <>
                    <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2 text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      Messages
                    </Button>
                  </>
                )}
                {!user && (
                  <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90">Sign up</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <CreatePostDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
