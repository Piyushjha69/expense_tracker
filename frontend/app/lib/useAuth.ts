"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken } from "./auth";

const PUBLIC_ROUTES = ["/login", "/register"]

export function useAuth (requireAuth: boolean = true) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = getAccessToken()
        const hasToken = !!token

        setIsAuthenticated(hasToken)

        if (requireAuth && !hasToken) {
            //User needs to be authenticated
            router.replace("/login")
        } else if (!requireAuth && hasToken && PUBLIC_ROUTES.includes(pathname)) {
            router.replace("/expense")
        } else {
            setIsLoading(false)
        }
    }, [requireAuth, router, pathname])

    return {isLoading, isAuthenticated}
}