
import React from 'react';
import type { TryOnResult } from '../types';

interface ResultDisplayProps {
  result: TryOnResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-2xl my-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-indigo-300 mb-6">Generated Result</h2>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {result.image && (
          <div className="w-full md:w-1/2">
            <img 
              src={result.image} 
              alt="Generated try-on" 
              className="rounded-lg shadow-lg w-full object-contain"
            />
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
