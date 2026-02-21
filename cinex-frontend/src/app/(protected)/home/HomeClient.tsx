'use client'

import { useState } from 'react'
import { Movie } from '@/types'
import HeroBanner from '@/components/sections/HeroBanner'
import MovieRow from '@/components/sections/MovieRow'
import MovieModal from '@/components/ui/MovieModal'

interface HomeClientProps {
  trending: Movie[]
  popular: Movie[]
  topRated: Movie[]
  tvShows: Movie[]
  nowPlaying: Movie[]
}

export default function HomeClient({ trending, popular, topRated, tvShows, nowPlaying }: HomeClientProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie)
  const handleClose = () => setSelectedMovie(null)

  return (
    <div className="bg-cinex-black">
      {/* Hero Banner */}
      {trending.length > 0 && (
        <HeroBanner
          movies={trending}
          onPlay={handleMovieClick}
          onMoreInfo={handleMovieClick}
        />
      )}

      {/* Movie Rows */}
      <div className="py-8 -mt-16 relative z-10">
        <MovieRow title="Trending Now" movies={trending} onMovieClick={handleMovieClick} />
        <MovieRow title="Now Playing" movies={nowPlaying} onMovieClick={handleMovieClick} />
        <MovieRow title="Popular on CineX" movies={popular} onMovieClick={handleMovieClick} />
        <MovieRow title="Top Rated" movies={topRated} onMovieClick={handleMovieClick} />
        <MovieRow title="TV Shows" movies={tvShows} onMovieClick={handleMovieClick} />
      </div>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
    </div>
  )
}
