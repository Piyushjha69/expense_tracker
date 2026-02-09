"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../lib/useAuth";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { setAccessToken, setRefreshToken } from "../../lib/auth";
import { toast } from "sonner";

export default function loginPage() {
    const router = useRouter();
    const { isLoading: authLoading } = useAuth(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?:string; password?:string}>({})

    function validateForm () {
        const newErrors : { email?:string; password?:string } = {}

        if (!email.trim()){
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {  // Regex E-mail validation (checks email format)
            newErrors.email = "Please enter a valid E-mail" 
        }

        if (!password) {
            newErrors.password = "Password is required"
        } else if ( password.length < 6 ) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors (newErrors)
        return Object.keys(newErrors).length === 0;
    }

    async function handleLogin (e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) return 

        setLoading(true)

        try {
            const res = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify({ email, password})
            })

            const data = await res.json()
            if(!data.success) throw new Error(data.message || "Login failed")

            const tokens = data.data.tokens
            setAccessToken(tokens.accessToken)
            setRefreshToken(tokens.refreshToken)

            toast.success("Login successful!")
            router.push("/expense")
        } catch (err: any) {
            toast.error(err.message || "Login Failed")
        } finally {
            setLoading(false)
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
                        <h1 className="text-2xl font-bold text-white mb-6">Sign In</h1>
                        <form onSubmit={handleLogin} className="space-y-4">
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

                            <button
                                disabled={loading}
                                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded font-medium transition-colors"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="text-center mt-4 text-sm text-slate-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-blue-400 hover:text-blue-300">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
