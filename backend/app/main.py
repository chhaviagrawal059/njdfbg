from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seeds.seed_data import seed_database
from app.routers import (
    auth, challenges, ai, assignments, proposals, marketplace, analytics, feedback, audit,
    funding, rewards, investor
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    # Automatically seed simulated Jharkhand data if database is fresh
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official AI-Powered Societal Innovation & Collaboration Portal for Government of Jharkhand",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(challenges.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(assignments.router, prefix=settings.API_PREFIX)
app.include_router(proposals.router, prefix=settings.API_PREFIX)
app.include_router(marketplace.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(feedback.router, prefix=settings.API_PREFIX)
app.include_router(audit.router, prefix=settings.API_PREFIX)
app.include_router(funding.router, prefix=settings.API_PREFIX)
app.include_router(rewards.router, prefix=settings.API_PREFIX)
app.include_router(investor.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "portal": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "state": "Government of Jharkhand",
        "docs_url": "/docs",
        "api_status": "Online",
        "available_endpoints": [
            f"{settings.API_PREFIX}/auth",
            f"{settings.API_PREFIX}/challenges",
            f"{settings.API_PREFIX}/ai",
            f"{settings.API_PREFIX}/assignments",
            f"{settings.API_PREFIX}/proposals",
            f"{settings.API_PREFIX}/marketplace",
            f"{settings.API_PREFIX}/analytics",
            f"{settings.API_PREFIX}/feedback",
            f"{settings.API_PREFIX}/audit"
        ]
    }
