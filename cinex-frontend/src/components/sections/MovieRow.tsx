'use client'

import { useRef } from 'react'
import { Movie } from '@/types'
import MovieCard from '@/components/cards/MovieCard'

interface MovieRowProps {
  title: string
  movies: Movie[]
  onMovieClick?: (movie: Movie) => void
}

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return
    const scrollAmount = 640
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!movies.length) return null

  return (
    <div className="mb-8 group/row">
      <h2 className="text-white text-xl font-semibold mb-3 px-6 md:px-16">{title}</h2>
      <div className="relative px-6 md:px-16">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 flex items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:from-black"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-white">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          className="row-scroll"
          style={{ overflowX: 'auto' }}
        >
          {movies.map((movie) => (
            <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} onClick={onMovieClick} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 flex items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 hover:from-black"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-white">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
