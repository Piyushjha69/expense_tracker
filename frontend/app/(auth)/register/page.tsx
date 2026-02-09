"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../lib/useAuth";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { setAccessToken, setRefreshToken } from "../../lib/auth";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const { isLoading: authLoading } = useAuth(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    function validateForm() {
        const newErrors: {
            name?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await apiFetch("/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Registration failed");

            const tokens = data.data.tokens;
            setAccessToken(tokens.accessToken);
            setRefreshToken(tokens.refreshToken);

            toast.success("Registration successful!");
            router.push("/expense");
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-md mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                        <h1 className="text-2xl font-bold text-white mb-6">Create Account</h1>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <input
                                    placeholder="Full Name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name)
                                            setErrors({ ...errors, name: undefined });
                                    }}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email)
                                            setErrors({ ...errors, email: undefined });
                                    }}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password)
                                            setErrors({ ...errors, password: undefined });
                                    }}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword)
                                            setErrors({
                                                ...errors,
                                                confirmPassword: undefined,
                                            });
                                    }}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <button
                                disabled={loading}
                                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition-colors"
                            >
                                {loading ? "Creating Account..." : "Register"}
                            </button>
                        </form>

                        <p className="text-center mt-4 text-sm text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
