
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      <p className="text-green-700 font-medium">Analyzing your plant...</p>
    </div>
  );
};

export default Spinner;
