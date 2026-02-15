"use client";
import { useState, useCallback } from "react";

const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
const generatePalette = () => Array.from({ length: 5 }, randomColor);

export default function ColorPalette() {
  const [colors, setColors] = useState(generatePalette);
  const [copied, setCopied] = useState("");

  const copy = useCallback((c: string) => {
    navigator.clipboard.writeText(c);
    setCopied(c);
    setTimeout(() => setCopied(""), 1500);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
      <p className="text-gray-400 mb-6">Generate random color palettes. Click a color to copy its hex code.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <button onClick={() => setColors(generatePalette())} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition mb-6">Generate New Palette</button>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {colors.map((c, i) => (
          <button key={i} onClick={() => copy(c)} className="aspect-square rounded-xl flex items-end justify-center pb-3 text-sm font-mono font-bold shadow-lg transition hover:scale-105 cursor-pointer" style={{ backgroundColor: c }}>
            <span className="bg-black/50 px-2 py-1 rounded text-white text-xs">{copied === c ? "Copied!" : c}</span>
          </button>
        ))}
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm">
        {colors.join(", ")}
      </div>
    </div>
  );
}
