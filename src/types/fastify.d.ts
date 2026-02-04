import 'fastify';
import { PrismaClient } from "@prisma/client";

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient
    
  }

  interface User {
    username: String,
    password: String
  }

  interface FastifyRequest {
    rawBody?: String
  }
}
