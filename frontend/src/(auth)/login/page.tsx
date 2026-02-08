import { useRouter } from "next/router";
import { useAuth } from "../../lib/useAuth";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { setAccessToken, setRefreshToken } from "../../lib/auth";
import { toast } from "sonner";
import { Link } from "lucide-react";

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
        } else if (!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email)) {  // Regex E-mail validation (checks email format)
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
            const res = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password})
            })

            const data = await res.json()
            if(!data.success) throw new Error(data.message || "Login failed")

            const tokens = data.data.tokens
            setAccessToken(tokens.accessToken)
            setRefreshToken(tokens.refershToken)

            toast.success("Login successful!")
            router.push("/expense")
        } catch (err: any) {
            toast.error(err.message || "Login Failed")
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return  (
            <div>
                <div />
            </div>
        )
    }

    return (
        <div>
            <header>
                <Link href="/">
                    &larr; Back
                </Link>
            </header>

            <div>
                <div>
                    <h1>Sign in</h1>
                    <form onSubmit={handleLogin}>
                        <div>
                            <input 
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                if(errors.email) setErrors({...errors, email: undefined})
                            }} 
                            />
                            {errors.email && (
                                <p>{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <input 
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (errors.password) setErrors({...errors, password: undefined})
                                }}
                            />
                            {errors.password && (
                                <p>{errors.password}</p>
                            )}
                        </div>

                        <button
                            disabled={loading}

                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p>
                        Don&apos;t have an account?{" "}
                        <Link href="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}   