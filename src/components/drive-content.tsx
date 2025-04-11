"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, FileText, Folder, MoreVertical, Check, LayoutGrid, ArrowUpDown } from "lucide-react"
import { Button } from "~/components/ui/button"

// Mock data structure for folders and files
interface DriveItem {
  id: string
  name: string
  type: "folder" | "file"
  fileType?: string
  path: string
  owner: string
  lastModified: string
  fileSize?: string
  parentId: string | null
}

// Mock data for the drive with completely fictional data
const mockDriveData: DriveItem[] = [
  // Root folders
  {
    id: "folder1",
    name: "Project Documents",
    type: "folder",
    path: "/my-drive/project-documents",
    owner: "me",
    lastModified: "3 May 2023",
    parentId: null,
  },
  {
    id: "folder2",
    name: "Marketing Materials",
    type: "folder",
    path: "/my-drive/marketing-materials",
    owner: "me",
    lastModified: "17 Dec 2024",
    parentId: null,
  },
  {
    id: "folder3",
    name: "Client Presentations",
    type: "folder",
    path: "/my-drive/client-presentations",
    owner: "me",
    lastModified: "31 Aug 2024",
    parentId: null,
  },
  {
    id: "folder4",
    name: "Financial Reports",
    type: "folder",
    path: "/my-drive/financial-reports",
    owner: "me",
    lastModified: "9 Apr 2024",
    parentId: null,
  },
  {
    id: "folder5",
    name: "Course Materials",
    type: "folder",
    path: "/my-drive/course-materials",
    owner: "me",
    lastModified: "24 Feb 2023",
    parentId: null,
  },

  // Subfolders inside "Course Materials"
  {
    id: "folder6",
    name: "Introduction Courses",
    type: "folder",
    path: "/my-drive/course-materials/introduction-courses",
    owner: "me",
    lastModified: "24 Feb 2023",
    parentId: "folder5",
  },
  {
    id: "folder7",
    name: "Advanced Courses",
    type: "folder",
    path: "/my-drive/course-materials/advanced-courses",
    owner: "me",
    lastModified: "24 Feb 2023",
    parentId: "folder5",
  },

  // Files in root
  {
    id: "file1",
    name: "company_logo.jpg",
    type: "file",
    fileType: "image",
    path: "/my-drive/company_logo.jpg",
    owner: "me",
    lastModified: "15 Apr 2024",
    fileSize: "1.2 MB",
    parentId: null,
  },
  {
    id: "file2",
    name: "product_banner.ai",
    type: "file",
    fileType: "ai",
    path: "/my-drive/product_banner.ai",
    owner: "me",
    lastModified: "26 Jun 2023",
    fileSize: "29.2 MB",
    parentId: null,
  },
  {
    id: "file3",
    name: "product_banner.jpg",
    type: "file",
    fileType: "image",
    path: "/my-drive/product_banner.jpg",
    owner: "me",
    lastModified: "26 Jun 2023",
    fileSize: "640 KB",
    parentId: null,
  },
  {
    id: "file4",
    name: "quarterly_report.pdf",
    type: "file",
    fileType: "pdf",
    path: "/my-drive/quarterly_report.pdf",
    owner: "me",
    lastModified: "26 Jun 2023",
    fileSize: "888 KB",
    parentId: null,
  },

  // Files in "Course Materials"
  {
    id: "file5",
    name: "syllabus.jpg",
    type: "file",
    fileType: "image",
    path: "/my-drive/course-materials/syllabus.jpg",
    owner: "me",
    lastModified: "24 Feb 2023",
    fileSize: "189 KB",
    parentId: "folder5",
  },
]

// Function to get icon based on file type
const getFileIcon = (type: string) => {
  switch (type) {
    case "image":
      return (
        <div className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-sm">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white">
            <path
              fill="currentColor"
              d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"
            />
          </svg>
        </div>
      )
    case "pdf":
      return (
        <div className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-sm">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white">
            <path
              fill="currentColor"
              d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1zm-2-3h1v3h-1V9zm4 2h1v-1h-1V9h1V8h-2v5h1v-1zm-8 0h1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9v5h1v-2zm0-2h1v1h-1V9z"
            />
          </svg>
        </div>
      )
    case "ai":
      return (
        <div className="w-5 h-5 bg-orange-500 flex items-center justify-center rounded-sm">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white">
            <path
              fill="currentColor"
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"
            />
          </svg>
        </div>
      )
    default:
      return <FileText className="h-5 w-5 text-zinc-400" />
  }
}

