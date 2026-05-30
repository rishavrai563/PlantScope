from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.endpoints import router as api_router
from app.core.config import settings
from contextlib import asynccontextmanager
import logging
import ray
from ray import serve
from app.services.inference import InferenceService

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    ray.init(ignore_reinit_error=True)
    serve.start(detached=True)
    serve.run(InferenceService.bind(), name="inference_worker", route_prefix="/_worker")
    yield
    serve.shutdown()
    ray.shutdown()

app = FastAPI(
    lifespan=lifespan,
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Production-grade AI Platform for Plant Disease Detection"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve the modern frontend UI from the React build folder
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")
