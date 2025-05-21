import { QUERIES } from "~/server/db/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import {
  ChevronDown,
  ChevronRight,
  DotIcon,
  FileIcon,
  FolderIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import type { DB_FileType, DB_FolderType } from "~/server/db/schema";

export const shorten = (name: string) =>
  name.length > 40 ? name.slice(0, 30) + "..." : name;

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId)) {
    return (
      <section className="grid h-full w-full place-items-center text-red-500">
        Invalid Folder ID
      </section>
    );
  }

  const session = await auth();

  if (!session.userId) redirect("/sign-in");

  const currentFolder = await QUERIES.getFolderById(parsedFolderId);

  if (currentFolder?.ownerId !== session.userId) {
    const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

    return rootFolder ? (
      <div className="grid h-full w-full place-items-center">
        <h2 className="text-2xl text-red-500">
          Access denied: You are not authorised to view this folder. Return to{" "}
          <Link
            href={`/f/${rootFolder.id}`}
            className="text-blue-500 hover:underline"
          >
            Drive
          </Link>
        </h2>
      </div>
    ) : (
      redirect("/sign-in")
    );
  }

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolders(parsedFolderId),
  ]);

  const data: (DB_FileType | DB_FolderType)[] = [...folders, ...files];

  return (
    <>
      <section>
        <Breadcrumb className="mt-4">
          <BreadcrumbList>
            {parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="text-3xl text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                  >
                    <Link href={`/f/${folder.id}`}>{folder.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  {index === parents.length - 1 ? (
                    <ChevronDown className="mx-2 text-neutral-500" size={16} />
                  ) : (
                    <ChevronRight className="mx-2 text-neutral-500" size={16} />
                  )}
                </BreadcrumbSeparator>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </section>
      {/* For viewport widths less than 640px */}
      <section className="my-4 h-full w-full max-sm:block sm:hidden">
        {data.length > 0 ? (
          data.map((item, index) => {
            // Type guard to check if item is a file
            const isFile = (
              item: DB_FileType | DB_FolderType,
            ): item is DB_FileType =>
              "url" in item && typeof item.url === "string";

            if (isFile(item)) {
              return (
                <Button
                  key={index}
                  variant={"link"}
                  className="my-1 h-16 w-full rounded-xl bg-neutral-200 text-left text-black hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-4 px-2 py-3"
                  >
                    <FileIcon className="aspect-square w-6" />
                    <div className="flex flex-col">
                      <span className="text-lg">{shorten(item.name)}</span>
                      <span className="font-normal">
                        {item.size ? `${(item.size / 1024).toFixed(2)} KB` : ""}
                        <DotIcon className="mx-1 inline-block" size={4} />
                        {new Date(item.createdAt).toDateString()}
                      </span>
                    </div>
                  </a>
                </Button>
              );
            } else {
              return (
                <Button
                  variant={"link"}
                  className="my-1 h-16 w-full rounded-xl bg-neutral-200 text-left text-black hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                  key={index}
                >
                  <Link
                    href={`/f/${item.id}`}
                    className="flex w-full items-center gap-4 px-2 py-3"
                  >
                    <FolderIcon className="aspect-square w-6" />

                    <div className="flex flex-col">
                      <span className="text-lg">{shorten(item.name)}</span>
                      <span className="font-normal">
                        {/* <DotIcon className="mx-1 inline-block" size={4} /> */}
                        {new Date(item.createdAt).toDateString()}
                      </span>
                    </div>
                  </Link>
                </Button>
              );
            }
          })
        ) : (
          <div className="grid h-full w-full place-items-center">
            <h2 className="text-2xl text-neutral-500">
              No files or folders found in this directory.
            </h2>
          </div>
        )}
      </section>

      {/* For viewport widths greater than 640px */}
      <section className="my-4 max-sm:hidden sm:block">
        <DataTable data={data} columns={columns} />
      </section>
    </>
  );
}
