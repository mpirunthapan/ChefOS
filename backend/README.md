# 🍳 ChefOS Backend

FastAPI + LangChain + Groq backend for ChefOS — the AI-powered recipe maker.

---

## 🛠️ Tech Stack

- **FastAPI** — High-performance web framework
- **LangChain** — LLM chain orchestration
- **Groq** — Ultra-fast openai/gpt-oss-120b inference
- **PyMongo** — MongoDB Atlas driver
- **MongoDB Atlas** — Cloud database for recipe sessions and users
- **SlowAPI** — Rate limiting middleware
- **python-dotenv** — Environment variable management
- **Uvicorn** — ASGI server

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── chains/
│   │   ├── suggest_chain.py    # AI chain: ingredients → dish suggestions
│   │   └── recipe_chain.py     # AI chain: dish name → full recipe
│   ├── db/
│   │   └── mongo.py            # MongoDB Atlas connection
│   ├── models/
│   │   └── recipe.py           # Pydantic request/response models
│   ├── routes/
│   │   └── recipe.py           # All API route handlers
│   ├── __init__.py
│   └── main.py                 # FastAPI app, CORS, middleware setup
├── .env                        # Environment variables (not committed)
├── requirements.txt
└── render.yaml
```

---

## 🚀 Getting Started

### Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Set up environment variables

Create a `.env` file in the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
DB_NAME=ChefOS
```

### Run development server

```bash
uvicorn app.main:app --reload
```

- API runs at `http://localhost:8000`
- Interactive Swagger docs at `http://localhost:8000/docs`
- ReDoc at `http://localhost:8000/redoc`

---

## 📡 API Endpoints

### `POST /api/suggest`
Get AI-generated dish suggestions based on available ingredients.

**Request body:**
```json
{
  "ingredients": ["chicken", "garlic", "tomato", "rice"],
  "user_id": "optional_clerk_user_id"
}
```

**Response:**
```json
{
  "session_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "dishes": [
    {
      "name": "Chicken Fried Rice",
      "difficulty": "Easy",
      "time": "25 mins",
      "description": "Quick stir-fried rice with chicken and vegetables"
    }
  ]
}
```

---

### `POST /api/recipe`
Get full step-by-step recipe for a selected dish.

**Request body:**
```json
{
  "dish_name": "Chicken Fried Rice",
  "ingredients": ["chicken", "garlic", "tomato", "rice"],
  "user_id": "optional_clerk_user_id"
}
```

**Response:**
```json
{
  "recipe": {
    "dish_name": "Chicken Fried Rice",
    "steps": [
      { "step_number": 1, "instruction": "Cook 2 cups of rice and let cool." },
      { "step_number": 2, "instruction": "Dice chicken into bite-size pieces." }
    ],
    "tips": [
      "Use day-old rice for best texture",
      "High heat gives the best wok char"
    ],
    "addons": [
      { "name": "Soy sauce", "description": "Adds deep umami flavour" },
      { "name": "Sesame oil", "description": "Drizzle at the end for aroma" }
    ]
  }
}
```

---

### `GET /api/history`
Get the 20 most recent completed recipe sessions.

**Response:**
```json
{
  "history": [
    {
      "ingredients": ["chicken", "rice"],
      "selected_dish": "Chicken Fried Rice",
      "full_recipe": { ... },
      "created_at": "2026-03-19T10:00:00"
    }
  ]
}
```

---

## 🤖 AI Chains

### Suggest Chain (`app/chains/suggest_chain.py`)

Uses `openai/gpt-oss-120b` via Groq API with LangChain.

- Takes a list of ingredients as input
- Returns a JSON array of 4-5 dish suggestions
- Each suggestion includes: name, difficulty, time, description
- Handles markdown cleanup if model wraps response in code blocks

### Recipe Chain (`app/chains/recipe_chain.py`)

Uses `openai/gpt-oss-120b` via Groq API with LangChain.

- Takes dish name and available ingredients as input
- Returns a structured JSON object with steps, tips, and add-ons
- Instructions are kept beginner-friendly
- Handles markdown cleanup if model wraps response in code blocks

---

## 🗄️ MongoDB Collections

### `recipe_sessions`
Stores every suggest and recipe session.

```json
{
  "_id": "ObjectId",
  "ingredients": ["chicken", "rice", "garlic"],
  "suggested_dishes": [...],
  "selected_dish": "Chicken Fried Rice",
  "full_recipe": {
    "dish_name": "...",
    "steps": [...],
    "tips": [...],
    "addons": [...]
  },
  "user_id": "clerk_user_id_optional",
  "created_at": "2026-03-19T10:00:00"
}
```

---

## 🌍 Deployment (Render)

1. Push backend to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:

| Field | Value |
|---|---|
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

5. Add environment variables in Render dashboard:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `DB_NAME` | `ChefOS` |

6. Click **Create Web Service** — deploys automatically on every push to `main`

---

## 🔒 CORS Configuration

The backend allows requests from:
- `http://localhost:5173` (local development)
- `https://chef-os-three.vercel.app` (production frontend)

Update `app/main.py` if your frontend URL changes.

---

## ⚠️ Known Issues & Notes

- **Render free tier cold start** — service sleeps after 15 min of inactivity. First request after sleep takes ~60 seconds. Use UptimeRobot to keep it alive.
- **Python 3.14 + MongoDB SSL** — requires `tlsAllowInvalidCertificates=True` in the MongoClient connection due to SSL compatibility issues.
- **MongoDB Atlas Network Access** — must allow `0.0.0.0/0` since Render free tier uses dynamic IPs.
- **Groq model** — using `openai/gpt-oss-120b`. Check [console.groq.com](https://console.groq.com) for available models if this changes.