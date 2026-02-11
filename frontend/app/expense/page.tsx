"use client"

import { useAuth } from "../lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { logout } from "../lib/auth";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, LogOut } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

const CATEGORIES = [
    { value: "food", label: "🍔 Food" },
    { value: "travel", label: "✈️ Travel" },
    { value: "shopping", label: "🛍️ Shopping" },
    { value: "phone_recharge", label: "📱 Phone Recharge" },
    { value: "wifi_recharge", label: "📶 WiFi Recharge" },
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "utilities", label: "💡 Utilities" },
    { value: "healthcare", label: "⚕️ Healthcare" },
    { value: "other", label: "📌 Other" },
];

const COLORS = ["#00D9FF", "#FF006E", "#8338EC", "#FFBE0B", "#FF1493", "#FF006E", "#00D9FF", "#3A86FF", "#FFD700"];

interface Expense {
    id: string;
    title: string;
    category: string;
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
     const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
     const [loading, setLoading] = useState(false);
     const [title, setTitle] = useState("");
     const [category, setCategory] = useState("other");
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

    // Fetch all expenses (for charts)
    const fetchAllExpenses = async () => {
        try {
            let allExp: Expense[] = [];
            let currentPage = 1;
            let hasMore = true;
            
            while (hasMore) {
                const res = await apiFetch(`/expense?page=${currentPage}&limit=100`, {
                    method: "GET",
                });
                const data: any = await res.json();
                const expenses = data.data?.expense || [];
                allExp = [...allExp, ...expenses];
                
                const total = data.data?.total || 0;
                hasMore = allExp.length < total;
                currentPage++;
            }
            setAllExpenses(allExp);
        } catch (err: any) {
            console.error("Fetch all expenses error:", err);
        }
    };

