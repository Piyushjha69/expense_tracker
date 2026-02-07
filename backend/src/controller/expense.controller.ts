import { Request, Response } from "express";
import { AddExpenseDTO, ExpenseService, UpdateExpenseDTO } from "../services/expense.service";
import { CreateExpenseSchema, ExpenseIdParamSchema, ExpenseListQuerySchema, UpdateExpenseSchema } from "../schemas/expense.schema";
import { any } from "zod";

const expenseService = new ExpenseService()
const STATUS_TYPE = ["CREDIT", "DEBIT"]

// Helper to safely get userId from Auth middleware
const getUserId = (req: Request): string | null => {
    const user = (req as any).user
    return user?.userId ?? null
}

export const createExpense = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req)
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const body = CreateExpenseSchema.parse(req.body)
        
        let status;
        if (body.status && STATUS_TYPE.includes(body.status.toUpperCase())) {
            status = body.status
        } else {
            return res.status(400).json({ message: "required" })
        }

        const data: AddExpenseDTO = {
            title: body.title,
            userId: userId,
            status: status
        }

        const expenseId = await expenseService.addExpense(data)

        return res.status(201).json({
            message: "Expense added successfully",
            expenseId
        })
    } catch (error: any){
        if( error?.name === "ZodError") {
            return res.status(400).json ({
                message: "Validation Error",
                errors: error.errors
            })
        }

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getExpense = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const query = ExpenseListQuerySchema.parse(req.query);

        const page = query.page ? Number(query.page) : 1;
        const limit = query.limit ? Number(query.limit) : 10;

        const result = await expenseService.getExpense(userId, {
            page,
            limit,
            ...(query.status ? { status: query.status } : {}),
            ...(query.search ? { search: query.search } : {}),
        });


        return res.status(200).json(result);
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getExpenseById = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = ExpenseIdParamSchema.parse(req.params);

        const task = await expenseService.getExpenseById(params.id, userId);

        return res.status(200).json(task);
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Expense not found") {
            return res.status(404).json({ message: "Expense not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateExpense = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = ExpenseIdParamSchema.parse(req.params);
        const body = UpdateExpenseSchema.parse(req.body);

        const updateData: UpdateExpenseDTO = {};
        
        if (body.title !== undefined) {
            updateData.title = body.title;
        }
        
        if (body.status) {
            updateData.status = body.status as any;
        }

        const updatedExpense = await expenseService.updateExpense(params.id, userId, updateData);

        return res.status(200).json({
            message: "Expense updated successfully",
            task: updatedExpense,
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Expense not found") {
            return res.status(404).json({ message: "Expense not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const params = ExpenseIdParamSchema.parse(req.params);

        await expenseService.deleteExpense(params.id, userId);

        return res.status(200).json({
            message: "Expense deleted successfully",
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Expense not found") {
            return res.status(404).json({ message: "Expense not found" });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};