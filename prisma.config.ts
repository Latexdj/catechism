import "dotenv/config";
import path from "path";
import { defineConfig } from "prisma/config";

function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return `file:${path.resolve(process.cwd(), "dev.db")}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDbUrl(),
  },
});
