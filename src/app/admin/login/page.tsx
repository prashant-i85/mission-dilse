'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
      } else {
        router.refresh()
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-charcoal-900 to-brand-charcoal-800 p-4">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-80 h-80 rounded-full bg-brand-orange-600 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-brand-amber-600 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Card wrapper */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-3xl bg-brand-orange-500/10 border border-brand-orange-500/20 text-brand-orange-500 mb-4">
              <Heart className="h-8 w-8 fill-brand-orange-500 stroke-brand-orange-500" />
            </div>
            <h1 className="text-3xl font-bold font-display text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-brand-charcoal-100/60 text-sm mt-2">
              Sign in to manage Mission Dilse NGO content
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-200 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-charcoal-100/40">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 transition-all text-sm"
                  placeholder="admin@missiondilse.org"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-charcoal-100/40">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 focus:ring-1 focus:ring-brand-orange-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-brand-orange-600 hover:bg-brand-orange-700 disabled:bg-brand-orange-600/50 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
