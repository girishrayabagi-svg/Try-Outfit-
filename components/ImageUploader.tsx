import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ImageState } from '../types';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageSelect: (imageState: ImageState | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const processImage = useCallback((imageFile: File | null, degrees: number) => {
    if (!imageFile) {
      onImageSelect(null);
      return;
    }
    
    setIsProcessing(true);
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsProcessing(false);
            URL.revokeObjectURL(objectUrl);
            alert("Could not get canvas context for image processing.");
            return;
        };

        const radians = degrees * Math.PI / 180;
        
        // For 90 or 270 degrees, swap width and height
        if (degrees % 180 !== 0) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const dataUrl = canvas.toDataURL(imageFile.type);
        const base64Data = dataUrl.split(',')[1];
        onImageSelect({ base64: base64Data, mimeType: imageFile.type });
        setIsProcessing(false);
        URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
        setIsProcessing(false);
        URL.revokeObjectURL(objectUrl);
        alert("Failed to load image for processing.");
    };
    img.src = objectUrl;
  }, [onImageSelect]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      setFile(selectedFile);
      setRotation(0);
      setPreview(URL.createObjectURL(selectedFile));
      processImage(selectedFile, 0);

    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRotate = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    if (!file || isProcessing) return;

    const newRotation = direction === 'left'
      ? (rotation - 90 + 360) % 360
      : (rotation + 90) % 360;
    
    setRotation(newRotation);
    processImage(file, newRotation);
  }

  const handleClick = () => {
    if (isProcessing) return;
    fileInputRef.current?.click();
  };
  
  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPreview(null);
    setFile(null);
    setRotation(0);
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
        className={`flex-grow border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 relative group aspect-w-1 aspect-h-1 ${isProcessing && !preview ? 'cursor-wait bg-gray-700/50' : 'cursor-pointer hover:border-indigo-400 hover:bg-gray-700/50'}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label={preview ? "Image preview and controls" : "Click to upload an image"}
        aria-disabled={isProcessing}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md transition-transform duration-300" style={{ transform: `rotate(${rotation}deg)` }}/>
            <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handleClear}
                  className="self-end bg-red-600/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove image"
                  disabled={isProcessing}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="self-center flex gap-2">
                    <button 
                        onClick={(e) => handleRotate(e, 'left')}
                        disabled={isProcessing}
                        className="bg-gray-900/80 text-white rounded-full p-2 hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Rotate left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                    </button>
                     <button 
                        onClick={(e) => handleRotate(e, 'right')}
                        disabled={isProcessing}
                        className="bg-gray-900/80 text-white rounded-full p-2 hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Rotate right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H3a6 6 0 000 12h3" />
                        </svg>
                    </button>
                </div>
            </div>
            {isProcessing && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-lg">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400">
            {isProcessing ? (
                <>
                    <svg className="animate-spin mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2">Processing...</p>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">Click to upload an image</p>
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
