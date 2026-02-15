import { PrismaClient } from "@prisma/client";
import { ExpenseStatus } from "../generated/enums";

export interface AddExpenseDTO {
     title: string
     category?: string
     amount: number
     status: ExpenseStatus
     userId: string
 }

export interface UpdateExpenseDTO {
     title?: string
     category?: string
     amount?: number
     status?: ExpenseStatus
 }

export interface ExpenseListQueryDTO {
    page?: number
    limit?: number
    status?: ExpenseStatus
    search?: string
}

interface WhereCondition {
    userId?: string
    status?: ExpenseStatus
    title?: object
}

export class ExpenseService {
    constructor(private prisma: PrismaClient) {}

    async addExpense(data: AddExpenseDTO): Promise<string> {
         const expense = await this.prisma.expense.create({
             data: {
                 title: data.title,
                 category: data.category || "other",
                 amount: data.amount,
                 status: data.status,
                 userId: data.userId
             }
         })
         return expense.id
     }

    async getExpense(userId: string, query: ExpenseListQueryDTO) {
        try {
            const page = query.page ?? 1
            const limit = query.limit ?? 10
            const skip = (page - 1) * limit

            const where: WhereCondition = {
                userId
            }

            // Filter by status
            if (query.status) {
                where.status = query.status
            }

            // Filter by title 
            if (query.search) {
                where.title = {
                    contains: query.search
                }
            }

            const [expense, total] = await Promise.all([
                this.prisma.expense.findMany({
                    where,
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                }),
                this.prisma.expense.count({ where })
            ])

            return {
                expenses: expense,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        } catch (error: any) {
            console.error("ExpenseService.getExpense error:", error);
            throw error;
        }
    }

    async getExpenseById(expenseId: string, userId: string) {
        const expense = await this.prisma.expense.findFirst({
            where: { id: expenseId, userId }
        })

        if (!expense) {
            throw new Error("This expense was not found")
        }

        return expense
    }

    async updateExpense(expenseId: string, userId: string, data: UpdateExpenseDTO) {
        const existing = await this.prisma.expense.findFirst({
            where: { id: expenseId, userId }
        })

        if (!existing) {
            throw new Error("This expense was not found")
        }

        const updatedExpense = await this.prisma.expense.update({
             where: { id: expenseId },
             data: {
                 ...(data.title !== undefined ? { title: data.title } : {}),
                 ...(data.category !== undefined ? { category: data.category } : {}),
                 ...(data.amount !== undefined ? { amount: data.amount } : {}),
                 ...(data.status !== undefined ? { status: data.status } : {}),
             }
         })
         return updatedExpense
    }

    async deleteExpense(expenseId:string,userId:string) {
        const existing = await this.prisma.expense.findFirst({
            where: {id: expenseId,userId}
        })

        if(!existing) {
            throw new Error ("This expense was not found")
        }

        await this.prisma.expense.delete({
            where: {id: expenseId}
        })
    }
}