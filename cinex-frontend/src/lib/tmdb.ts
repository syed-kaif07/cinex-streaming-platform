import { Movie, TMDBResponse, MovieDetails, Genre } from '@/types'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
export const IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original'

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.append('api_key', API_KEY || '')
  url.searchParams.append('language', 'en-US')
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getTrending(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/trending/all/week')
  return data.results
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/popular')
  return data.results
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/top_rated')
  return data.results
}

export async function getPopularTVShows(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/tv/popular')
  return data.results
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await fetchTMDB<TMDBResponse<Movie>>('/movie/now_playing')
  return data.results
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/movie/${id}`)
}

export async function getTVDetails(id: number): Promise<MovieDetails> {
  return fetchTMDB<MovieDetails>(`/tv/${id}`)
}

export async function searchMulti(query: string, page = '1'): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>('/search/multi', { query, page })
}

export async function discoverMovies(params: Record<string, string> = {}): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>('/discover/movie', params)
}

export async function discoverTV(params: Record<string, string> = {}): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>('/discover/tv', params)
}

export async function getMovieGenres(): Promise<Genre[]> {
  const data = await fetchTMDB<{ genres: Genre[] }>('/genre/movie/list')
  return data.genres
}

export async function getTVGenres(): Promise<Genre[]> {
  const data = await fetchTMDB<{ genres: Genre[] }>('/genre/tv/list')
  return data.genres
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getTitle(item: Movie): string {
  return item.title || item.name || 'Untitled'
}

export function getReleaseYear(item: Movie): string {
  const date = item.release_date || item.first_air_date
  if (!date) return ''
  return new Date(date).getFullYear().toString()
}
