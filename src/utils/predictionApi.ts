import { NewsCategory, PredictionResult } from '../types/news';

export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8002';

interface ApiPrediction {
  category: string;
  confidence: number;
}

interface PredictionApiResponse {
  primary_category: string;
  confidence: number;
  confidence_level: string;
  related_categories?: ApiPrediction[];
  top_predictions?: ApiPrediction[];
  cleaned_text?: string;
  message?: string;
}

function mapPrediction(prediction: ApiPrediction) {
  return {
    category: prediction.category as NewsCategory,
    confidence: prediction.confidence,
  };
}

export async function predictCategory(
  headline: string,
  articleText: string
): Promise<PredictionResult> {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headline: headline || '',
        text: articleText || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Prediction API failed (${response.status}): ${errorText}`);
    }

    const result = await response.json() as PredictionApiResponse;

    return {
      category: result.primary_category as NewsCategory,
      confidence: result.confidence,
      confidenceLevel: result.confidence_level,
      relatedCategories: (result.related_categories || []).map(mapPrediction),
      topPredictions: (result.top_predictions || []).map(mapPrediction),
      cleanedText: result.cleaned_text || '',
      message: result.message || 'Prediction completed successfully.',
    };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Unable to connect to the prediction server.'
    );
  }
}