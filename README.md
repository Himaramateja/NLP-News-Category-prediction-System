# News Classifier

A full-stack news categorization app that predicts the category of a news article or headline using a trained NLP model. The project includes a React + Vite frontend and a FastAPI backend that serves the classifier and model metadata.

## Features

- Predict article category from headline and body text
- Explore the NLP preprocessing pipeline
- View model performance and dataset statistics
- Inspect supported categories and class distribution
- Retrain the model with custom datasets

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn
- ML: scikit-learn, pandas, NumPy, joblib

## Project Structure

```text
news-classifier/
├── backend/
│   ├── data/
│   ├── categories.py
│   ├── main.py
│   ├── model_utils.py
│   ├── models/
│   ├── preprocessing.py
│   ├── train_model.py
│   └── ...
├── src/
├── public/
├── index.html
├── package.json
├── requirements.txt
├── .env.example
├── README.md
└── vite.config.ts
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- npm
- pip

## Setup

1. Install Python dependencies:

```bash
pip install -r requirements.txt
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the API backend:

```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8002
```

4. Start the frontend in a second terminal:

```bash
VITE_API_URL=http://127.0.0.1:8002 npm run dev
```

On Windows PowerShell, use:

```powershell
$env:VITE_API_URL = 'http://127.0.0.1:8002'; npm run dev
```

The frontend runs on http://localhost:3000 (or the next available Vite port) and the backend API runs on http://localhost:8002.

## API Endpoints

The backend exposes the following endpoints:

- `GET /` — API status
- `GET /health` — health check
- `POST /predict` — classify news text
- `POST /preprocess` — return cleaned/preprocessed text
- `GET /categories` — category information and statistics
- `GET /model-performance` — evaluation summary
- `GET /statistics` — dataset stats

Example request:

```bash
curl -X POST http://localhost:8001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Stocks rise after strong earnings report",
    "text": "Major technology companies posted stronger-than-expected quarterly results, pushing markets higher across the region."
  }'
```

## Model Training

The training pipeline is located in `backend/train_model.py`.

Run:

```bash
cd backend
python train_model.py
```

By default, the script merges the training datasets under `backend/data` and trains a 12-category model. The trainer validates that all supported categories are present before saving the trained model.

To train using custom data sources:

```bash
python train_model.py \
  --data "C:\path\to\news_dataset_12_categories_7200.csv" \
  --extra "C:\path\to\news_dataset_final_3060.csv" \
  --keywords "C:\path\to\category_keywords_100_each.csv"
```

## Notes

- Keyword examples are only added to the training split.
- Held-out evaluation remains based on article text rather than keyword augmentation.
- The app is designed for local development and experimentation with news classification workflows.
