
import React, { useState, useRef } from 'react';
import type { ImageState } from '../types';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageSelect: (imageState: ImageState | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64Data = result.split(',')[1];
        onImageSelect({ base64: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageSelect(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl h-full flex flex-col">
      <h2 className="text-xl font-semibold text-center text-indigo-300 mb-4">{title}</h2>
      <div
        onClick={handleClick}
        className="flex-grow border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-gray-700/50 transition-all duration-300 relative group aspect-w-1 aspect-h-1"
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-600/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Click to upload an image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
