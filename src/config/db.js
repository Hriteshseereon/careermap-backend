import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis;
// Create the PostgreSQL client connection pool using the environment variable
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter required by Prisma 7
const adapter = new PrismaPg(pool);

// Instantiate the Prisma Client passing the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
