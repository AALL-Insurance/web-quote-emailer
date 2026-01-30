import type { Database } from "./types/database.d.ts"; // this is the Database interface we defined earlier
import * as tedious from "tedious";
import * as tarn from "tarn";
import { Kysely, MssqlDialect } from "kysely";
import { env } from "./env.ts";

const dialect = new MssqlDialect({
  tarn: {
    ...tarn,
    options: {
      min: 0,
      max: 10,
    },
  },
  tedious: {
    ...tedious,
    connectionFactory: () =>
      new tedious.Connection({
        authentication: {
          options: {
            password: env.DATABASE_PASSWORD,
            userName: env.DATABASE_USER,
          },
          type: "default",
        },
        options: {
          database: env.DATABASE_NAME,
          port: 1433,
          trustServerCertificate: true,
        },
        server: env.DATABASE_SERVER,
      }),
  },
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
