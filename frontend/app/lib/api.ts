import { getAccessToken, getRefreshToken, logout, setAccessToken } from "./auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing in .env.local")
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    try {
        const token = getAccessToken()
        console.log("apiFetch - Token:", token ? "exists" : "missing", "Endpoint:", endpoint)

        let res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers || {})
            }
        })
        console.log("apiFetch response status:", res.status, "for endpoint:", endpoint)

        // refresh if access is expired
         if (res.status === 401) {
             //only attempt refresh if we had a token
             if (!token) {
                 //no token means user isn't logged in - don't redirect on login page
                 throw new Error("Please Login to continue")
             }

            const refreshed = await refreshAccessToken()
            if (!refreshed) {
                logout()
                throw new Error("Session expired. Please login again")
            }

            const newToken = getAccessToken()
            res = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
                    ...(options.headers || {})
                }
            })
        }

        if (!res.ok && res.status !== 401) {
            const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
            throw new Error(error.message || `API Error: ${res.status}`)
        }

        return res
    } catch (err) {
        console.error("API Error:", err)
        throw err instanceof Error ? err : new Error("Failed to fetch (Backend not reachable / CORS issue)")
    }
}

async function refreshAccessToken() {
    try {
        const refreshToken = getRefreshToken()
        if(!refreshToken) return false

        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refreshToken})
        })

        if (!res.ok) return false

        const data = await res.json()
        if (data.success && data.data) {
            setAccessToken(data.data.accessToken)
            return true
        }
        return false
    } catch  {
        return false
    }
}