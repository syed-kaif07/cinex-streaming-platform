'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Movie } from '@/types'
import { getImageUrl, getTitle } from '@/lib/tmdb'

interface HeroBannerProps {
  movies: Movie[]
  onPlay?: (movie: Movie) => void
  onMoreInfo?: (movie: Movie) => void
}

export default function HeroBanner({ movies, onPlay, onMoreInfo }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featured = movies[currentIndex]

  useEffect(() => {
    if (!movies.length) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5))
    }, 8000)
    return () => clearInterval(interval)
  }, [movies.length])

  if (!featured) return null

  const title = getTitle(featured)

  return (
    <div className="relative w-full" style={{ height: '70vh', minHeight: '500px' }}>
      {/* Background Image */}
      {featured.backdrop_path ? (
        <Image
          src={getImageUrl(featured.backdrop_path, 'original')}
          alt={title}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#141414]" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cinex-black to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 px-6 md:px-16 max-w-2xl animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="text-[#e5e5e5] text-sm md:text-base mb-6 line-clamp-3 drop-shadow">
          {featured.overview}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-6 text-sm">
          <span className="text-green-400 font-bold">
            {Math.round(featured.vote_average * 10)}% Match
          </span>
          <span className="text-[#ddd]">
            {featured.release_date?.split('-')[0] || featured.first_air_date?.split('-')[0]}
          </span>
          <span className="border border-[#aaa] text-[#ddd] px-1 text-xs">HD</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onPlay?.(featured)}
            className="btn-primary text-black bg-white hover:bg-[#ccc] text-sm md:text-base font-bold px-6 py-2 md:px-8 md:py-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Play
          </button>
          <button
            onClick={() => onMoreInfo?.(featured)}
            className="btn-secondary text-sm md:text-base font-semibold px-5 py-2 md:px-7 md:py-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            More Info
          </button>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 right-6 md:right-16 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white w-6' : 'bg-white/40'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
