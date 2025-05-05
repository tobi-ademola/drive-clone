import { QUERIES } from "~/server/db/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ChevronDown, ChevronRight } from "lucide-react";
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

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderId);

  if (isNaN(parsedFolderId)) {
    return (
      <section className="grid h-full w-full place-items-center">
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

  const data = [...folders, ...files];

  return (
    <>
      <section>
        <Breadcrumb className="py-3">
          <BreadcrumbList>
            {parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className="text-3xl text-neutral-300 hover:text-white"
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
      <DataTable data={data} columns={columns} />
    </>
  );
}