    // Fetch expenses for current page
    const fetchExpenses = async (pageNum: number = 1) => {
        setLoading(true);
        try {
            const res = await apiFetch(`/expense?page=${pageNum}&limit=${limit}`, {
                method: "GET",
            });
            const data: any = await res.json();
            console.log("Fetch expenses response:", res.status, data);
            setExpenses(data.data?.expense || []);
            setTotal(data.data?.total || 0);
            setPage(pageNum);
            console.log("Updated expenses state with:", data.data?.expense?.length || 0, "items");
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
                body: JSON.stringify({ title, category, amount: parseFloat(amount), status }),
            });
            const data = await res.json();
            console.log("Create response:", res.status, data);
            if (!res.ok) throw new Error(data.message || "Failed to create expense");
            toast.success("Expense added!");
            setTitle("");
            setCategory("other");
            setAmount("");
            setStatus("DEBIT");
            console.log("Fetching expenses for page:", page);
             await fetchExpenses(page);
             await fetchAllExpenses();
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
            await fetchExpenses(page);
            await fetchAllExpenses();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete expense");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses(1);
        fetchAllExpenses();
    }, []);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    const totalPages = Math.ceil(total / limit);

    // Calculate chart data from ALL expenses - Debit and Credit by individual titles
    const debitData = allExpenses
        .filter(e => e.status === "DEBIT")
        .map(e => ({
            name: e.title,
            value: Math.round(e.amount * 100) / 100,
        }))
        .sort((a, b) => b.value - a.value);

    const creditData = allExpenses
        .filter(e => e.status === "CREDIT")
        .map(e => ({
            name: e.title,
            value: Math.round(e.amount * 100) / 100,
        }))
        .sort((a, b) => b.value - a.value);

    const totalDebits = debitData.reduce((sum, e) => sum + e.value, 0);
    const totalCredits = creditData.reduce((sum, e) => sum + e.value, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">Expense Tracker</h1>
                        <p className="text-lg text-purple-300">Manage your expenses efficiently</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-pink-500/50"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Create Form */}
                <div className="bg-black/40 rounded-lg border border-cyan-500/40 p-8 mb-8 backdrop-blur-md shadow-lg shadow-cyan-500/20">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mb-4">Add New Expense</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="flex gap-4 items-center flex-wrap">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    if (e.target.value !== "other") {
                                        const cat = CATEGORIES.find(c => c.value === e.target.value);
                                        setTitle(cat?.label.split(" ").slice(1).join(" ") || "");
                                    }
                                }}
                                className="px-3 py-2 bg-black/50 border border-cyan-500/50 rounded text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            {category === "other" && (
                                <input
                                    type="text"
                                    placeholder="Expense title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-black/50 border border-purple-500/50 rounded text-cyan-300 placeholder-purple-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 min-w-40"
                                />
                            )}
                            {category !== "other" && (
                                <div className="flex-1 px-3 py-2 bg-black/50 border border-purple-500/40 rounded text-purple-300 min-w-40 backdrop-blur-sm">
                                    {title}
                                </div>
                            )}
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="px-3 py-2 bg-black/50 border border-pink-500/50 rounded text-pink-300 placeholder-pink-700 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 w-28 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:appearance-textfield"
                                required
                            />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as "CREDIT" | "DEBIT")}
                                className="px-3 py-2 bg-black/50 border border-yellow-500/50 rounded text-yellow-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/30"
                            >
                                <option value="DEBIT">Expense (Debit)</option>
                                <option value="CREDIT">Income (Credit)</option>
                            </select>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-500/50"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    </form>
                </div>

                {/* Charts Section */}
                {allExpenses.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Pie Chart - Debits by Title */}
                        <div className="bg-black/40 rounded-lg border border-pink-500/40 p-8 backdrop-blur-md shadow-lg shadow-pink-500/20">
                            <h2 className="text-2xl font-semibold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">Expenses (Debits) - ₹{totalDebits.toFixed(2)}</h2>
                            <p className="text-sm text-pink-300 mb-4">{debitData.length} expense(s)</p>
                            {debitData && debitData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={debitData}
                                            cx="40%"
                                            cy="50%"
                                            labelLine={false}
                                            label={false}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {debitData.map((entry, index) => (
                                                <Cell key={`debit-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            wrapperStyle={{ paddingLeft: "10px" }}
                                            formatter={(value, entry: any) => `${entry.payload.name}: ₹${entry.payload.value}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-pink-400">
                                    No expenses added yet
                                </div>
                            )}
                        </div>

                        {/* Pie Chart - Credits by Title */}
                        <div className="bg-black/40 rounded-lg border border-emerald-500/40 p-8 backdrop-blur-md shadow-lg shadow-emerald-500/20">
                            <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">Income (Credits) - ₹{totalCredits.toFixed(2)}</h2>
                            <p className="text-sm text-emerald-300 mb-4">{creditData.length} income(s)</p>
                            {creditData && creditData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={creditData}
                                            cx="40%"
                                            cy="50%"
                                            labelLine={false}
                                            label={false}
                                            outerRadius={70}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {creditData.map((entry, index) => (
                                                <Cell key={`credit-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            wrapperStyle={{ paddingLeft: "10px" }}
                                            formatter={(value, entry: any) => `${entry.payload.name}: ₹${entry.payload.value}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-emerald-400">
                                    No income added yet
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Expenses List */}
                <div className="bg-black/40 rounded-lg border border-cyan-500/40 overflow-hidden backdrop-blur-md shadow-lg shadow-cyan-500/20">
                    {expenses.length === 0 ? (
                        <div className="p-6 text-center text-purple-400">
                            No expenses yet. Add one to get started!
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-black/50 border-b border-cyan-500/40 backdrop-blur-md">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-cyan-500/20">
                                        {expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-purple-500/10 transition-colors">
                                                <td className="px-6 py-4 text-cyan-300">
                                                    {editingId === expense.id ? (
                                                        <input
                                                            type="text"
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            className="px-2 py-1 bg-black/50 border border-cyan-500/50 rounded text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        expense.title
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-pink-300">
                                                    {editingId === expense.id ? (
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                            className="px-2 py-1 bg-black/50 border border-pink-500/50 rounded text-pink-300 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 w-24"
                                                        />
                                                    ) : (
                                                        `₹${expense.amount?.toFixed(2) || '0.00'}`
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded text-sm font-medium ${expense.status === "CREDIT"
                                                            ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                                                            : "bg-pink-500/30 text-pink-300 border border-pink-500/50"
                                                            }`}
                                                    >
                                                        {expense.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-purple-400 text-sm">
                                                    {new Date(expense.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {editingId === expense.id ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdate(expense.id)}
                                                                    disabled={loading}
                                                                    className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white rounded text-sm transition-all shadow-lg shadow-emerald-500/50"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingId(null)}
                                                                    className="px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white rounded text-sm transition-all"
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
                                                                    className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
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
                            <div className="bg-black/50 border-t border-cyan-500/40 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-lg shadow-cyan-500/10">
                                <p className="text-sm bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                                    Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of{" "}
                                    {total}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fetchExpenses(page - 1)}
                                        disabled={page === 1 || loading}
                                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white rounded text-sm transition-all shadow-lg shadow-purple-500/30"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent font-semibold">
                                        {page} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => fetchExpenses(page + 1)}
                                        disabled={page === totalPages || loading}
                                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white rounded text-sm transition-all shadow-lg shadow-purple-500/30"
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
