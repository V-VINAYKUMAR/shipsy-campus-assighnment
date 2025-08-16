'use client';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function Header() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setSession(data.user);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Campus — Expenses
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">Manage your expenses with ease</p>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center space-x-2">
          {loading ? (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : session ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300">
                <span>Welcome,</span>
                <span className="font-medium text-white">{session.username}</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          ) : (
            <>
              <a href="/login" className="nav-link text-sm">Login</a>
              <a href="/register" className="btn btn-primary text-sm">Get Started</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
