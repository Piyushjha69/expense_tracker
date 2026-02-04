import type { FastifyPluginAsync, User } from "fastify";


export const registerRoutes: FastifyPluginAsync = async (app) => {
    const bcrypt = require('bcryptjs')
    const User = app.db.User

    app.post( '/register', async (request, reply) => {
        const{ username, password } = request.body as User

        //checking if user exists
        const existingUser = User.find((u:  User) => u.username === username)
        if (existingUser){
            return reply.status(400).send({message: 'User ALready Exists'})
        }

        //hashing the password
        const passwordHash = await bcrypt.hash(password, 10)

        //creating new user
        const newUser = { id: User.length + 1, username, passwordHash }
        User.push(newUser)  

        reply.status(201).send({message: 'User Registered Successfully'})
    })
}