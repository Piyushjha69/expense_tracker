import { z } from 'zod'

export const StatusEnum = z.enum(["CREDIT","DEBIT"])

// Create expense (POST /expense)
export const CreateExpenseSchema = z.object ({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Tittle must not exceed 200 characters"),
    status: StatusEnum.optional()
})

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>

// Update expense (PATCH /expense/:id)
export const UpdateExpenseSchema = z.object ({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must not exceed 200 characters")
        .optional(),
    status: StatusEnum.optional
})

export type UpdateExpenseInput = z.infer<typeof UpdateExpenseSchema>

// ExpenseId param (GET/PATCH/DELETE /task/:id)
export const ExpenseIdParamSchema = z.object ({
    id: z.string().uuid("Expense ID must be a valid UUID")
})

export type ExpenseIdParam = z.infer<typeof ExpenseIdParamSchema>

// GET /expense query(pagination + filter + search)
export const ExpenseListQuerySchema = z.object ({
    status: StatusEnum.optional(),
    search: z.string().optional(),
    page: z
        .string()
        .refine ((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Page must be a positive value"
        }),
    limit: z
        .string()
        .refine ((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Limit must be a positive number"
        })
})

export type ExpenseListQuery = z.infer<typeof ExpenseListQuerySchema>