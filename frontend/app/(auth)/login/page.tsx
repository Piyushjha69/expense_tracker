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
            console.log("Attempting login with email:", email)
            const res = await apiFetch("/login", {
                method: "POST",
                body: JSON.stringify({ email, password})
            })

            console.log("Login response status:", res.status)
            const data = await res.json()
            console.log("Login response data:", data)
            
            if(!data.success) throw new Error(data.message || "Login failed")

            const tokens = data.data.tokens
            setAccessToken(tokens.accessToken)
            setRefreshToken(tokens.refreshToken)

            toast.success("Login successful!")
            router.push("/expense")
        } catch (err: any) {
            console.error("Login error:", err)
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
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">Sign In</h1>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
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
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
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

                                <button
                                disabled={loading}
                                className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white rounded font-medium transition-all shadow-lg shadow-cyan-500/50"
                                >
                                {loading ? "Signing in..." : "Sign In"}
                                </button>
                        </form>

                        <p className="text-center mt-4 text-sm text-purple-300">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
