from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model_utils import classifier_service


app = FastAPI(
    title="News Category Prediction API",
    description="NLP-based News Category Prediction System",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=5,
        description="News article content",
    )
    headline: str | None = Field(
        default=None,
        description="Optional news headline",
    )


@app.get("/")
def root():
    return {
        "message": "News Category Prediction API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict_news(payload: NewsRequest):
    try:
        headline = payload.headline or ""
        content = f"{headline} {payload.text}".strip()
        return classifier_service.predict(content)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}",
        ) from error


@app.post("/preprocess")
def preprocess_news(payload: NewsRequest):
    try:
        headline = payload.headline or ""
        content = f"{headline} {payload.text}".strip()
        cleaned = classifier_service.preprocessor.preprocess(content)
        return {
            "original_text": content,
            "cleaned_text": cleaned,
        }
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Preprocessing failed: {str(error)}",
        ) from error


@app.get("/categories")
def get_categories():
    return classifier_service.get_statistics()


@app.get("/model-performance")
def model_performance():
    return classifier_service.get_model_performance()


@app.get("/statistics")
def statistics():
    return classifier_service.get_statistics()
