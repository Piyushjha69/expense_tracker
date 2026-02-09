import { PrismaClient } from '../generated'
import { generateTokens, JwtTokens } from "../utils/jwt.utils"
import { comparePassword, hashPassword } from "../utils/password.utils"

export interface User {
    id: string
    name: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

export interface RegisterDTO {
    name: string
    email: string
    password: string
}

export interface LoginDTO {
    email: string
    password: string
}

export interface AuthResponse {
    user: Omit<User, 'password'>
    tokens: JwtTokens
}

export class AuthService {
    constructor(private prisma: PrismaClient) {}

    async register(data: RegisterDTO): Promise<Omit<User, 'password'>> {
        // Checking if User already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            throw new Error("User with this E-mail already exists")
        }

        // Hashing password before storing
        const hashedPassword = await hashPassword(data.password)

        // Creating a new User
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            },
        })

        // Returning user without password
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }

    async login(data: LoginDTO): Promise<AuthResponse> {
        // Finding User by email
        const user = await this.prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!user) {
            throw new Error("Invalid E-mail or Password")
        }

        // Comparing Hashed Passwords
        const isPasswordValid = await comparePassword(data.password, user.password) 
        if (!isPasswordValid) {
            throw new Error("Invalid E-mail or Password")
        }

        // Generating tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
        })

        // Returning  User (without password) and tokens 
        const { password, ...userWithoutPassword} = user
        return {
            user: userWithoutPassword,
            tokens,
        }
    }

    async refreshAccessToken(refreshToken: string): Promise<JwtTokens> {
        const { verifyRefreshToken } = await import('../utils/jwt.utils')

        const payload = verifyRefreshToken(refreshToken)
        if (!payload) {
            throw new Error("Invalid or expired refresh token")
        }

        // Verifying if user still exists
        const user = await this.prisma.user.findUnique({
            where: {id: payload.userId}
        })
        if (!user) {
            throw new Error("User not found");
        }

        // Generate new tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email
        })

        return tokens
    }

    async logout(userId: string): Promise<void> {
        console.log(`User ${userId} logged out`)
    }
}
