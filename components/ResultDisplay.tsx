
import React, { useCallback } from 'react';
import type { TryOnResult } from '../types';

interface ResultDisplayProps {
  result: TryOnResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {

  const handleDownload = useCallback(() => {
    if (!result.image) return;

    const link = document.createElement('a');
    link.href = result.image;

    // Extract file extension from mime type for a better filename
    try {
      const mimeType = result.image.split(';')[0].split(':')[1];
      const extension = mimeType.split('/')[1] || 'png';
      link.download = `virtual-try-on-result.${extension}`;
    } catch (e) {
      link.download = 'virtual-try-on-result.png';
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result.image]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-2xl my-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-indigo-300 mb-6">Generated Result</h2>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {result.image && (
          <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
            <img 
              src={result.image} 
              alt="Generated try-on" 
              className="rounded-lg shadow-lg w-full object-contain"
            />
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-300 flex items-center gap-2"
              aria-label="Download generated image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Result
            </button>
          </div>
        )}
        <div className={`w-full ${result.image ? 'md:w-1/2' : ''}`}>
          {result.text ? (
            <div className="bg-gray-900 p-4 rounded-lg h-full">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">AI Comments:</h3>
              <p className="text-gray-400 whitespace-pre-wrap">{result.text}</p>
            </div>
          ) : (
            <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-center h-full text-gray-500">
              No text response from the model.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