export default function DriveContent() {
  const [currentPath, setCurrentPath] = useState<string[]>(["my-drive"])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"name" | "modified">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Get current folder name
  const getCurrentFolderName = () => {
    if (currentPath.length === 1) return "My Drive"

    const folderPath = "/" + currentPath.join("/")
    const folder = mockDriveData.find((item) => item.type === "folder" && item.path.toLowerCase() === folderPath)

    return folder ? folder.name : "My Drive"
  }

  // Get current folder ID
  const getCurrentFolderId = () => {
    if (currentPath.length === 1) return null

    const folderPath = "/" + currentPath.join("/")
    const folder = mockDriveData.find((item) => item.type === "folder" && item.path.toLowerCase() === folderPath)

    return folder ? folder.id : null
  }

  // Get items in current folder
  const getCurrentFolderItems = () => {
    const currentFolderId = getCurrentFolderId()

    let items = mockDriveData.filter((item) => item.parentId === currentFolderId)

    // Sort items
    items = items.sort((a, b) => {
      // Folders first
      if (a.type === "folder" && b.type !== "folder") return -1
      if (a.type !== "folder" && b.type === "folder") return 1

      // Then sort by selected field
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        return sortDirection === "asc"
          ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
          : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      }
    })

    return items
  }

  // Toggle selection of an item
  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Navigate to a folder
  const navigateToFolder = (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.substring(1) : path
    setCurrentPath(cleanPath.split("/"))
  }

  // Navigate to parent folder
  const navigateToParent = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  // Toggle sort direction
  const toggleSort = (field: "name" | "modified") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  // Build breadcrumb paths
  const getBreadcrumbPaths = () => {
    const paths = []
    let currentBuildPath = ""

    for (let i = 0; i < currentPath.length; i++) {
      currentBuildPath += (i === 0 ? "" : "/") + currentPath[i]
      paths.push({
        name: i === 0 ? "My Drive" : currentPath[i].replace(/-/g, " "),
        path: currentBuildPath,
      })
    }

    return paths
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        {/* Breadcrumb navigation */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-medium">{getCurrentFolderName()}</h1>
          {currentPath.length > 1 && (
            <div className="flex items-center ml-4">
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2 bg-zinc-800 rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-8 w-8 ${viewMode === "list" ? "bg-zinc-700" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <Check className={`h-4 w-4 ${viewMode === "list" ? "opacity-100" : "opacity-0"}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-8 w-8 ${viewMode === "grid" ? "bg-zinc-700" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Filter options */}
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
            Type
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
            People
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
            Modified
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
            Source
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* File/folder listing */}
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 py-2 px-4 text-xs text-zinc-400 border-b border-zinc-700">
            <div className="col-span-6 flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
              Name
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2 flex items-center cursor-pointer" onClick={() => toggleSort("modified")}>
              Last modified
              <ArrowUpDown className="ml-1 h-3 w-3" />
            </div>
            <div className="col-span-2">File size</div>
          </div>

          {/* Breadcrumb navigation for subfolders */}
          {currentPath.length > 1 && (
            <div
              className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-zinc-750 border-b border-zinc-700 cursor-pointer"
              onClick={navigateToParent}
            >
              <div className="col-span-12 flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-zinc-400">
                  <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                <span>
                  Back to {currentPath.length > 2 ? currentPath[currentPath.length - 2].replace(/-/g, " ") : "My Drive"}
                </span>
              </div>
            </div>
          )}

          {getCurrentFolderItems().map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 py-3 px-4 text-sm hover:bg-zinc-750 border-b border-zinc-700 last:border-0 ${
                selectedItems.includes(item.id) ? "bg-zinc-750" : ""
              }`}
              onClick={(e) => toggleSelection(item.id, e)}
            >
              <div className="col-span-6 flex items-center gap-3">
                {item.type === "folder" ? (
                  <Folder className="h-5 w-5 text-zinc-400" />
                ) : (
                  getFileIcon(item.fileType || "")
                )}

                {item.type === "folder" ? (
                  <button
                    className="hover:underline text-left"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateToFolder(item.path)
                    }}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link href={item.path} className="hover:underline" onClick={(e) => e.stopPropagation()}>
                    {item.name}
                  </Link>
                )}
              </div>
              <div className="col-span-2">
                <div className="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center text-white text-xs">
                  {item.owner === "me" ? "T" : "J"}
                </div>
              </div>
              <div className="col-span-2 text-zinc-400">{item.lastModified}</div>
              <div className="col-span-1 text-zinc-400">{item.fileSize || "—"}</div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
