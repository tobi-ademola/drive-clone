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

  const [folders, files, parents] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolders(parsedFolderId),
  ]);

  const data = [...folders, ...files];
  console.log(parents);

  return (
    // <DriveContents
    //   files={files}
    //   folders={folders}
    //   parents={parents}
    //   currentFolderId={parsedFolderId}
    // />
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
