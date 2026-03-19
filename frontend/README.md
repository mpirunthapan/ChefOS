# 🍳 ChefOS Frontend

React + Tailwind CSS v4 frontend for ChefOS — the AI-powered recipe maker.

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Tailwind CSS v4** — Styling via `@tailwindcss/vite`
- **React Router v6** — Client-side routing
- **Clerk** — User authentication (login, signup, user management)
- **Axios** — HTTP API requests
- **Vite** — Build tool and dev server

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── Home.jsx            # Ingredient input + Find Recipes
│   │   ├── Suggestions.jsx     # AI dish option cards
│   │   ├── RecipeDetail.jsx    # Step-by-step recipe with progress
│   │   └── History.jsx         # Past recipe sessions
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with Clerk auth buttons
│   │   └── ProtectedRoute.jsx  # Redirects unauthenticated users
│   ├── context/
│   │   ├── RecipeContext.jsx   # Global state (ingredients, dishes, recipe)
│   │   └── useRecipe.js        # Custom hook to access RecipeContext
│   ├── services/
│   │   └── api.js              # All Axios API calls to backend
│   ├── App.jsx                 # Routes definition
│   ├── main.jsx                # App entry point with providers
│   └── index.css               # Tailwind import
├── vercel.json                 # Vercel SPA routing fix
├── vite.config.js              # Vite + Tailwind plugin config
├── package.json
└── .env                        # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
```

Get your Clerk publishable key from [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys.

### Run development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build for production

```bash
npm run build
```

---

## 🔐 Authentication (Clerk)

ChefOS uses [Clerk](https://clerk.com) for authentication. The setup includes:

- `ClerkProvider` wraps the entire app in `main.jsx`
- `SignInButton` and `SignUpButton` in the Navbar open modal dialogs
- `UserButton` shows the logged-in user avatar with sign-out option
- `ProtectedRoute` component guards `/suggestions`, `/recipe`, and `/history`
- `useAuth()` hook provides `isSignedIn` and `userId` throughout the app

### Clerk Environment Variables

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | From Clerk dashboard → API Keys |

---

## 📄 Pages

### Home (`/`)
- Text input to add ingredients one by one
- Ingredients shown as removable orange chip tags
- Click **Find Recipes** to call the backend API
- Shows loading state and error messages

### Suggestions (`/suggestions`) — Protected
- Grid of 4-5 dish cards returned by AI
- Each card shows name, difficulty badge (Easy/Medium/Hard), cook time, description
- Click any card to fetch the full recipe

### Recipe Detail (`/recipe`) — Protected
- Full recipe with dish name and ingredient tags
- Numbered steps with clickable checkboxes — completed steps get strikethrough
- Tips panel with AI-generated cooking tips
- Collapsible Add-ons & Substitutes section
- Sticky progress bar at the bottom showing steps completed

### History (`/history`) — Protected
- Lists all past recipe sessions from MongoDB
- Shows date, ingredients used, and dish selected

---

## 🌍 Deployment (Vercel)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Framework preset: **Vite** (auto-detected)
4. Add environment variables in Vercel dashboard:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://your-render-backend.onrender.com/api` |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_...` |

5. Deploy

The `vercel.json` file handles React Router redirects so refreshing any route (e.g. `/recipe`) returns the app instead of a 404.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🎨 Design System

- **Background:** `#111111` dark theme
- **Accent:** Orange (`orange-400`) for buttons, highlights, active states
- **Text:** White with varying opacity (`white/50`, `white/80`)
- **Cards:** `white/5` background with `white/10` border
- **Difficulty badges:** Green (Easy), Yellow (Medium), Red (Hard)
- **Font:** System default via Tailwind