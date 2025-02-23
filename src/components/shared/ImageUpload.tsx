"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void; // Pass file instead of URL
  defaultImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, defaultImage }) => {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // **Check file size (Max: 400KB)**
    if (file.size > 400 * 1024) { 
      setError("File size must be less than 400KB.");
      return;
    }

    const image = new window.Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      // **Check image dimensions (Max: 512x512)**
      if (image.width > 512 || image.height > 512) {
        setError("Image dimensions must be 512x512 or smaller.");
        return;
      }

      setError(null); // Clear any previous errors
      setPreview(image.src); // Show preview
      onFileSelect(file); // Pass file to parent
    };
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-[#18181b] p-4 rounded-md shadow-md">
      {preview && (
        <Image
          src={preview}
          alt="Preview"
          className="w-[100px] h-[100px] max-h-64 object-cover rounded-md"
          width={100}
          height={100}
        />
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelection}
        className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-400 file:text-white hover:file:bg-sky-500"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUpload;
