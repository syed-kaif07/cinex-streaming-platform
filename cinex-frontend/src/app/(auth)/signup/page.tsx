'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function SignupForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      return
    }
    if (password.length < 6) {
      setError('Your password must contain at least 6 characters.')
      return
    }

    setLoading(true)
    const success = await signup(email, password, name || email.split('@')[0])
    if (success) {
      router.push('/home')
    } else {
      setError('Failed to create account. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-[400px] bg-black/80 rounded-lg px-12 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-[#b3b3b3] mb-6 text-sm">Join CineX and start watching today.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[#E87C03] text-white text-sm px-4 py-3 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="input-field"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="input-field"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 6 characters)"
          required
          className="input-field"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          required
          className="input-field"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cinex-red hover:bg-cinex-red-hover disabled:opacity-70 text-white font-semibold py-3 rounded text-base transition-colors duration-200 mt-6"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 text-[#b3b3b3] text-sm">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-4 text-[#8c8c8c] text-xs leading-relaxed">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-[#0071eb] hover:underline">Terms of Use</a>
          {' '}and{' '}
          <a href="#" className="text-[#0071eb] hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
}
