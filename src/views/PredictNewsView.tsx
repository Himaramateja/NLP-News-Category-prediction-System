import React, { useState } from 'react';
import { Send, RotateCcw, CheckCircle2, BarChart3, BookOpen, FileUp } from 'lucide-react';
import { predictCategory } from '../utils/predictionApi';
import { DOCUMENT_ACCEPT, extractDocumentText } from '../utils/documentText';
import { PredictionResult } from '../types/news';
import { getCategoryBadgeStyle } from '../data/categoriesData';
import { TRENDING_NEWS } from '../data/trendingNewsData';

export const PredictNewsView: React.FC = () => {
  const [headline, setHeadline] = useState('');
  const [articleText, setArticleText] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setFileLoading(true);
    setError(null);
    setUploadedFileName('');
    setPrediction(null);
    try {
      const extractedText = await extractDocumentText(file);
      setArticleText(extractedText);
      setPrediction(null);
      setUploadedFileName(file.name);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not read this document.');
    } finally {
      setFileLoading(false);
    }
  };

  const handlePredict = async () => {
    if (articleText.trim().length < 5) {
      setError('Please enter at least 5 characters of article text.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await predictCategory(headline, articleText);
      setPrediction(result);
    } catch (predictionError) {
      setError(predictionError instanceof Error ? predictionError.message : 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setHeadline('');
    setArticleText('');
    setPrediction(null);
    setUploadedFileName('');
    setError(null);
  };

  const loadSample = async (index: number) => {
    const item = TRENDING_NEWS[index % TRENDING_NEWS.length];
    setHeadline(item.headline);
    setArticleText(item.article);
    setLoading(true);
    setError(null);
    try {
      setPrediction(await predictCategory(item.headline, item.article));
    } catch (predictionError) {
      setError(predictionError instanceof Error ? predictionError.message : 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Predict News Category
          </h1>
          <p className="text-sm text-slate-500">
            Classify news text and compare category confidence percentages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Quick Samples:</span>
          <button
            onClick={() => loadSample(0)}
            className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
          >
            AI Tech
          </button>
          <button
            onClick={() => loadSample(1)}
            className="text-xs px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 font-medium"
          >
            Sports
          </button>
          <button
            onClick={() => loadSample(2)}
            className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
          >
            Markets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              News Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. New AI chip design accelerates computing performance"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/40"
            />
          </div>

          <div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="news-article" className="block text-xs font-semibold text-slate-700">
                News Article Body
              </label>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <FileUp className="h-3.5 w-3.5 text-blue-600" />
                <span>{fileLoading ? 'Reading document...' : 'Import PDF or DOCX'}</span>
                <input
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={handleDocumentUpload}
                  disabled={fileLoading}
                  className="sr-only"
                />
              </label>
            </div>
            {uploadedFileName && (
              <p className="mb-1.5 truncate text-[11px] text-slate-500" title={uploadedFileName}>
                Imported: {uploadedFileName}
              </p>
            )}
            <textarea
              id="news-article"
              rows={8}
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Paste the full news article body text here..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/40"
            />
            <div className="flex justify-between items-center text-xs text-slate-400 mt-1.5 font-mono">
              <span>Supports articles of any length</span>
              <span>
                {articleText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePredict}
              disabled={loading || fileLoading || articleText.trim().length < 5}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Classifying...' : 'Predict Category'}</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Clear</span>
            </button>
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </div>

        {/* Prediction Results Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          {!prediction ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Awaiting News Input
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Fill in the headline or article on the left, or click a quick sample above to run the classification pipeline.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Classification Result
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {prediction.confidenceLevel} confidence
                </span>
              </div>

              {/* Primary Label */}
              <div>
                <p className="text-xs text-slate-500 mb-1">Predicted Category</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-base font-bold border shadow-xs ${
                      getCategoryBadgeStyle(prediction.category).bg
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {prediction.category}
                  </span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                    {prediction.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>

              {/* Top 3 List */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Category Confidence Percentages
                </p>
                <div className="space-y-2">
                  {prediction.topPredictions.map((p, idx) => (
                    <div key={p.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono">{idx + 1}.</span>
                        <span className="font-semibold text-slate-800">{p.category}</span>
                      </div>
                      <span className="font-mono tabular-nums text-slate-600 font-medium">
                        {p.confidence.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend prediction details */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Related Categories</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {prediction.relatedCategories.map((item) => (
                    <span key={item.category} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                      {item.category}: {item.confidence.toFixed(1)}%
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">{prediction.message}</p>
                <p className="mt-2 text-xs text-slate-600">{prediction.cleanedText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
