"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { mockFolders } from "~/components/drive-content";
import { mockFiles } from "~/components/drive-content";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import type { File, Folder } from "~/components/drive-content";

export default function MyDrive() {
  const [Breadcrumbs, setBreadcrumbs] = useState([
    mockFolders.find((folder) => folder.id === "root")?.name,
  ]);

  const getChildrenFolders = () => {
    const folders = mockFolders.filter((folder) => folder.parent === "root");
    return folders;
  };
  return (
    <div>
      {/* Breadcrumbs */}
      <section>
        <nav className="flex gap-3 px-4 py-2">
          {Breadcrumbs.map((crumb, index) => {
            return (
              <div key={index} className="flex items-center gap-2">
                <Button className="cursor-pointer hover:bg-neutral-700">
                  {crumb}
                </Button>
                <div>
                  {index < Breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </section>
      <section>
        <div className="container mx-auto py-10">
          <DataTable columns={columns} data={getChildrenFolders()} />
        </div>
      </section>
    </div>
  );
}
