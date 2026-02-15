"use client";
import { useState } from "react";
import type { Metadata } from "next";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h1>
      <p className="text-gray-400 mb-6">Paste JSON to format, validate, or minify.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <textarea
        className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y"
        placeholder="Paste JSON here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-3 my-4">
        <button onClick={format} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Format</button>
        <button onClick={minify} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Minify</button>
        <button onClick={() => { navigator.clipboard.writeText(output); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Copy Output</button>
      </div>
      {error && <p className="text-red-400 mb-4 font-mono text-sm">❌ {error}</p>}
      {output && (
        <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">{output}</pre>
      )}
    </div>
  );
}
