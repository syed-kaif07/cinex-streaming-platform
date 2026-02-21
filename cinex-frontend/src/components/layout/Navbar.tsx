'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CineXLogo from '@/components/ui/CineXLogo'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/landing')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-4 transition-all duration-500 ${
        scrolled ? 'bg-cinex-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-8">
        <CineXLogo size="md" href="/home" />
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#e5e5e5]">
          <Link href="/home" className="hover:text-white transition-colors">Home</Link>
          <Link href="/browse?category=tv" className="hover:text-white transition-colors">TV Shows</Link>
          <Link href="/browse?category=movie" className="hover:text-white transition-colors">Movies</Link>
          <Link href="/browse?category=new" className="hover:text-white transition-colors">New & Popular</Link>
          <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
        </div>
      </div>

      {/* Right: Search + Profile */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="flex items-center">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center border border-white bg-black/80 px-3 py-1 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white mr-2 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm outline-none w-48 placeholder-[#999]"
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-white hover:text-[#ccc] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1 group"
          >
            <div className="w-8 h-8 bg-cinex-red rounded flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-3 h-3 text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 bg-black/95 border border-[#333] rounded shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-[#333]">
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-[#b3b3b3] text-xs">{user?.email}</p>
              </div>
              <Link href="/home" className="flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white text-sm transition-colors" onClick={() => setProfileOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </Link>
              <Link href="/browse" className="flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white text-sm transition-colors" onClick={() => setProfileOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                Browse
              </Link>
              <div className="border-t border-[#333] mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-[#b3b3b3] hover:text-white text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign out of CineX
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
