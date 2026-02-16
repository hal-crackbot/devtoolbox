'use client';

import { useState, useRef } from 'react';

export default function ImageResizer() {
  const [originalImage, setOriginalImage] = useState<{
    url: string;
    width: number;
    height: number;
    name: string;
    size: number;
  } | null>(null);
  const [resizedImage, setResizedImage] = useState<{
    url: string;
    width: number;
    height: number;
    size: number;
  } | null>(null);
  
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [quality, setQuality] = useState(0.9);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      setOriginalImage({
        url,
        width: img.width,
        height: img.height,
        name: file.name,
        size: file.size
      });
      
      // Auto-set dimensions maintaining ratio
      if (maintainRatio) {
        const ratio = img.width / img.height;
        if (ratio > 1) {
          setTargetWidth(800);
          setTargetHeight(Math.round(800 / ratio));
        } else {
          setTargetHeight(600);
          setTargetWidth(Math.round(600 * ratio));
        }
      }
      
      setResizedImage(null);
    };
    
    img.src = url;
  };

  const resizeImage = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setResizedImage({
            url: URL.createObjectURL(blob),
            width: targetWidth,
            height: targetHeight,
            size: blob.size
          });
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = originalImage.url;
  };

  const updateHeight = (width: number) => {
    if (maintainRatio && originalImage) {
      const ratio = originalImage.width / originalImage.height;
      setTargetHeight(Math.round(width / ratio));
    }
  };

  const updateWidth = (height: number) => {
    if (maintainRatio && originalImage) {
      const ratio = originalImage.width / originalImage.height;
      setTargetWidth(Math.round(height * ratio));
    }
  };

  const formatBytes = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Image Resizer</h1>
      <p className="text-gray-600 mb-6">
        Resize images to specific dimensions with high-quality scaling. Perfect for web optimization, social media, and responsive design.
      </p>

      <div className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!originalImage ? (
            <div>
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Select Image to Resize
              </button>
              <p className="text-gray-500 mt-2">Supports JPG, PNG, GIF, WebP</p>
            </div>
          ) : (
            <div className="space-y-4">
              <img 
                src={originalImage.url} 
                alt="Original" 
                className="max-w-xs max-h-48 mx-auto rounded-lg shadow-md"
              />
              <div className="text-sm text-gray-600">
                <p><strong>File:</strong> {originalImage.name}</p>
                <p><strong>Dimensions:</strong> {originalImage.width} × {originalImage.height}</p>
                <p><strong>Size:</strong> {formatBytes(originalImage.size)}</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Choose Different Image
              </button>
            </div>
          )}
        </div>

        {originalImage && (
          <>
            {/* Resize Controls */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Resize Settings</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => {
                      const width = parseInt(e.target.value) || 0;
                      setTargetWidth(width);
                      updateHeight(width);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => {
                      const height = parseInt(e.target.value) || 0;
                      setTargetHeight(height);
                      updateWidth(height);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintain-ratio"
                  checked={maintainRatio}
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="maintain-ratio" className="text-sm font-medium text-gray-700">
                  Maintain aspect ratio
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <button
                onClick={resizeImage}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Resize Image
              </button>
            </div>

            {/* Result */}
            {resizedImage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Resized Image</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={resizedImage.url} 
                      alt="Resized" 
                      className="max-w-full rounded-lg shadow-md"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p><strong>New Dimensions:</strong> {resizedImage.width} × {resizedImage.height}</p>
                      <p><strong>New Size:</strong> {formatBytes(resizedImage.size)}</p>
                      <p><strong>Size Change:</strong> 
                        <span className={resizedImage.size < originalImage.size ? 'text-green-600' : 'text-red-600'}>
                          {resizedImage.size < originalImage.size ? '↓' : '↑'} 
                          {Math.round(((resizedImage.size - originalImage.size) / originalImage.size) * 100)}%
                        </span>
                      </p>
                    </div>
                    
                    <a
                      href={resizedImage.url}
                      download={`resized-${targetWidth}x${targetHeight}-${originalImage.name}`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resized Image
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Presets */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Common Sizes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Instagram Square', w: 1080, h: 1080 },
              { name: 'Instagram Story', w: 1080, h: 1920 },
              { name: 'Facebook Cover', w: 1200, h: 630 },
              { name: 'Twitter Header', w: 1500, h: 500 },
              { name: 'LinkedIn Banner', w: 1584, h: 396 },
              { name: 'YouTube Thumbnail', w: 1280, h: 720 },
              { name: 'Blog Header', w: 1200, h: 600 },
              { name: 'Email Header', w: 600, h: 200 }
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setTargetWidth(preset.w);
                  setTargetHeight(preset.h);
                  setMaintainRatio(false);
                }}
                className="p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-500">{preset.w} × {preset.h}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}