
import React, { useState } from 'react';
import type { Analysis } from './types';
import { analyzePlantImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import Spinner from './components/Spinner';
import LeafIcon from './components/icons/LeafIcon';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);

  const handleImageUpload = async (base64Image: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setImageUploaded(true);

    try {
      const result = await analyzePlantImage(base64Image);
      setAnalysisResult(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-3">
          <LeafIcon className="w-12 h-12 text-green-600"/>
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800">Plant-MD</h1>
        </div>
        <p className="text-lg text-gray-600 mt-2">Your AI-powered plant disease detector</p>
      </header>

      <main className="w-full">
        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />

        <div className="mt-8">
          {isLoading && <Spinner />}
          {error && (
            <div className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {analysisResult && <AnalysisResult analysis={analysisResult} />}
          {!isLoading && !error && !analysisResult && imageUploaded && (
             <div className="text-center text-gray-500">
                <p>Analysis will appear here.</p>
            </div>
          )}
           {!isLoading && !error && !analysisResult && !imageUploaded && (
             <div className="text-center text-gray-500 max-w-2xl mx-auto mt-8">
                <p className="text-lg">Welcome to Plant-MD! 🌿</p>
                <p className="mt-2">Upload an image of a plant leaf, and our AI will analyze its health, identify potential diseases, and suggest treatment options.</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center text-gray-500 mt-12 text-sm">
        <p>&copy; {new Date().getFullYear()} Plant-MD. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
