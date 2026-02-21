'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Movie, Genre } from '@/types'
import { discoverMovies, discoverTV, searchMulti, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb'
import MovieModal from '@/components/ui/MovieModal'

interface BrowseClientProps {
  allGenres: Genre[]
}

type Category = 'all' | 'movie' | 'tv'

export default function BrowseClient({ allGenres }: BrowseClientProps) {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const initialCategory = (searchParams.get('category') as Category) || 'all'

  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const fetchMovies = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        sort_by: 'popularity.desc',
      }
      if (selectedGenre) params.with_genres = selectedGenre

      let results: Movie[] = []
      let total = 1

      if (searchQuery) {
        const data = await searchMulti(searchQuery, page.toString())
        results = data.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv')
        total = data.total_pages
      } else if (selectedCategory === 'tv') {
        const data = await discoverTV(params)
        results = data.results.map(r => ({ ...r, media_type: 'tv' as const }))
        total = data.total_pages
      } else if (selectedCategory === 'movie') {
        const data = await discoverMovies(params)
        results = data.results.map(r => ({ ...r, media_type: 'movie' as const }))
        total = data.total_pages
      } else {
        const [moviesData, tvData] = await Promise.all([
          discoverMovies(params),
          discoverTV(params),
        ])
        results = [
          ...moviesData.results.map(r => ({ ...r, media_type: 'movie' as const })),
          ...tvData.results.map(r => ({ ...r, media_type: 'tv' as const })),
        ].sort((a, b) => b.popularity - a.popularity)
        total = Math.max(moviesData.total_pages, tvData.total_pages)
      }

      setMovies(results)
      setTotalPages(Math.min(total, 20))
    } catch (err) {
      console.error('Failed to fetch movies', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedGenre, searchQuery, page])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat)
    setPage(1)
    setSearchQuery('')
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-cinex-black pt-24 pb-16">
      {/* Header */}
      <div className="px-6 md:px-16 mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Browse</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded px-4 py-2 gap-2 flex-1 min-w-64 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#777]">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              placeholder="Search titles, people..."
              className="bg-transparent text-white flex-1 outline-none text-sm placeholder-[#777]"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setPage(1) }} className="text-[#777] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex bg-[#1a1a1a] border border-[#333] rounded overflow-hidden">
            {(['all', 'movie', 'tv'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cinex-red text-white'
                    : 'text-[#b3b3b3] hover:text-white hover:bg-[#333]'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'tv' ? 'TV Shows' : 'Movies'}
              </button>
            ))}
          </div>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
            className="bg-[#1a1a1a] border border-[#333] text-[#b3b3b3] rounded px-4 py-2 text-sm outline-none cursor-pointer hover:border-white transition-colors"
          >
            <option value="">All Genres</option>
            {allGenres.map((g) => (
              <option key={g.id} value={g.id.toString()}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="px-6 md:px-16 mb-4">
          <p className="text-[#777] text-sm">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Showing popular titles'}
            {' '}· Page {page} of {totalPages}
          </p>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-cinex-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 text-[#555] mb-4">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p className="text-white text-xl font-semibold mb-2">No results found</p>
          <p className="text-[#777]">Try a different search or change your filters.</p>
        </div>
      ) : (
        <div className="px-6 md:px-16">
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {movies.map((movie) => (
              <BrowseCard key={`${movie.id}-${movie.media_type}`} movie={movie} onClick={() => setSelectedMovie(movie)} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12 px-6">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === 1}
            className="px-5 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded disabled:opacity-40 hover:bg-[#333] transition-colors text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 6, page - 3)) + i
              return (
                <button
                  key={pageNum}
                  onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                    pageNum === page
                      ? 'bg-cinex-red text-white'
                      : 'bg-[#1a1a1a] border border-[#333] text-[#b3b3b3] hover:bg-[#333] hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={page === totalPages}
            className="px-5 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded disabled:opacity-40 hover:bg-[#333] transition-colors text-sm flex items-center gap-2"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  )
}

function BrowseCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  const [imgError, setImgError] = useState(false)
  const title = getTitle(movie)

  return (
    <div
      className="movie-card bg-cinex-card cursor-pointer"
      onClick={onClick}
      style={{ width: '100%', height: '300px' }}
    >
      <div className="relative w-full h-full group">
        {movie.poster_path && !imgError ? (
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
            <p className="text-[#888] text-xs text-center px-3">{title}</p>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
          <span className="text-green-400 text-xs font-bold">{Math.round(movie.vote_average * 10)}%</span>
          <h3 className="text-white text-xs font-semibold mt-1 line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#b3b3b3] text-xs">{getReleaseYear(movie)}</span>
            <span className="text-[#777] text-xs capitalize">
              {movie.media_type === 'tv' ? '📺 TV' : '🎬 Movie'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
