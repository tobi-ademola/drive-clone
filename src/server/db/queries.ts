import "server-only";

import {
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "~/server/db/schema";
import { db } from "~/server/db";
import { and, eq, isNull } from "drizzle-orm";

export const QUERIES = {
  getAllParentsForFolders: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;

    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }

      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }

    return parents;
  },
  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId))
      .orderBy(filesSchema.id);
  },
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId))
      .orderBy(foldersSchema.id);
  },
  getFolderById: async function (folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId))
      .limit(1);
    return folder[0];
  },
  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(
        and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)),
      );

    return folder[0];
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      ownerId: input.userId,
    });
  },

  createFolder: async function (
    name: string,
    currentFolderId: number,
    userId: string,
  ) {
    const folders = await db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.name, name),
          eq(foldersSchema.parent, currentFolderId),
        ),
      )
      .limit(1)
      .execute();

    if (folders.length === 0) {
      const newFolderId = await db
        .insert(foldersSchema)
        .values({
          ownerId: userId,
          name: name,
          parent: currentFolderId,
        })
        .$returningId();

      return newFolderId[0];
    }

    return `Folder named ${name} already exist!`;
  },

  generateFolderUploadPaths: async function (
    currentFolderId: number,
    relPathsNames: string[],
    userId: string,
  ): Promise<number[]> {
    const relPathsId: number[] = [currentFolderId];

    for (let i = 0; i < relPathsNames.length - 1; i++) {
      console.log(
        `Checking for folder "${relPathsNames[i]}" under parent ID ${relPathsId[i]}`,
      );

      const folders = await db
        .select()
        .from(foldersSchema)
        .where(
          and(
            eq(foldersSchema.name, relPathsNames[i]!),
            eq(foldersSchema.parent, relPathsId[i]!),
          ),
        )
        .limit(1)
        .execute();

      if (folders.length === 0) {
        console.log(`Folder not found, creating: ${relPathsNames[i]}`);

        const newFolderId = await db
          .insert(foldersSchema)
          .values({
            ownerId: userId,
            name: relPathsNames[i]!,
            parent: relPathsId[i],
          })
          .$returningId();

        console.log(`Created folder with ID: ${newFolderId[0]?.id}`);

        if (newFolderId[0]) relPathsId.push(newFolderId[0]?.id);
      } else {
        console.log(`Folder exists with ID: ${folders[0]?.id}`);
        if (folders[0]) relPathsId.push(folders[0]?.id);
        continue;
      }
    }

    return relPathsId;
  },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: "My Drive",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(foldersSchema).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
};
