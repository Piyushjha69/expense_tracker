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
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950">
            <header className="border-b border-purple-500/30 bg-black/30 backdrop-blur-sm shadow-lg shadow-purple-500/10">
                <div className="max-w-md mx-auto px-4 py-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="bg-black/40 rounded-lg border border-purple-500/40 p-6 backdrop-blur-md shadow-lg shadow-purple-500/20">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">Create Account</h1>
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
                                    className="w-full px-3 py-2 bg-black/50 border border-cyan-500/50 rounded text-cyan-300 placeholder-cyan-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                                />
                                {errors.name && (
                                    <p className="text-pink-400 text-sm mt-1">{errors.name}</p>
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
                                    className="w-full px-3 py-2 bg-black/50 border border-cyan-500/50 rounded text-cyan-300 placeholder-cyan-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                                />
                                {errors.email && (
                                    <p className="text-pink-400 text-sm mt-1">{errors.email}</p>
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
                                    className="w-full px-3 py-2 bg-black/50 border border-pink-500/50 rounded text-pink-300 placeholder-pink-600 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
                                />
                                {errors.password && (
                                    <p className="text-pink-400 text-sm mt-1">{errors.password}</p>
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
                                    className="w-full px-3 py-2 bg-black/50 border border-pink-500/50 rounded text-pink-300 placeholder-pink-600 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-pink-400 text-sm mt-1">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <button
                                disabled={loading}
                                className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 shadow-lg shadow-cyan-500/50 text-white rounded font-medium transition-colors"
                            >
                                {loading ? "Creating Account..." : "Register"}
                            </button>
                        </form>

                        <p className="text-center mt-4 text-sm text-purple-300">
                            Already have an account?{" "}
                            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
