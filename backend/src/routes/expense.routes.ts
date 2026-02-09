import express from 'express'
import { authenticateToken } from '../middlewares/auth.middlewares'
import { validateRequest } from '../middlewares/validate.middlewares'
import { CreateExpenseSchema, ExpenseIdParamSchema, ExpenseListQuerySchema, UpdateExpenseSchema } from '../schemas/expense.schema'
import { createExpense, deleteExpense, getExpense, getExpenseById, updateExpense } from '../controller/expense.controller'

const router = express.Router()

router.get (
    "/",
    authenticateToken,
    validateRequest ({ query: ExpenseListQuerySchema }),
    getExpense
)

router.post (
    "/",
    authenticateToken,
    validateRequest ({ body: CreateExpenseSchema }),
    createExpense
)

router.get (
    "/:id",
    authenticateToken,
    validateRequest ({ params: ExpenseIdParamSchema }),
    getExpenseById
)

router.patch (
    "/:id",
    authenticateToken,
    validateRequest ({ params: ExpenseIdParamSchema, body: UpdateExpenseSchema }),
    updateExpense
)

router.delete (
    "/:id",
    authenticateToken,
    validateRequest ({ params: ExpenseIdParamSchema }),
    deleteExpense
)

export default router