"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  MoreVertical,
  Check,
  LayoutGrid,
  ArrowUpDown,
  File,
} from "lucide-react";
import { Button } from "~/components/ui/button";

// Mock data structure for folders and files
export interface DriveItem {
  id: string;
  name: string;
  owner: { name: string; email: string; id: string } | string;
  lastModified: string;
  parent: string | null;
}
export interface File extends DriveItem {
  type: "file";
  url: string;
  fileType: string;
  size: string;
}

export interface Folder extends DriveItem {
  type: "folder";
}

export const mockFolders: Folder[] = [
  {
    id: "root",
    name: "My Drive",
    type: "folder",
    owner: "me",
    lastModified: "1 Jan 2023",
    parent: null,
  },
  {
    id: "folder1",
    name: "Project Documents",
    type: "folder",
    owner: "me",
    lastModified: "3 May 2023",
    parent: "root",
  },
  {
    id: "folder2",
    name: "Marketing Materials",
    type: "folder",
    owner: "me",
    lastModified: "17 Dec 2024",
    parent: "root",
  },
  {
    id: "folder3",
    name: "Client Presentations",
    type: "folder",
    owner: "me",
    lastModified: "31 Aug 2024",
    parent: "root",
  },
  {
    id: "folder4",
    name: "Technical Reports",
    type: "folder",
    owner: "me",
    lastModified: "9 Apr 2024",
    parent: "folder1",
  },
  {
    id: "folder5",
    name: "Course Materials",
    type: "folder",
    owner: "me",
    lastModified: "24 Feb 2023",
    parent: "folder1",
  },
  {
    id: "folder6",
    name: "Introduction Courses",
    type: "folder",
    owner: "me",
    lastModified: "24 Feb 2023",
    parent: "folder5",
  },
  {
    id: "folder7",
    name: "Advanced Courses",
    type: "folder",
    owner: "me",
    lastModified: "24 Feb 2023",
    parent: "folder5",
  },
];

export const mockFiles: File[] = [
  {
    id: "file1",
    name: "company_logo",
    type: "file",
    url: "/path/to/company_logo.jpg",
    size: "1.2 MB",
    owner: "me",
    lastModified: "15 Apr 2024",
    parent: "folder2",
    fileType: "jpg",
  },
  {
    id: "file2",
    name: "product_banner",
    type: "file",
    url: "/path/to/product_banner.ai",
    size: "29.2 MB",
    owner: "me",
    lastModified: "26 Jun 2023",
    parent: "folder2",
    fileType: "ai",
  },
  {
    id: "file3",
    name: "product_banner",
    type: "file",
    url: "/path/to/product_banner.jpg",
    size: "640 KB",
    owner: "me",
    lastModified: "26 Jun 2023",
    parent: "folder2",
    fileType: "jpg",
  },
  {
    id: "file4",
    name: "quarterly_report",
    type: "file",
    url: "/path/to/quarterly_report.pdf",
    size: "888 KB",
    owner: "me",
    lastModified: "26 Jun 2023",
    parent: "folder4",
    fileType: "pdf",
  },
  {
    id: "file5",
    name: "syllabus",
    type: "file",
    url: "/path/to/syllabus.jpg",
    size: "189 KB",
    owner: "me",
    lastModified: "24 Feb 2023",
    parent: "folder6",
    fileType: "jpg",
  },
  {
    id: "file6",
    name: "family_vacation_photo",
    type: "file",
    url: "/path/to/family_vacation_photo.jpg",
    size: "2.5 MB",
    owner: "me",
    lastModified: "10 Jan 2023",
    parent: "root",
    fileType: "jpg",
  },
];
// Mock data for the drive with completely fictional data

// Function to get icon based on file type
const getFileIcon = (type: string) => {
  switch (type) {
    case "jpg":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-red-500">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white">
            <path
              fill="currentColor"
              d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"
            />
          </svg>
        </div>
      );
    case "pdf":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-red-500">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white">
            <path
              fill="currentColor"
              d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1zm-2-3h1v3h-1V9zm4 2h1v-1h-1V9h1V8h-2v5h1v-1zm-8 0h1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9v5h1v-2zm0-2h1v1h-1V9z"
            />
          </svg>
        </div>
      );
    default:
      return <File className="h-5 w-5 text-zinc-400" />;
  }
};

