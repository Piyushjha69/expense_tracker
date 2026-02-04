import fp from 'fastify-plugin'

export const jwtPlugin = fp(async (app) => {
    app.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET
    })
})