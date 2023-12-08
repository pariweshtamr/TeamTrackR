import { PrismaClient } from "@prisma/client"

// adding prisma var to global window
declare global {
  let prisma: PrismaClient | undefined
}

const db = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db

export default db
