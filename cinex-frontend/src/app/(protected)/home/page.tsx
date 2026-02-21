import { getTrending, getPopularMovies, getTopRatedMovies, getPopularTVShows, getNowPlayingMovies } from '@/lib/tmdb'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const [trending, popular, topRated, tvShows, nowPlaying] = await Promise.all([
    getTrending().catch(() => []),
    getPopularMovies().catch(() => []),
    getTopRatedMovies().catch(() => []),
    getPopularTVShows().catch(() => []),
    getNowPlayingMovies().catch(() => []),
  ])

  return (
    <HomeClient
      trending={trending}
      popular={popular}
      topRated={topRated}
      tvShows={tvShows}
      nowPlaying={nowPlaying}
    />
  )
}
