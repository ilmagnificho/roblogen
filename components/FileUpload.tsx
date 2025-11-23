import React, { useRef } from 'react';

interface FileUploadProps {
  onImageSelected: (img: HTMLImageElement) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onImageSelected }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        onImageSelected(img);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div 
        className="w-full p-8 border-2 border-dashed border-gray-600 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer text-center group"
        onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-roblox-blue transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <div>
            <h3 className="text-lg font-bold text-white">Upload Design</h3>
            <p className="text-sm text-gray-400">Click to browse or drop file here</p>
            <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG</p>
        </div>
      </div>
    </div>
  );
};
