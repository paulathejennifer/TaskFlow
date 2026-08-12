from fastapi import FastAPI

app = FastAPI(
    title="TaskFlow API",
    description="Backend API for the TaskFlow task management application.",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}