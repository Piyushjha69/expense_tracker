import Fastify from "fastify";

const fastify = Fastify({
    logger: true
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

// run the server

const start = async () => {

    await fastify.listen({ port: 5000, host: '0.0.0.0' }, function (err, address) {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`Server listening on ${address}`)
    })
}
start()
