
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        // Extract just the base64 part
        const base64Data = base64String.split(',')[1];
        onImageUpload(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`bg-white border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
          isLoading ? 'border-gray-300' : 'border-green-400 hover:border-green-600 cursor-pointer'
        }`}
        onClick={!isLoading ? handleUploadClick : undefined}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          disabled={isLoading}
        />
        {imagePreview ? (
          <div className="flex flex-col items-center">
            <img src={imagePreview} alt="Plant preview" className="max-h-80 rounded-lg shadow-md mb-6" />
            <button
              onClick={handleUploadClick}
              disabled={isLoading}
              className="mt-2 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
            <p className="font-semibold">Click to upload an image of a plant leaf</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
