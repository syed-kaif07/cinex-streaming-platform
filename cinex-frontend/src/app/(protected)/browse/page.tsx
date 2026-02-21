import { Suspense } from 'react'
import BrowseClient from './BrowseClient'
import { getMovieGenres, getTVGenres } from '@/lib/tmdb'

export default async function BrowsePage() {
  const [movieGenres, tvGenres] = await Promise.all([
    getMovieGenres().catch(() => []),
    getTVGenres().catch(() => []),
  ])

  const allGenres = [...new Map([...movieGenres, ...tvGenres].map(g => [g.id, g])).values()]
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cinex-black flex items-center justify-center">
        <div className="text-cinex-red text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    }>
      <BrowseClient allGenres={allGenres} />
    </Suspense>
  )
}
