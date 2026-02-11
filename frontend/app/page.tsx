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
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-indigo-950">
            {/* Navigation */}
            <nav className="border-b border-purple-500/30 backdrop-blur-sm shadow-lg shadow-purple-500/20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-7 h-7 text-cyan-400" />
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">Expense Tracker</span>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/login"
                            className="px-6 py-2 text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                           href="/register"
                           className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg shadow-pink-500/50"
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
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6 leading-tight">
                            Take Control of Your Money
                        </h1>
                        <p className="text-xl text-purple-300 mb-8 leading-relaxed">
                            Track your expenses effortlessly. Understand your spending patterns. Make smarter financial decisions.
                        </p>
                        <div className="flex gap-4">
                            <Link
                              href="/register"
                              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/50"
                            >
                              Start Free
                            </Link>
                              <Link
                                href="/login"
                                className="px-8 py-3 border-2 border-purple-500 hover:border-purple-400 text-purple-300 font-medium rounded-lg transition-all hover:bg-purple-500/10"
                              >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual */}
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-700/10 border border-cyan-500/40 rounded-lg p-6 space-y-4 shadow-lg shadow-cyan-500/20">
                             <div className="text-3xl font-bold text-cyan-400">₹2,450</div>
                             <div className="text-sm text-cyan-300">Total Spent</div>
                             <div className="h-1 bg-cyan-700/30 rounded-full overflow-hidden">
                                 <div className="h-full w-3/4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
                             </div>
                         </div>
                         <div className="bg-gradient-to-br from-magenta-600/10 to-pink-700/10 border border-pink-500/40 rounded-lg p-6 space-y-4 mt-8 shadow-lg shadow-pink-500/20">
                             <div className="text-3xl font-bold text-pink-400">₹5,100</div>
                             <div className="text-sm text-pink-300">Budget</div>
                             <div className="h-1 bg-pink-700/30 rounded-full overflow-hidden">
                                 <div className="h-full w-1/2 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50"></div>
                             </div>
                         </div>
                         <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 border border-purple-500/40 rounded-lg p-6 space-y-4 shadow-lg shadow-purple-500/20">
                             <div className="text-3xl font-bold text-purple-400">12</div>
                             <div className="text-sm text-purple-300">Transactions</div>
                             <div className="h-1 bg-purple-700/30 rounded-full overflow-hidden">
                                 <div className="h-full w-2/3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
                             </div>
                         </div>
                         <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-500/40 rounded-lg p-6 space-y-4 mt-8 shadow-lg shadow-blue-500/20">
                             <div className="text-3xl font-bold text-blue-400">3</div>
                             <div className="text-sm text-blue-300">Categories</div>
                             <div className="h-1 bg-blue-700/30 rounded-full overflow-hidden">
                                 <div className="h-full w-1/4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                             </div>
                         </div>
                     </div>
                </div>

                {/* Features Section */}
                 <div className="mt-24">
                     <div className="text-center mb-16">
                         <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                             Simple & Powerful
                         </h2>
                         <p className="text-lg text-purple-300">Everything you need to manage expenses</p>
                     </div>
                     <div className="grid md:grid-cols-3 gap-8">
                         <div className="bg-black/40 border border-cyan-500/40 rounded-lg p-8 backdrop-blur-md shadow-lg shadow-cyan-500/20">
                             <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center mb-4">
                                 <TrendingUp className="w-6 h-6 text-cyan-400" />
                             </div>
                             <h3 className="text-lg font-semibold text-cyan-300 mb-2">Track Instantly</h3>
                             <p className="text-cyan-400/60">Add expenses in seconds with a clean, intuitive interface</p>
                         </div>
                         <div className="bg-black/40 border border-purple-500/40 rounded-lg p-8 backdrop-blur-md shadow-lg shadow-purple-500/20">
                             <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center mb-4">
                                 <TrendingUp className="w-6 h-6 text-purple-400" />
                             </div>
                             <h3 className="text-lg font-semibold text-purple-300 mb-2">See Insights</h3>
                             <p className="text-purple-400/60">Understand your spending with visual analytics</p>
                         </div>
                         <div className="bg-black/40 border border-pink-500/40 rounded-lg p-8 backdrop-blur-md shadow-lg shadow-pink-500/20">
                             <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/30 rounded-lg flex items-center justify-center mb-4">
                                 <TrendingUp className="w-6 h-6 text-pink-400" />
                             </div>
                             <h3 className="text-lg font-semibold text-pink-300 mb-2">Stay in Control</h3>
                             <p className="text-pink-400/60">Set budgets and manage your finances wisely</p>
                         </div>
                     </div>
                 </div>

                {/* CTA Section */}
                 <div className="mt-24 text-center">
                     <div className="bg-gradient-to-r from-purple-700/20 to-pink-700/20 border border-purple-500/40 rounded-lg p-12 backdrop-blur-md shadow-lg shadow-purple-500/30">
                         <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">Ready to get started?</h2>
                         <p className="text-purple-300 mb-8">Join thousands tracking their expenses smartly</p>
                         <Link
                           href="/register"
                           className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/50"
                         >
                             Create Your Account
                         </Link>
                     </div>
                 </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-purple-500/30 mt-20">
                 <div className="max-w-6xl mx-auto px-6 py-8 text-center text-purple-400 text-sm">
                     <p>© 2025 Expense Tracker. Built with Next.js and Tailwind CSS.</p>
                 </div>
                </footer>
        </div>
    );
}
