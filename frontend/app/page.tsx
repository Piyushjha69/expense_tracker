"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "./lib/auth";
import { TrendingUp } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/expense");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-400" />
            <span className="text-xl font-bold text-white">Expense Tracker</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Take Control of Your Money
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Track your expenses effortlessly. Understand your spending patterns. Make smarter financial decisions.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border border-slate-600 hover:border-slate-500 text-white font-medium rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6 space-y-4">
              <div className="text-3xl font-bold text-blue-400">$2,450</div>
              <div className="text-sm text-slate-400">Total Spent</div>
              <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6 space-y-4 mt-8">
              <div className="text-3xl font-bold text-green-400">$5,100</div>
              <div className="text-sm text-slate-400">Budget</div>
              <div className="h-1 bg-green-500/20 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-6 space-y-4">
              <div className="text-3xl font-bold text-orange-400">12</div>
              <div className="text-sm text-slate-400">Transactions</div>
              <div className="h-1 bg-orange-500/20 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6 space-y-4 mt-8">
              <div className="text-3xl font-bold text-purple-400">3</div>
              <div className="text-sm text-slate-400">Categories</div>
              <div className="h-1 bg-purple-500/20 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple & Powerful
            </h2>
            <p className="text-lg text-slate-400">Everything you need to manage expenses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Instantly</h3>
              <p className="text-slate-400">Add expenses in seconds with a clean, intuitive interface</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">See Insights</h3>
              <p className="text-slate-400">Understand your spending with visual analytics</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Stay in Control</h3>
              <p className="text-slate-400">Set budgets and manage your finances wisely</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-slate-700 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-slate-400 mb-8">Join thousands tracking their expenses smartly</p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400 text-sm">
          <p>© 2025 Expense Tracker. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
