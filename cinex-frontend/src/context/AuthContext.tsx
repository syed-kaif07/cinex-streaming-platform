'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_USER: User = {
  id: '1',
  email: 'user@cinex.com',
  name: 'CineX User',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cinex_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('cinex_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - accepts any valid email/password combo
    if (email && password.length >= 6) {
      const loggedUser: User = { ...MOCK_USER, email, name: email.split('@')[0] }
      setUser(loggedUser)
      localStorage.setItem('cinex_user', JSON.stringify(loggedUser))
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    if (email && password.length >= 6 && name) {
      const newUser: User = { id: Date.now().toString(), email, name }
      setUser(newUser)
      localStorage.setItem('cinex_user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cinex_user')
  }

  if (isLoading) return null

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
