"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  Settings,
  HelpCircle,
  Grid,
  MoreVertical,
  HomeIcon,
  Monitor,
  Users,
  Clock,
  Star,
  Trash2,
  Cloud,
  ChevronDown,
} from "lucide-react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

export default function DriveLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPath, setCurrentPath] = useState("/my-drive")

  // Listen for path changes from the drive content component
  useEffect(() => {
    const handlePathChange = (e: CustomEvent) => {
      setCurrentPath(e.detail.path)
    }

    window.addEventListener("pathChange" as any, handlePathChange)

    return () => {
      window.removeEventListener("pathChange" as any, handlePathChange)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-zinc-100">
      {/* Top navigation bar */}
      <header className="flex items-center px-4 h-16 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center ml-4 text-sm text-zinc-400">
          <span>drive.google.com/drive/u/0/</span>
          <span className="font-medium text-zinc-300">{currentPath.substring(1)}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <Grid className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400">
            <MoreVertical className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-white">T</div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 flex flex-col">
          <div className="flex items-center gap-2 p-4">
            <svg viewBox="0 0 87 87" className="h-10 w-10">
              <path d="M49.5,21.9H23.3l26.3,44.4h26.3L49.5,21.9z" fill="#00ac47" />
              <path d="M23.3,21.9L0,66.3h15.6l23.3-44.4H23.3z" fill="#ea4335" />
              <path d="M49.5,21.9L23.3,66.3h26.3L75.8,21.9H49.5z" fill="#ffba00" />
            </svg>
            <span className="text-xl font-medium">Drive</span>
          </div>

          <div className="px-2 py-4">
            <Button className="w-full justify-start gap-2 bg-white text-black hover:bg-zinc-200">
              <span className="font-medium">New</span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </div>

          <nav className="flex-1 overflow-auto">
            <div className="px-2 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <HomeIcon className="h-5 w-5 text-zinc-400" />
                <span>Home</span>
              </Link>

              <Link
                href="/my-drive"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full bg-blue-600 text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span>My Drive</span>
              </Link>

              <Link
                href="/computers"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <Monitor className="h-5 w-5 text-zinc-400" />
                <span>Computers</span>
              </Link>

              <Link
                href="/shared"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <Users className="h-5 w-5 text-zinc-400" />
                <span>Shared with me</span>
              </Link>

              <Link
                href="/recent"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <Clock className="h-5 w-5 text-zinc-400" />
                <span>Recent</span>
              </Link>

              <Link
                href="/starred"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <Star className="h-5 w-5 text-zinc-400" />
                <span>Starred</span>
              </Link>

              <Link
                href="/spam"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-zinc-400">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  />
                </svg>
                <span>Spam</span>
              </Link>

              <Link
                href="/bin"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <Trash2 className="h-5 w-5 text-zinc-400" />
                <span>Bin</span>
              </Link>

              <Link
                href="/storage"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-full text-zinc-300 hover:bg-zinc-800"
              >
                <Cloud className="h-5 w-5 text-zinc-400" />
                <span>Storage</span>
              </Link>
            </div>
          </nav>

          <div className="p-4 text-xs text-zinc-400">
            <div className="mb-2">2.74 GB of 15 GB used</div>
            <div className="w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-400 w-[18%]" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Get more storage
            </Button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 p-2 border-b border-zinc-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search in Drive"
                className="pl-9 bg-zinc-800 border-none text-zinc-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}
