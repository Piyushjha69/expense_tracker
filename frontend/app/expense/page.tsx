"use client"

import { useAuth } from "../lib/useAuth";

export default function ExpensePage() {
  const { isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Expense Tracker</h1>
          <p className="text-slate-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
