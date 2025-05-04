"use client";

import { type ColumnDef } from "@tanstack/react-table";
import type { DB_FileType, DB_FolderType } from "~/server/db/schema";
import Link from "next/link";
import { FileIcon, FolderIcon } from "lucide-react";

// type DB_FileType = {
//   id: number;
//   ownerId: string;
//   name: string;
//   size: number;
//   url: string;
//   parent: number;
//   createdAt: Date;
// };
// type DB_FolderType = {
//     id: number;
//     ownerId: string;
//     name: string;
//     parent: number | null;
//     createdAt: Date;
// }

export const columns: ColumnDef<DB_FileType | DB_FolderType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name =
        row.original.name.length > 40
          ? row.original.name.slice(0, 30) + "..."
          : row.original.name;
      if ("url" in row.original) {
        return (
          <a
            href={row.original.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3"
          >
            <FileIcon className="aspect-square w-3" />
            {name}
          </a>
        );
      } else {
        return (
          <Link href={`/f/${row.original.id}`} className="flex gap-3">
            <FolderIcon className="mr-2 aspect-square w-3" />
            {name}
          </Link>
        );
      }
    },
  },
  {
    accessorKey: "ownerId",
    header: "Owner",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => new Date(row.original.createdAt).toDateString(),
  },
  {
    accessorKey: "size",
    header: "File size",
    cell: ({ row }) =>
      "size" in row.original ? `${row.original.size} bytes` : "-",
  },
];
