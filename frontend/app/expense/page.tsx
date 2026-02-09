"use client"

import { useAuth } from "../lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { logout } from "../lib/auth";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, LogOut } from "lucide-react";

interface Expense {
    id: string;
    title: string;
    amount: number;
    status: "CREDIT" | "DEBIT";
    createdAt: string;
}

interface ExpenseListResponse {
    expense: Expense[];
    total: number;
    page: number;
    limit: number;
}

export default function ExpensePage() {
    const router = useRouter();
    const { isLoading: authLoading } = useAuth(true);
    const [expenses, setExpenses] = useState<Expense[]>([]);
     const [loading, setLoading] = useState(false);
     const [title, setTitle] = useState("");
     const [amount, setAmount] = useState("");
     const [status, setStatus] = useState<"CREDIT" | "DEBIT">("DEBIT");
     const [editingId, setEditingId] = useState<string | null>(null);
     const [editTitle, setEditTitle] = useState("");
     const [editAmount, setEditAmount] = useState("");
     const [page, setPage] = useState(1);
     const [total, setTotal] = useState(0);
     const limit = 10;

    // Handle logout
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        router.push("/login");
    };

    // Fetch expenses
    const fetchExpenses = async (pageNum: number = 1) => {
      setLoading(true);
      try {
        const res = await apiFetch(`/expense?page=${pageNum}&limit=${limit}`, {
          method: "GET",
        });
        const data: ExpenseListResponse = await res.json();
           console.log("Fetch expenses response:", res.status, data);
           setExpenses(data.expense || []);
        setTotal(data.total || 0);
        setPage(pageNum);
        console.log("Updated expenses state with:", data.expense?.length || 0, "items");
      } catch (err: any) {
        console.error("Fetch expenses error:", err);
        toast.error(err.message || "Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    // Create expense
     const handleCreate = async (e: React.FormEvent) => {
         e.preventDefault();
         if (!title.trim()) {
             toast.error("Title is required");
             return;
         }
         if (!amount || parseFloat(amount) <= 0) {
             toast.error("Amount must be greater than 0");
             return;
         }

         setLoading(true);
         try {
           const res = await apiFetch("/expense", {
             method: "POST",
             body: JSON.stringify({ title, amount: parseFloat(amount), status }),
           });
          const data = await res.json();
          console.log("Create response:", res.status, data);
          if (!res.ok) throw new Error(data.message || "Failed to create expense");
          toast.success("Expense added!");
          setTitle("");
          setAmount("");
          setStatus("DEBIT");
          console.log("Fetching expenses for page:", page);
          const fetchedRes = await apiFetch(`/expense?page=${page}&limit=${limit}`, {
            method: "GET",
          });
          const fetchedData: ExpenseListResponse = await fetchedRes.json();
          setExpenses(fetchedData.expense || []);
          setTotal(fetchedData.total || 0);
          console.log("Expenses fetched, total expenses:", fetchedData.expense?.length || 0);
        } catch (err: any) {
          console.error("Error creating expense:", err);
          toast.error(err.message || "Failed to create expense");
        } finally {
          setLoading(false);
        }
    };

    // Update expense
    const handleUpdate = async (id: string) => {
        if (!editTitle.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!editAmount || parseFloat(editAmount) <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }

        setLoading(true);
        try {
            await apiFetch(`/expense/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ title: editTitle, amount: parseFloat(editAmount) }),
            });
            toast.success("Expense updated!");
            setEditingId(null);
            setEditTitle("");
            setEditAmount("");
            fetchExpenses(page);
        } catch (err: any) {
            toast.error(err.message || "Failed to update expense");
        } finally {
            setLoading(false);
        }
    };

    // Delete expense
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense?")) return;

        setLoading(true);
        try {
            await apiFetch(`/expense/${id}`, {
                method: "DELETE",
            });
            toast.success("Expense deleted!");
            fetchExpenses(page);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete expense");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses(1);
    }, []);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Expense Tracker</h1>
                        <p className="text-slate-400">Manage your expenses efficiently</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Create Form */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Add New Expense</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                         <div className="flex gap-4">
                             <input
                                 type="text"
                                 placeholder="Expense title"
                                 value={title}
                                 onChange={(e) => setTitle(e.target.value)}
                                 className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                             />
                             <input
                                 type="number"
                                 placeholder="Amount"
                                 step="0.01"
                                 min="0"
                                 value={amount}
                                 onChange={(e) => setAmount(e.target.value)}
                                 className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-32"
                             />
                             <select
                                 value={status}
                                 onChange={(e) => setStatus(e.target.value as "CREDIT" | "DEBIT")}
                                 className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
                             >
                                 <option value="DEBIT">Expense (Debit)</option>
                                 <option value="CREDIT">Income (Credit)</option>
                             </select>
                             <button
                                 type="submit"
                                 disabled={loading}
                                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition-colors flex items-center gap-2"
                             >
                                 <Plus size={18} />
                                 Add
                             </button>
                         </div>
                     </form>
                </div>

                {/* Expenses List */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    {expenses.length === 0 ? (
                        <div className="p-6 text-center text-slate-400">
                            No expenses yet. Add one to get started!
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-700">
                                         <tr>
                                             <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                                                 Title
                                             </th>
                                             <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                                                 Amount
                                             </th>
                                             <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                                                 Type
                                             </th>
                                             <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                                                 Date
                                             </th>
                                             <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                                                 Actions
                                             </th>
                                         </tr>
                                     </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 text-white">
                                                    {editingId === expense.id ? (
                                                        <input
                                                            type="text"
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        expense.title
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-white">
                                                    {editingId === expense.id ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                            className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500 w-24"
                                                        />
                                                    ) : (
                                                        `₹${expense.amount?.toFixed(2) || '0.00'}`
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded text-sm font-medium ${expense.status === "CREDIT"
                                                                ? "bg-green-900 text-green-200"
                                                                : "bg-red-900 text-red-200"
                                                            }`}
                                                    >
                                                        {expense.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">
                                                    {new Date(expense.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {editingId === expense.id ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdate(expense.id)}
                                                                    disabled={loading}
                                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded text-sm transition-colors"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingId(null)}
                                                                    className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingId(expense.id);
                                                                        setEditTitle(expense.title);
                                                                        setEditAmount(expense.amount.toString());
                                                                    }}
                                                                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(expense.id)}
                                                                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-slate-700/50 px-6 py-4 flex items-center justify-between">
                                <p className="text-sm text-slate-300">
                                    Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
                                    {total}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchExpenses(page - 1)}
                                        disabled={page === 1 || loading}
                                        className="px-3 py-1 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-white">
                                        {page} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => fetchExpenses(page + 1)}
                                        disabled={page === totalPages || loading}
                                        className="px-3 py-1 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
