import { Request, Response } from "express";
import { AddExpenseDTO, ExpenseService, UpdateExpenseDTO } from "../services/expense.service";
import { CreateExpenseSchema, ExpenseIdParamSchema, ExpenseListQuerySchema, UpdateExpenseSchema } from "../schemas/expense.schema";
import { any } from "zod";

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
             return res.status(401).json({ success: false, message: "Unauthorized" })
         }

        const expenseService = new ExpenseService((req as any).db);
        const body = CreateExpenseSchema.parse(req.body)
        
        const status = body.status ? body.status.toUpperCase() : "DEBIT";
        
        const data: AddExpenseDTO = {
             title: body.title,
             category: body.category || "other",
             amount: body.amount || 0,
             userId: userId,
             status: status as any
         }

         const expenseId = await expenseService.addExpense(data)

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: { expenseId }
        })
    } catch (error: any){
        if( error?.name === "ZodError") {
            return res.status(400).json ({
                     success: false,
                     message: "Validation Error",
                     errors: error.errors
                 })
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getExpense = async (req: Request, res: Response) => {
     try {
          const userId = getUserId(req);
         if (!userId) {
             return res.status(401).json({ success: false, message: "Unauthorized" });
         }

        const expenseService = new ExpenseService((req as any).db);
        const query = ExpenseListQuerySchema.parse(req.query);

        const page = query.page ? Number(query.page) : 1;
        const limit = query.limit ? Number(query.limit) : 10;

        const result = await expenseService.getExpense(userId, {
            page,
            limit,
            ...(query.status ? { status: query.status } : {}),
            ...(query.search ? { search: query.search } : {}),
        });

        return res.status(200).json({
            success: true,
            data: {
                expense: result.expenses,
                total: result.total,
                page: result.page,
                limit: result.limit
            }
        });
    } catch (error: any) {
        console.error("getExpense error:", error);
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        return res.status(500).json({
             success: false,
             message: "Internal server error",
             error: error?.message || "Unknown error"
         });
    }
};

export const getExpenseById = async (req: Request, res: Response) => {
     try {
         const userId = getUserId(req);
         if (!userId) {
             return res.status(401).json({ success: false, message: "Unauthorized" });
         }

         const expenseService = new ExpenseService((req as any).db);
         const params = ExpenseIdParamSchema.parse(req.params);

         const task = await expenseService.getExpenseById(params.id, userId);

         return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Expense not found") {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        }
        };

        export const updateExpense = async (req: Request, res: Response) => {
             try {
                 const userId = getUserId(req);
                 if (!userId) {
                     return res.status(401).json({ success: false, message: "Unauthorized" });
                 }

        const expenseService = new ExpenseService((req as any).db);
        const params = ExpenseIdParamSchema.parse(req.params);
        const body = UpdateExpenseSchema.parse(req.body);

        const updateData: UpdateExpenseDTO = {};
        
        if (body.title !== undefined) {
            updateData.title = body.title;
        }
        
        if (body.category !== undefined) {
            updateData.category = body.category;
        }
        
        if (body.amount !== undefined) {
            updateData.amount = body.amount;
        }
        
        if (body.status) {
            updateData.status = body.status as any;
        }

        const updatedExpense = await expenseService.updateExpense(params.id, userId, updateData);

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense,
        });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }

        if (error?.message === "Expense not found") {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        }
        };

        export const deleteExpense = async (req: Request, res: Response) => {
        try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const expenseService = new ExpenseService((req as any).db);
        const params = ExpenseIdParamSchema.parse(req.params);

        await expenseService.deleteExpense(params.id, userId);

        return res.status(200).json({
            success: true,
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
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        }
        };