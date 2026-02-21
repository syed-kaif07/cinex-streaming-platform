'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Movie } from '@/types'
import { getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb'

interface MovieCardProps {
  movie: Movie
  onClick?: (movie: Movie) => void
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const title = getTitle(movie)

  return (
    <div
      className="movie-card bg-cinex-card group"
      onClick={() => onClick?.(movie)}
      title={title}
    >
      {/* Poster Image */}
      <div className="relative w-full h-full">
        {movie.poster_path && !imageError ? (
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={title}
            fill
            className="object-cover"
            sizes="200px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#2a2a2a] p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-[#555] mb-3">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <p className="text-[#888] text-xs text-center leading-tight">{title}</p>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
          {/* Rating Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-xs font-bold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
          </div>
          <h3 className="text-white text-xs font-semibold leading-tight line-clamp-2">{title}</h3>
          <p className="text-[#b3b3b3] text-xs mt-1">{getReleaseYear(movie)}</p>

          {/* Action buttons */}
          <div className="flex gap-2 mt-2">
            <button
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-[#ccc] transition-colors"
              onClick={(e) => { e.stopPropagation(); onClick?.(movie) }}
              aria-label="Play"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-3 h-3">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </button>
            <button
              className="w-7 h-7 border border-white/50 rounded-full flex items-center justify-center hover:border-white transition-colors text-white"
              aria-label="Add to list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
