import { z } from 'zod'

export const RegisterSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be atleast 2 characters strong")
        .max(100, "Name must not exceed 100 characters"),
    email: z.email('Invalid email format'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must not exceed 100 characters'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>  