"use client";

import type React from "react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  // const [currentPath, setCurrentPath] = useState("/my-drive")

  // Listen for path changes from the drive content component
  // useEffect(() => {
  //   const handlePathChange = (e: CustomEvent) => {
  //     setCurrentPath(e.detail.path as string)
  //   }

  //   window.addEventListener("pathChange" as any, handlePathChange)

  //   return () => {
  //     window.removeEventListener("pathChange" as any, handlePathChange)
  //   }
  // }, [])

  return (
    <div className="flex h-screen flex-col bg-zinc-900 text-zinc-100">
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-64 flex-col border-r border-zinc-800">
          <div className="flex items-center gap-2 p-4">
            {/* <svg viewBox="0 0 87 87" className="h-10 w-10">
              <path
                d="M49.5,21.9H23.3l26.3,44.4h26.3L49.5,21.9z"
                fill="#00ac47"
              />
              <path d="M23.3,21.9L0,66.3h15.6l23.3-44.4H23.3z" fill="#ea4335" />
              <path
                d="M49.5,21.9L23.3,66.3h26.3L75.8,21.9H49.5z"
                fill="#ffba00"
              />
            </svg> */}
            <div className="relative aspect-square w-10 object-cover">
              <Image fill src={"/icon.png"} alt={"Google Drive Logo"} />
            </div>
            <span className="text-xl font-medium">Drive</span>
          </div>
          <div className="px-2 py-4">
            <Button className="w-full justify-start gap-2 bg-white text-black hover:bg-zinc-200">
              <span className="font-medium">New</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 overflow-auto">
            <div className="space-y-1 px-2">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <HomeIcon className="h-5 w-5 text-zinc-400" />
                <span>Home</span>
              </Link>

              <Link
                href="/my-drive"
                className="flex items-center gap-3 rounded-full bg-blue-600 px-3 py-2 text-sm text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                  <path
                    fill="currentColor"
                    d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                  />
                </svg>
                <span>My Drive</span>
              </Link>

              <Link
                href="/computers"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Monitor className="h-5 w-5 text-zinc-400" />
                <span>Computers</span>
              </Link>

              <Link
                href="/shared"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Users className="h-5 w-5 text-zinc-400" />
                <span>Shared with me</span>
              </Link>

              <Link
                href="/recent"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Clock className="h-5 w-5 text-zinc-400" />
                <span>Recent</span>
              </Link>

              <Link
                href="/starred"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Star className="h-5 w-5 text-zinc-400" />
                <span>Starred</span>
              </Link>

              <Link
                href="/spam"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
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
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Trash2 className="h-5 w-5 text-zinc-400" />
                <span>Bin</span>
              </Link>

              <Link
                href="/storage"
                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                <Cloud className="h-5 w-5 text-zinc-400" />
                <span>Storage</span>
              </Link>
            </div>
          </nav>

          <div className="p-4 text-xs text-zinc-400">
            <div className="mb-2">2.74 GB of 15 GB used</div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-700">
              <div className="h-full w-[18%] bg-zinc-400" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Get more storage
            </Button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto px-4">
          <header className="flex h-18 items-center border-zinc-800">
            <div className="relative z-10 max-w-2/3 flex-1">
              <Button
                size={"basic"}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform rounded-full bg-inherit p-3 hover:bg-zinc-600"
              >
                <Search className="text-zinc-100" />
              </Button>
              <Input
                type="text"
                placeholder="Search in Drive"
                className="rounded-4xl border-none bg-zinc-800 py-6 pl-16 text-zinc-200 placeholder:text-zinc-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-zinc-400">
                <MoreVertical className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-zinc-400">
                <Grid className="h-5 w-5" />
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600 text-white">
                T
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
