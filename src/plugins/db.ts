import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

export const dbPlugin = fp(async (app) => {
  const db = new PrismaClient()
  app.decorate('db', db)

  app.addHook('onClose', async (instance) => {
    await instance.db.$disconnect()
  })
})
