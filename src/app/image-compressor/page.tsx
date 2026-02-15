"use client";
import { useState, useRef } from "react";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal({ url, size: file.size, name: file.name });
    setCompressed(null);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const compress = () => {
    if (!original || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
        },
        "image/jpeg",
        quality
      );
    };
    img.src = original.url;
  };

  const fmt = (b: number) => (b / 1024).toFixed(1) + " KB";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Image Compressor</h1>
      <p className="text-gray-400 mb-6">Compress images client-side in your browser. No uploads needed - everything stays private.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFile} 
        className="hidden" 
      />
      <button
        onClick={triggerFileSelect}
        className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {original ? 'Choose Different Image' : 'Choose Image to Compress'}
      </button>
      {original && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 className="font-medium mb-2">Selected Image</h3>
            <p className="text-sm text-gray-400">File: {original.name}</p>
            <p className="text-sm text-gray-400">Size: {fmt(original.size)}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300 min-w-fit">Quality: {Math.round(quality * 100)}%</label>
              <input 
                type="range" 
                min={0.1} 
                max={1} 
                step={0.05} 
                value={quality} 
                onChange={(e) => setQuality(+e.target.value)} 
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <button 
              onClick={compress} 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Compress Image
            </button>
          </div>
          
          {compressed && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg space-y-3">
              <h3 className="font-medium text-green-400">Compression Complete!</h3>
              <p className="text-sm text-green-300">
                Compressed: {fmt(compressed.size)} 
                <span className="ml-2 font-medium">
                  ({Math.round((1 - compressed.size / original.size) * 100)}% reduction)
                </span>
              </p>
              <a 
                href={compressed.url} 
                download={`compressed-${original.name}`} 
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Compressed Image
              </a>
            </div>
          )}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
