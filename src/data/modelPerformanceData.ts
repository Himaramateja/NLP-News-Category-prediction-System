import { ModelMetric } from '../types/news';

export const MODEL_PERFORMANCE_DATA: ModelMetric[] = [
  {
    model: 'Logistic Regression',
    accuracy: 100,
    precision: 100,
    recall: 100,
    f1Score: 100,
    isBest: true
  }
];

export interface DetailedModelReport {
  name: string;
  hyperparameters: Record<string, string>;
  trainingSamples: number;
  testingSamples: number;
  vocabularySize: number;
  trainingTimeSec: number;
}

export const DETAILED_MODEL_CONFIGS: Record<string, DetailedModelReport> = {
  'Logistic Regression': {
    name: 'scikit-learn LogisticRegression',
    hyperparameters: {
      'C': '2.0',
      'Solver': 'lbfgs (default)',
      'Max iterations': '2,000'
    },
    trainingSamples: 2068,
    testingSamples: 517,
    vocabularySize: 50000,
    trainingTimeSec: 0.14
  }
};
