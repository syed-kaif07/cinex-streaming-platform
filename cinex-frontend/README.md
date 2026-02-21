# CineX 🎬

A Netflix-style streaming frontend replica built with Next.js 14 (App Router) and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Movie Data**: TMDB API v3
- **Language**: TypeScript

## Project Structure

```
cinex/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── landing/          # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/            # Login page
│   │   │   └── signup/           # Signup page
│   │   ├── (protected)/
│   │   │   ├── home/             # Home page (protected)
│   │   │   └── browse/           # Browse page (protected)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── not-found.tsx         # 404 page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CineXLogo.tsx     # Logo component
│   │   │   └── MovieModal.tsx    # Movie detail modal
│   │   ├── layout/
│   │   │   └── Navbar.tsx        # Sticky navbar
│   │   ├── cards/
│   │   │   └── MovieCard.tsx     # 200x300px movie card
│   │   └── sections/
│   │       ├── HeroBanner.tsx    # 70vh hero section
│   │       └── MovieRow.tsx      # Horizontal scroll row
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state (mock)
│   ├── hooks/
│   │   └── useMovies.ts          # Custom hooks
│   ├── lib/
│   │   └── tmdb.ts               # TMDB API utilities
│   └── types/
│       └── index.ts              # TypeScript types
├── .env.example
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your TMDB API key:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

Get your free API key from [TMDB](https://www.themoviedb.org/settings/api).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication (Mock)

CineX uses **mock authentication** for the frontend phase:
- Sign up or log in with **any email** and a **password with 6+ characters**
- Session is stored in `localStorage`
- Protected routes (`/home`, `/browse`) redirect unauthenticated users to `/login`

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `cinex-black` | `#000000` | Primary background |
| `cinex-surface` | `#141414` | Secondary surface |
| `cinex-card` | `#181818` | Card background |
| `cinex-red` | `#E50914` | Accent / CTAs |
| `cinex-red-hover` | `#F40612` | Hover state |
| `cinex-text` | `#FFFFFF` | Primary text |
| `cinex-muted` | `#B3B3B3` | Secondary text |
| `cinex-border` | `#333333` | Borders |

## Pages

| Route | Route Group | Auth Required |
|-------|------------|---------------|
| `/landing` | `(public)` | No |
| `/login` | `(auth)` | No |
| `/signup` | `(auth)` | No |
| `/home` | `(protected)` | Yes |
| `/browse` | `(protected)` | Yes |

## Build for Production

```bash
npm run build
npm start
```
