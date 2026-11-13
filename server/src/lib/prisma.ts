import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const DATABASE_URL = process.env["DATABASE_URL"];

if(!DATABASE_URL) {
  throw new Error("Database URL is missing in .env file!");
}

const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma }