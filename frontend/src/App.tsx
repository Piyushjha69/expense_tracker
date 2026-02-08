"use client"

import Link from "next/link";
import { useEffect, useState } from "react"
import { getAccessToken } from "./lib/auth";


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getToken = getAccessToken();
    if (getToken) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <main className="min-h-screen bg-neutral-950">
      <div>
        {/* Header */}
        <header>
          <span>ExpenseFlow</span>
          {!isLoggedIn && (
            <Link href="/login">sign in</Link>
          )}
        </header>

        {/* Hero */}
        <div>
          <div>
            <h1>Manage Expenses 
              <br />
              Stay focused   
            </h1>
            <p>
              A simple way to organise and track your Expenses.
            </p>
            <div>
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/register"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/login"
                  >
                    SignIn
                  </Link>
                </>
              ):(
                  <Link
                    href="/expense"
                  >
                    Go to Dashboard
                  </Link>
              )}
            </div>
          </div>
        </div>
      
              
        {/* Footer */}
        <footer >
              Built with Next.js and TypeScript 
        </footer>
      </div>
    </main>
  )
}


