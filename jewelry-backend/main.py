import os
import logging
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from database import engine, Base
from routers import auth, products, cart, orders, ai, admin

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vivelt Gold Jewelry API", version="1.0.0")

# Enhanced ALLOWED_ORIGINS to include common dev ports and production domain
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://jw.almasar.org",
    "https://www.jw.almasar.org"
]
env_origins = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = (env_origins.split(",") if env_origins else []) + default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RATE_LIMIT = int(os.getenv("RATE_LIMIT", "60"))
import time

_rate_limits: dict[str, dict] = {}


@app.middleware("http")
async def log_and_rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Request: {request.method} {request.url.path} from {client_ip}")
    
    now = time.time()
    entry = _rate_limits.get(client_ip, {"count": 0, "window_start": now})
    if now - entry["window_start"] > 60:
        entry = {"count": 0, "window_start": now}
    entry["count"] += 1
    _rate_limits[client_ip] = entry
    
    if entry["count"] > RATE_LIMIT:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again later."},
        )
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} (took {process_time:.4f}s)")
    
    return response


app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Welcome to Vivelt Gold Jewelry API"}
