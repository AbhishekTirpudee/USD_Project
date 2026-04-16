# 🍿 Modern Netflix Clone 

A beautiful, high-performance Netflix-inspired streaming platform built from the ground up using **React 19**, **Vite**, **Express**, **tRPC**, and **MySQL (via Drizzle ORM)**.

![Hero Showcase](public/posters/cyberpunk_poster_1776279053152.png)

## ✨ Core Features
*   **Dual API Modes (TMDB or AI Fallback)**: Enter a valid TMDB API key to fetch live, real-time movie/show data across the globe. Left it blank? The system automatically falls back to an internal **Mock AI Data Generator** providing beautiful, high-resolution AI-generated movie posters (e.g. *Neon Horizons*, *Echoes in the Ice*) natively so the UI always looks perfectly populated.
*   **End-to-End Type Safety**: Driven by **tRPC**, ensuring absolute parity between the backend routers and frontend react-query calls.
*   **Fluid Interface UI Elements**: Fully styled with **Tailwind CSS 4** and micro-animated using **Framer Motion**.
*   **Authentication Flow**: Internal OAuth integration mounted dynamically on the backend.
*   **Modern Database ORM**: Powered by **Drizzle + MySQL 8.0**, tracking user profiles, watchlists, and continue-watching metrics.

---

## 🛠 Tech Stack Overview

| Category        | Technologies                                                                                       |
|-----------------|--------------------------------------------------------------------------------------------------|
| **Frontend**    | React 19, Vite, Tailwind CSS 4.0, Framer Motion, Radix UI Primitives, wouter (Routing)             |
| **Backend**     | Node.js, Express.js, tRPC (`@trpc/server`)                                                        |
| **Database**    | MySQL 8.0, Drizzle ORM (`drizzle-kit` for schema push)                                             |
| **Data Fetch.** | `@tanstack/react-query`, Axios, TMDB API Integration                                               |
| **Tooling**     | TypeScript, `pnpm`, `cross-env` for Native Windows Support                                         |

---

## 🚀 Getting Started (Windows & Mac)

Follow these instructions perfectly to get your application running locally.

### 1. Requirements
*   **Node.js 18+** installed.
*   **pnpm** package manager installed (`npm install -g pnpm`).
*   **MySQL Server** running locally (e.g., MySQL 8.0, XAMPP, TiDB).

### 2. Environment Configuration
Create a `.env` file in the root directory by duplicating the placeholder settings:

```ini
# --- Database Configuration ---
# IMPORTANT: Replace YOUR_PASSWORD with your actual MySQL password.
# IMPORTANT: If your password contains the % character, you MUST type it as %25 (e.g., pass%123 -> pass%25123)
DATABASE_URL=mysql://root:YOUR_PASSWORD@localhost:3306/netflix_db

# --- TMDB API ---
# Get your API key from https://www.themoviedb.org/settings/api
# If you leave this as 'your_tmdb_api_key_here', the app will auto-inject 10 AI-generated fallback movies!
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# --- Authentication Configuration ---
JWT_SECRET=netflix_clone_super_secret_key_2026
VITE_APP_ID=manus_app
OAUTH_SERVER_URL=http://localhost:3000
VITE_OAUTH_PORTAL_URL=http://localhost:3000/login
```

### 3. Database Initialization
Before pushing the schema, ensure you create a blank database locally using your MySQL CLI natively:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS netflix_db;"
```

Then, generate and push the Drizzle SQL schema (Users, Watchlist, Continue Watching tables):
```bash
pnpm install
pnpm db:push
```

### 4. Running the Dev Server
The development script handles **both** the backend Express server and the Vite Hot-Reloading frontend. Thanks to `cross-env`, this works flawlessly in Windows PowerShell!

```bash
pnpm run dev
```

Browse to `http://localhost:3000/` and enjoy!

---

## 📁 Project Architecture & Layout

```text
netflix-clone/
├── client/                     # Frontend Application
│   ├── public/                 # Static Assets 
│   │   └── posters/            # Custom AI-Generated Fallback Posters
│   └── src/        
│       ├── components/         # HeroBanner, MovieCard, Skeleton, Nav
│       ├── pages/              # Routing Views
│       ├── App.tsx             # Main React Injector
│       └── main.tsx            # DOM Render Entry
│
├── server/                     # Backend Application
│   ├── _core/                  # Express Setup, auth & Context binding
│   ├── routers.ts              # Master tRPC router table
│   ├── routers-content.ts      # Watchlist logic & TMDB bindings
│   └── tmdb.ts                 # External proxy & Fallback Mock AI Engine
│
├── drizzle/                    # Database Infrastructure
│   ├── schema.ts               # Core database tables configuration
│   └── meta/                   # Migration snapshsot logs
│
├── .env                        # Connection secrets
├── package.json                # Workspaces & script tasks
└── drizzle.config.ts           # Drizzle execution config mapping
```

## ⚠️ Known Limitations
* **Local Auth Mocking**: By default, the application runs on a mock OAuth service. Users will click 'login', bypassing physical password storage, storing their openId in `lastSignedIn` via Drizzle.
* **Placeholder Video Player**: Clicking "Play" routes into player components without real CDN video streams (as expected for OTT clones). 

---
*Developed with modern web-design architecture prioritizing type-checking, edge-animations, and fast runtime rendering.*
