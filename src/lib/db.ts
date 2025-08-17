import { PrismaClient } from '@prisma/client'
import { dbConfig } from './env'

declare global {
  var __prisma: PrismaClient | undefined
}

const prisma = globalThis.__prisma || new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.url
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export { prisma }
