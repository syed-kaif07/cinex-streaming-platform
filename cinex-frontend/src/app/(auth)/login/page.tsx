'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = await login(email, password)
    if (success) {
      router.push('/home')
    } else {
      setError('Sorry, we can\'t find an account with this email address. Please try again or create a new account.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-[400px] bg-black/80 rounded-lg px-12 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[#E87C03] text-white text-sm px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or phone number"
            required
            className="input-field"
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cinex-red hover:bg-cinex-red-hover disabled:opacity-70 text-white font-semibold py-3 rounded text-base transition-colors duration-200 mt-6"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center justify-between mt-4 text-sm">
        <label className="flex items-center gap-2 text-[#b3b3b3] cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-cinex-red"
          />
          Remember me
        </label>
        <a href="#" className="text-[#b3b3b3] hover:underline">Need help?</a>
      </div>

      <div className="mt-10 text-[#b3b3b3]">
        <p>
          New to CineX?{' '}
          <Link href="/signup" className="text-white hover:underline">
            Sign up now
          </Link>
        </p>
        <p className="mt-3 text-sm text-[#8c8c8c]">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
          <a href="#" className="text-[#0071eb] hover:underline">Learn more.</a>
        </p>
      </div>
    </div>
  )
}
