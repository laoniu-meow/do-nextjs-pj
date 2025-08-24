import { PrismaClient } from '@prisma/client'
import { dbConfig } from './env'

declare global {
  var __prisma: PrismaClient | undefined
}

function getPrisma(): PrismaClient {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbConfig.url
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
  }
  return globalThis.__prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  if (globalThis.__prisma) {
    await globalThis.__prisma.$disconnect()
  }
})

// Export the Prisma client directly
export const prisma = getPrisma()
