from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routes.recipe import router as recipe_router
import os

from dotenv import load_dotenv
# Explicitly point to .env in the backend root folder
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

from app.routes.recipe import router as recipe_router

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="ChefOS API",
    description="AI-powered recipe generator",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    "http://localhost:5173",
    "https://chef-os-three.vercel.app",
    "https://chef-os-three-*.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipe_router, prefix="/api", tags=["recipes"])

@app.get("/")
def root():
    return {"message": "ChefOS API is running!"}