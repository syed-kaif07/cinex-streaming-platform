'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Movie } from '@/types'
import { getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb'

interface MovieModalProps {
  movie: Movie | null
  onClose: () => void
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [movie])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!movie) return null

  const title = getTitle(movie)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        <div className="relative w-full" style={{ height: '360px' }}>
          {movie.backdrop_path ? (
            <Image
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
              sizes="672px"
            />
          ) : movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
              sizes="672px"
            />
          ) : (
            <div className="w-full h-full bg-[#2a2a2a] rounded-t-lg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent rounded-t-lg" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center text-white hover:bg-[#333] transition-colors z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-black text-white mb-3">{title}</h2>
            <div className="flex items-center gap-3">
              <button className="btn-primary text-black bg-white hover:bg-[#ccc] font-bold px-6 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Play
              </button>
              <button className="w-10 h-10 border-2 border-white/70 rounded-full flex items-center justify-center hover:border-white transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button className="w-10 h-10 border-2 border-white/70 rounded-full flex items-center justify-center hover:border-white transition-colors text-white" aria-label="Like">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4 text-sm">
              <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
              <span className="text-[#ddd]">{getReleaseYear(movie)}</span>
              <span className="border border-[#aaa] text-[#ddd] px-1 text-xs">HD</span>
            </div>
            <p className="text-[#d2d2d2] text-sm leading-relaxed">{movie.overview || 'No overview available.'}</p>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-[#777]">
              Rating: <span className="text-[#ddd]">⭐ {movie.vote_average.toFixed(1)}/10</span>
            </p>
            <p className="text-[#777]">
              Type: <span className="text-[#ddd] capitalize">{movie.media_type || (movie.title ? 'Movie' : 'TV Show')}</span>
            </p>
            <p className="text-[#777]">
              Popularity: <span className="text-[#ddd]">{Math.round(movie.popularity)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
