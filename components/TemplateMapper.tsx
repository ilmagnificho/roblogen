import React, { useRef, useEffect, useState } from 'react';
import { SHIRT_REGIONS, TemplateRegion } from '../constants';

interface TemplateMapperProps {
  sourceImage: HTMLImageElement | null;
  showGuides: boolean;
  scale: number;
  onTemplateUpdate?: (dataUrl: string) => void;
}

const CANVAS_WIDTH = 585;
const CANVAS_HEIGHT = 559;

export const TemplateMapper: React.FC<TemplateMapperProps> = ({ sourceImage, showGuides, scale, onTemplateUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Clear Canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Draw Source Mapped Regions
    if (sourceImage) {
      const srcCenterX = sourceImage.width / 2;
      const srcCenterY = sourceImage.height / 2;

      SHIRT_REGIONS.forEach((region: TemplateRegion) => {
        // Calculate source cropping area based on offsets from center
        let srcX = srcCenterX + region.offsetX - (region.w / 2) / scale;
        let srcY = srcCenterY + region.offsetY - (region.h / 2) / scale;
        let srcW = region.w / scale;
        let srcH = region.h / scale;

        ctx.save();
        try {
          ctx.drawImage(
            sourceImage,
            srcX, srcY, srcW, srcH, // Source
            region.x, region.y, region.w, region.h // Destination
          );
        } catch (e) {
            // Ignore index size errors
        }
        ctx.restore();
      });
    }

    // 3. Draw Guides Overlay (if enabled)
    if (showGuides) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      SHIRT_REGIONS.forEach((region) => {
        ctx.strokeRect(region.x, region.y, region.w, region.h);
      });
    }

    // Update download URL & Notify Parent
    const dataUrl = canvas.toDataURL('image/png');
    setDownloadUrl(dataUrl);
    if (onTemplateUpdate) {
        onTemplateUpdate(dataUrl);
    }

  }, [sourceImage, showGuides, scale]);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.download = 'roblox_template.png';
      link.href = downloadUrl;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative border-4 border-gray-700 rounded-lg overflow-hidden bg-checkerboard shadow-2xl w-full max-w-[400px]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-auto"
        />
      </div>

      <button
        onClick={handleDownload}
        disabled={!sourceImage}
        className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
          sourceImage
            ? 'bg-gradient-to-r from-roblox-blue to-blue-600 text-white shadow-[0_0_20px_rgba(0,162,255,0.5)]'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Template (.PNG)
      </button>
      
      {!sourceImage && (
        <p className="text-gray-500 text-sm">AI로 디자인을 생성하여 템플릿을 만드세요.</p>
      )}
    </div>
  );
};