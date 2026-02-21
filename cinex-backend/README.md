# CineX Backend API 🎬

Secure REST API for CineX — built with **Node.js + Express + MongoDB + JWT**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB (via Mongoose) |
| Auth | JWT in HTTP-only cookie |
| Hashing | bcryptjs (salt rounds: 12) |
| Validation | express-validator |
| Security | helmet, cors, express-rate-limit |

---

## Folder Structure

```
cinex-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # signup, login, logout, getMe
│   │   └── userController.js      # profile, watchlist CRUD
│   ├── middleware/
│   │   ├── auth.js                # protect — JWT verification
│   │   ├── validate.js            # express-validator rules + runner
│   │   └── errorHandler.js        # global error + 404 handler
│   ├── models/
│   │   └── User.js                # Mongoose schema + bcrypt hook
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   └── user.js                # /api/user/* (all protected)
│   ├── utils/
│   │   ├── jwt.js                 # signToken, verifyToken, cookie helpers
│   │   └── response.js            # sendSuccess / sendError helpers
│   ├── app.js                     # Express app setup (middleware, routes)
│   └── index.js                   # Server entry point + graceful shutdown
├── FRONTEND_API_CLIENT.ts         # Drop into frontend: src/lib/api.ts
├── FRONTEND_AuthContext.tsx       # Drop into frontend: src/context/AuthContext.tsx
├── .env.example
└── package.json
```

---

## Setup & Run

### 1. Install dependencies
```bash
cd cinex-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cinex
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRES_IN=7d
COOKIE_SECURE=false
CLIENT_URL=http://localhost:3000
```

### 3. Start the server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## API Reference

### Auth Routes (`/api/auth`) — Public

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | `{ name, email, password }` | Register new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Sign in |
| `POST` | `/api/auth/logout` | — | Clear session cookie |
| `GET` | `/api/auth/me` | — | Get current user *(protected)* |

### User Routes (`/api/user`) — All Protected

| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/user/profile` | — | Get user profile |
| `PATCH` | `/api/user/profile` | `{ name }` | Update name |
| `GET` | `/api/user/watchlist` | — | Get watchlist |
| `POST` | `/api/user/watchlist` | `{ mediaId, mediaType, title, posterPath? }` | Add to watchlist |
| `DELETE` | `/api/user/watchlist/:mediaId` | `?mediaType=movie\|tv` | Remove from watchlist |

### Health Check
```
GET /api/health
```

---

## Authentication Flow

```
SIGNUP
  Client → POST /api/auth/signup { name, email, password }
         → Validate input (express-validator)
         → Hash password (bcrypt, 12 rounds)
         → Save User to MongoDB
         → Sign JWT (7-day expiry)
         → Set HTTP-only cookie: cinex_token
         → Return { user, token }

LOGIN
  Client → POST /api/auth/login { email, password }
         → Find user by email
         → bcrypt.compare(candidatePassword, storedHash)
         → Sign new JWT
         → Set HTTP-only cookie: cinex_token
         → Return { user, token }

PROTECTED REQUEST
  Client → Any /api/user/* request (cookie sent automatically)
         → protect middleware reads cinex_token cookie
         → jwt.verify(token, JWT_SECRET)
         → Load user from DB (fresh check)
         → Attach to req.user
         → Continue to controller
```

---

## Security Checklist ✅

- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] JWT stored in HTTP-only cookie (not accessible via JS)
- [x] JWT expiration (7 days, configurable)
- [x] Input validation and sanitization on all routes
- [x] Generic auth error messages (no email enumeration)
- [x] Rate limiting — 20 req/15min on auth, 200 req/15min on API
- [x] Security headers via Helmet
- [x] CORS restricted to frontend origin
- [x] Body size capped at 10kb
- [x] No stack traces exposed to clients in production
- [x] Graceful shutdown + unhandled rejection guard

---

## Connecting to the Frontend

### Step 1 — Add env variable to CineX frontend
In `cinex-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 2 — Copy provided files
```
FRONTEND_API_CLIENT.ts   →  cinex-frontend/src/lib/api.ts
FRONTEND_AuthContext.tsx →  cinex-frontend/src/context/AuthContext.tsx
```

### Step 3 — Update signup call in frontend
The real backend requires `name` in signup. Update `src/app/(auth)/signup/page.tsx`:
```ts
// Before (mock):
await signup(email, password, name)

// After (real backend):
await signup(name, email, password)
```

That's it — the auth cookie is handled automatically by the browser on every request.

---

## Running Both Together

```bash
# Terminal 1 — Backend
cd cinex-backend && npm run dev

# Terminal 2 — Frontend
cd cinex && npm run dev
```

Visit `http://localhost:3000` — all auth now flows through the real backend.
