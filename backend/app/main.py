from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.routes.auth import router as auth_router
from app.routes.tasks import router as tasks_router
from app.routes.categories import router as categories_router

app = FastAPI(
    title="TaskFlow API",
    description="Backend API for the TaskFlow task management application.",
    version="0.1.0",
)


app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(categories_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/db")
def database_health_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}