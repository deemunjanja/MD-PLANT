
import React from 'react';
import type { Analysis } from '../types';

interface AnalysisResultProps {
  analysis: Analysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  const { isHealthy, diseaseName, description, treatment, confidenceScore } = analysis;

  const healthStatusColor = isHealthy ? 'text-green-600 bg-green-100' : 'text-yellow-800 bg-yellow-100';
  const confidenceColor = confidenceScore > 85 ? 'text-green-700' : confidenceScore > 60 ? 'text-yellow-700' : 'text-red-700';

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Analysis Report</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider">Health Status</h3>
        <p className={`text-2xl font-bold mt-1 inline-block px-4 py-1 rounded-full ${healthStatusColor}`}>
          {diseaseName}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider">Description</h3>
        <p className="text-gray-700 mt-1 text-base leading-relaxed">{description}</p>
      </div>
      
      {!isHealthy && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider">Suggested Treatment</h3>
          <div className="text-gray-700 mt-1 text-base leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
            {treatment}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wider">Confidence Score</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div className="bg-green-600 h-4 rounded-full" style={{ width: `${confidenceScore}%` }}></div>
        </div>
        <p className={`text-2xl font-bold mt-2 text-right ${confidenceColor}`}>{confidenceScore}%</p>
      </div>
    </div>
  );
};

export default AnalysisResult;
