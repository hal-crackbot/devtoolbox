'use client';

import { useState, useRef } from 'react';

interface FileData {
  file: File;
  size: number;
  estimatedGzipSize: number;
  estimatedBrotliSize: number;
}

export default function FileSizeCalculator() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estimate gzip compression based on file type and content patterns
  const estimateGzipSize = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        // Rough gzip estimation based on file type and content patterns
        let compressionRatio = 0.7; // Default 30% compression
        
        if (file.type.includes('text') || file.name.endsWith('.js') || file.name.endsWith('.css') || file.name.endsWith('.html')) {
          // Text-based files compress well
          const repetitiveContent = content.match(/(.{10,})\1+/g)?.length || 0;
          const whitespaceRatio = (content.match(/\s/g)?.length || 0) / content.length;
          compressionRatio = Math.max(0.15, 0.8 - (repetitiveContent * 0.05) - (whitespaceRatio * 0.3));
        } else if (file.type.includes('json')) {
          // JSON compresses very well
          compressionRatio = 0.2;
        } else if (file.type.includes('image')) {
          // Images already compressed
          compressionRatio = 0.95;
        } else if (file.type.includes('video') || file.type.includes('audio')) {
          // Media files don't compress much
          compressionRatio = 0.98;
        }
        
        resolve(Math.round(file.size * compressionRatio));
      };
      
      if (file.type.includes('text') || file.name.match(/\.(js|css|html|json|xml|svg)$/)) {
        reader.readAsText(file);
      } else {
        // For non-text files, use simpler estimation
        let ratio = 0.7;
        if (file.type.includes('image')) ratio = 0.95;
        if (file.type.includes('video') || file.type.includes('audio')) ratio = 0.98;
        if (file.name.endsWith('.zip') || file.name.endsWith('.gz')) ratio = 1.02; // Already compressed
        resolve(Math.round(file.size * ratio));
      }
    });
  };

  const estimateBrotliSize = (originalSize: number, gzipSize: number): number => {
    // Brotli is typically 15-25% better than gzip
    return Math.round(gzipSize * 0.8);
  };

  const processFiles = async (fileList: FileList) => {
    const newFiles: FileData[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const estimatedGzipSize = await estimateGzipSize(file);
      const estimatedBrotliSize = estimateBrotliSize(file.size, estimatedGzipSize);
      
      newFiles.push({
        file,
        size: file.size,
        estimatedGzipSize,
        estimatedBrotliSize,
      });
    }
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatSize = (bytes: number): { value: string; unit: string } => {
    if (bytes === 0) return { value: '0', unit: 'B' };
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
    
    return { value, unit: units[i] };
  };

  const clearFiles = () => setFiles([]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalGzipSize = files.reduce((sum, f) => sum + f.estimatedGzipSize, 0);
  const totalBrotliSize = files.reduce((sum, f) => sum + f.estimatedBrotliSize, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">File Size Calculator</h1>
      <p className="text-gray-600 mb-6">
        Check file sizes and estimate compression for deployment optimization. Supports gzip and Brotli compression estimates.
      </p>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports multiple files of any type
            </p>
            <button
              onClick={triggerFileSelect}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Select Files
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {files.length > 0 && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Summary ({files.length} files)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Original Size</div>
                <div className="text-xl font-bold">
                  {formatSize(totalSize).value} {formatSize(totalSize).unit}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Gzip Estimated</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatSize(totalGzipSize).value} {formatSize(totalGzipSize).unit}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((1 - totalGzipSize/totalSize) * 100)}% reduction
                </div>
              </div>
              <div>
                <div className="text-gray-600">Brotli Estimated</div>
                <div className="text-xl font-bold text-green-600">
                  {formatSize(totalBrotliSize).value} {formatSize(totalBrotliSize).unit}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((1 - totalBrotliSize/totalSize) * 100)}% reduction
                </div>
              </div>
            </div>
          </div>

          {/* Individual Files */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Individual Files</h3>
              <button
                onClick={clearFiles}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-3">
              {files.map((fileData, index) => {
                const original = formatSize(fileData.size);
                const gzip = formatSize(fileData.estimatedGzipSize);
                const brotli = formatSize(fileData.estimatedBrotliSize);
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 truncate">
                          {fileData.file.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {fileData.file.type || 'Unknown type'}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 text-xs">Original</div>
                          <div className="font-semibold">{original.value} {original.unit}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs">Gzip</div>
                          <div className="font-semibold text-blue-600">{gzip.value} {gzip.unit}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs">Brotli</div>
                          <div className="font-semibold text-green-600">{brotli.value} {brotli.unit}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Deployment Tips:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Gzip:</strong> Most servers support this - typically 60-80% compression for text files</li>
          <li>• <strong>Brotli:</strong> Modern compression - 15-25% better than gzip, supported by most browsers</li>
          <li>• <strong>Images/Videos:</strong> Already compressed - focus on resizing/optimization instead</li>
          <li>• <strong>Text files:</strong> JavaScript, CSS, HTML compress very well with gzip/brotli</li>
          <li>• <strong>Target sizes:</strong> Keep initial JS bundles under 200KB, critical CSS under 15KB</li>
          <li>• All processing happens locally - your files never leave your browser</li>
        </ul>
      </div>
    </div>
  );
}