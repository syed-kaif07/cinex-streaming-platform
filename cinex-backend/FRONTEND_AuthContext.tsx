/**
 * cinex-frontend/src/context/AuthContext.tsx  (UPDATED — Real Backend Version)
 *
 * Replace your existing AuthContext.tsx with this file.
 * It uses the real CineX backend API instead of localStorage mock auth.
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  watchlist: WatchlistItem[]
}

interface WatchlistItem {
  mediaId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  addedAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)  // true while checking session

  // On mount — check if the user has a valid session cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await authApi.me()
        if (res.success && res.data) {
          setUser((res.data as { user: User }).user)
        }
      } catch {
        // No valid session — stay logged out
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    if (res.success && res.data) {
      setUser((res.data as { user: User }).user)
      return { success: true, message: res.message }
    }
    return { success: false, message: res.message || 'Login failed.' }
  }

  const signup = async (name: string, email: string, password: string) => {
    const res = await authApi.signup(name, email, password)
    if (res.success && res.data) {
      setUser((res.data as { user: User }).user)
      return { success: true, message: res.message }
    }
    return { success: false, message: res.message || 'Signup failed.' }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
