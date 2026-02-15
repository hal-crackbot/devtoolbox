"use client";
import { useState, useRef } from "react";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal({ url, size: file.size, name: file.name });
    setCompressed(null);
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
      <p className="text-gray-400 mb-6">Compress images client-side. Nothing leaves your browser.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <input type="file" accept="image/*" onChange={handleFile} className="mb-4 block" />
      {original && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Quality: {Math.round(quality * 100)}%</label>
            <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1" />
            <button onClick={compress} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Compress</button>
          </div>
          <p className="text-sm text-gray-400">Original: {fmt(original.size)}</p>
          {compressed && (
            <div className="space-y-2">
              <p className="text-sm text-green-400">Compressed: {fmt(compressed.size)} ({Math.round((1 - compressed.size / original.size) * 100)}% reduction)</p>
              <a href={compressed.url} download={`compressed-${original.name}`} className="inline-block px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition">Download</a>
            </div>
          )}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