export default function DriveContent() {
  //   const [currentPath, setCurrentPath] = useState<string[]>(["root"]);
  //   const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  //   const [selectedItems, setSelectedItems] = useState<string[]>([]);
  //   const [sortBy, setSortBy] = useState<"name" | "modified">("name");
  //   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  //   // Get current folder name
  //   const getCurrentFolderName = () => {
  //     if (currentPath.length === 1) return "My Drive";

  //     const folderPath = "/" + currentPath.join("/");
  //     const folder = mockDriveData.find(
  //       (item) =>
  //         item.type === "folder" && item.path.toLowerCase() === folderPath,
  //     );

  //     return folder ? folder.name : "My Drive";
  //   };

  //   // Get current folder ID
  //   const getCurrentFolderId = () => {
  //     if (currentPath.length === 1) return null;

  //     const folderPath = "/" + currentPath.join("/");
  //     const folder = mockDriveData.find(
  //       (item) =>
  //         item.type === "folder" && item.path.toLowerCase() === folderPath,
  //     );

  //     return folder ? folder.id : null;
  //   };

  //   // Get items in current folder
  //   const getCurrentFolderItems = () => {
  //     const currentFolderId = getCurrentFolderId();

  //     let items = mockDriveData.filter(
  //       (item) => item.parentId === currentFolderId,
  //     );

  //     // Sort items
  //     items = items.sort((a, b) => {
  //       // Folders first
  //       if (a.type === "folder" && b.type !== "folder") return -1;
  //       if (a.type !== "folder" && b.type === "folder") return 1;

  //       // Then sort by selected field
  //       if (sortBy === "name") {
  //         return sortDirection === "asc"
  //           ? a.name.localeCompare(b.name)
  //           : b.name.localeCompare(a.name);
  //       } else {
  //         return sortDirection === "asc"
  //           ? new Date(a.lastModified).getTime() -
  //               new Date(b.lastModified).getTime()
  //           : new Date(b.lastModified).getTime() -
  //               new Date(a.lastModified).getTime();
  //       }
  //     });

  //     return items;
  //   };

  //   // Toggle selection of an item
  //   const toggleSelection = (id: string, e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     if (selectedItems.includes(id)) {
  //       setSelectedItems(selectedItems.filter((item) => item !== id));
  //     } else {
  //       setSelectedItems([...selectedItems, id]);
  //     }
  //   };

  //   // Navigate to a folder
  //   const navigateToFolder = (path: string) => {
  //     // Remove leading slash if present
  //     const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  //     setCurrentPath(cleanPath.split("/"));
  //   };

  //   // Navigate to parent folder
  //   const navigateToParent = () => {
  //     if (currentPath.length > 1) {
  //       setCurrentPath(currentPath.slice(0, -1));
  //     }
  //   };

  //   // Toggle sort direction
  //   const toggleSort = (field: "name" | "modified") => {
  //     if (sortBy === field) {
  //       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  //     } else {
  //       setSortBy(field);
  //       setSortDirection("asc");
  //     }
  //   };

  //   // Build breadcrumb paths
  //   // const getBreadcrumbPaths = () => {
  //   //   const paths = []
  //   //   let currentBuildPath = ""

  //   //   for (let i = 0; i < currentPath.length; i++) {
  //   //     currentBuildPath += (i === 0 ? "" : "/") + currentPath[i]
  //   //     paths.push({
  //   //       name: i === 0 ? "My Drive" : currentPath[i]?.replace(/-/g, " "),
  //   //       path: currentBuildPath,
  //   //     })
  //   //   }

  //   //   return paths
  //   // }

  //   return (
  //     <div className="flex h-full flex-col">
  //       <div className="p-6">
  //         {/* Breadcrumb navigation */}
  //         <div className="mb-6 flex items-center">
  //           <h1 className="text-2xl font-medium">{getCurrentFolderName()}</h1>
  //           {currentPath.length > 1 && (
  //             <div className="ml-4 flex items-center">
  //               <ChevronRight className="h-5 w-5 text-zinc-400" />
  //             </div>
  //           )}
  //           <div className="ml-auto flex items-center gap-2">
  //             <div className="flex items-center gap-2 rounded-full bg-zinc-800 p-1">
  //               <Button
  //                 variant="ghost"
  //                 size="icon"
  //                 className={`h-8 w-8 rounded-full ${viewMode === "list" ? "bg-zinc-700" : ""}`}
  //                 onClick={() => setViewMode("list")}
  //               >
  //                 <Check
  //                   className={`h-4 w-4 ${viewMode === "list" ? "opacity-100" : "opacity-0"}`}
  //                 />
  //               </Button>
  //               <Button
  //                 variant="ghost"
  //                 size="icon"
  //                 className={`h-8 w-8 rounded-full ${viewMode === "grid" ? "bg-zinc-700" : ""}`}
  //                 onClick={() => setViewMode("grid")}
  //               >
  //                 <LayoutGrid className="h-4 w-4" />
  //               </Button>
  //             </div>
  //             <Button
  //               variant="ghost"
  //               size="icon"
  //               className="h-8 w-8 rounded-full"
  //             >
  //               <svg viewBox="0 0 24 24" className="h-5 w-5">
  //                 <path
  //                   fill="currentColor"
  //                   d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
  //                 />
  //               </svg>
  //             </Button>
  //           </div>
  //         </div>

  //         {/* Filter options */}
  //         <div className="mb-4 flex gap-2">
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
  //           >
  //             Type
  //             <ChevronDown className="ml-2 h-4 w-4" />
  //           </Button>
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
  //           >
  //             People
  //             <ChevronDown className="ml-2 h-4 w-4" />
  //           </Button>
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
  //           >
  //             Modified
  //             <ChevronDown className="ml-2 h-4 w-4" />
  //           </Button>
  //           <Button
  //             variant="outline"
  //             size="sm"
  //             className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
  //           >
  //             Source
  //             <ChevronDown className="ml-2 h-4 w-4" />
  //           </Button>
  //         </div>

  // {/* File/folder listing */}
  // <div className="overflow-hidden rounded-lg bg-zinc-800">
  //   <div className="grid grid-cols-12 border-b border-zinc-700 px-4 py-2 text-xs text-zinc-400">
  //     <div
  //       className="col-span-6 flex cursor-pointer items-center"
  //       onClick={() => toggleSort("name")}
  //     >
  //       Name
  //       <ArrowUpDown className="ml-1 h-3 w-3" />
  //     </div>
  //     <div className="col-span-2">Owner</div>
  //     <div
  //       className="col-span-2 flex cursor-pointer items-center"
  //       onClick={() => toggleSort("modified")}
  //     >
  //       Last modified
  //       <ArrowUpDown className="ml-1 h-3 w-3" />
  //     </div>
  //     <div className="col-span-2">File size</div>
  //   </div>

  //   {/* Breadcrumb navigation for subfolders */}
  //   {currentPath.length > 1 && (
  //     <div
  //       className="hover:bg-zinc-750 grid cursor-pointer grid-cols-12 border-b border-zinc-700 px-4 py-3 text-sm"
  //       onClick={navigateToParent}
  //     >
  //       <div className="col-span-12 flex items-center gap-3">
  //         <svg viewBox="0 0 24 24" className="h-5 w-5 text-zinc-400">
  //           <path
  //             fill="currentColor"
  //             d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
  //           />
  //         </svg>
  //         <span>
  //           Back to{" "}
  //           {currentPath.length > 2
  //             ? currentPath[currentPath.length - 2]?.replace(/-/g, " ")
  //             : "My Drive"}
  //         </span>
  //       </div>
  //     </div>
  //   )}

  //           {getCurrentFolderItems().map((item) => (
  //             <div
  //               key={item.id}
  //               className={`hover:bg-zinc-750 grid grid-cols-12 border-b border-zinc-700 px-4 py-3 text-sm last:border-0 ${
  //                 selectedItems.includes(item.id) ? "bg-zinc-750" : ""
  //               }`}
  //               onClick={(e) => toggleSelection(item.id, e)}
  //             >
  //               <div className="col-span-6 flex items-center gap-3">
  //                 {item.type === "folder" ? (
  //                   <Folder className="h-5 w-5 text-zinc-400" />
  //                 ) : (
  //                   getFileIcon(item.fileType ?? "")
  //                 )}

  //                 {item.type === "folder" ? (
  //                   <button
  //                     className="text-left hover:underline"
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       navigateToFolder(item.path);
  //                     }}
  //                   >
  //                     {item.name}
  //                   </button>
  //                 ) : (
  //                   <Link
  //                     href={item.path}
  //                     className="hover:underline"
  //                     onClick={(e) => e.stopPropagation()}
  //                   >
  //                     {item.name}
  //                   </Link>
  //                 )}
  //               </div>
  //               <div className="col-span-2">
  //                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-xs text-white">
  //                   {item.owner === "me" ? "T" : "J"}
  //                 </div>
  //               </div>
  //               <div className="col-span-2 text-zinc-400">
  //                 {item.lastModified}
  //               </div>
  //               <div className="col-span-1 text-zinc-400">
  //                 {item.fileSize ?? "—"}
  //               </div>
  //               <div className="col-span-1 flex justify-end">
  //                 <Button
  //                   variant="ghost"
  //                   size="icon"
  //                   className="h-8 w-8 text-zinc-400"
  //                   onClick={(e) => e.stopPropagation()}
  //                 >
  //                   <MoreVertical className="h-4 w-4" />
  //                 </Button>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  return <div>Drive Contents</div>;
}
