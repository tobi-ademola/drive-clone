"use server";

import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { files_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";
import { MUTATIONS } from "./db/queries";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorised" };
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) {
    return { error: "File not found" };
  }
  const utapiResult = await utApi.deleteFiles([
    file.url.replace("https://95zfhe24mu.ufs.sh/f/", ""),
  ]);

  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  const c = await cookies();

  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function generateFolderUploadPaths(
  relPathNames: string[],
  folderId: string,
  userId: string,
) {
  if (!Number(folderId)) {
    console.error("Invalid folder ID");
    return;
  }
  if (!userId) {
    console.error("Not authenticated");
    return;
  }
  const relPathsId = await MUTATIONS.generateFolderUploadPaths(
    Number(folderId),
    relPathNames,
    userId,
  );

  return relPathsId;
}

export async function createFolder(name: string, currentFolderId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorised" };
  }
  if (!name) return { error: "Name must be defined" };
  if (!currentFolderId) return { error: "Parent folder must be defined" };

  const result = await MUTATIONS.createFolder(
    name,
    currentFolderId,
    session.userId,
  );

  return result;
}
