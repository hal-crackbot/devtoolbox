"use client";
import { useState } from "react";

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [copied, setCopied] = useState(false);

  const css = type === "linear"
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const copy = () => {
    navigator.clipboard.writeText(`background: ${css};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">CSS Gradient Generator</h1>
      <p className="text-gray-400 mb-6">Create beautiful CSS gradients visually.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="w-full h-48 rounded-xl mb-6 shadow-lg" style={{ background: css }} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Color 1</span>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Color 2</span>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 rounded cursor-pointer" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as "linear" | "radial")} className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </label>
        {type === "linear" && (
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-400">Angle: {angle}°</span>
            <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="mt-2" />
          </label>
        )}
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm mb-4">
        background: {css};
      </div>
      <button onClick={copy} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">
        {copied ? "Copied!" : "Copy CSS"}
      </button>
    </div>
  );
}
