"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { File, Folder } from "~/components/drive-content";

export const columns: ColumnDef<File | Folder>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "lastModified",
    header: "Last modified",
  },
  {
    accessorKey: "size",
    header: "File size",
  },
];
