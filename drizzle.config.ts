import { defineConfig } from "drizzle-kit";

import { env } from "~/env";

// export default defineConfig({
//   schema: "./src/server/db/schema.ts",
//   dialect: "singlestore",
//   dbCredentials: {
//     host: env.SINGLESTORE_HOST,
//     user: env.SINGLESTORE_USER,
//     password: env.SINGLESTORE_PASS,
//     port: env.SINGLESTORE_PORT,
//     database: env.SINGLESTORE_DB_NAME,
//     ssl: {},
//   },
//   tablesFilter: ["drive-clone_*"],
// });
export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  dbCredentials: {
    host: env.SINGLESTORE_HOST,
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    port: parseInt(env.SINGLESTORE_PORT),
    database: env.SINGLESTORE_DB_NAME,
    ssl: {},
  },
});
