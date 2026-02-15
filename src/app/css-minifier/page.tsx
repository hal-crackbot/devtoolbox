"use client";
import { useState } from "react";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/^\s+|\s+$/g, "");
}

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const minify = () => setOutput(minifyCss(input));
  const saved = input.length && output.length ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">CSS Minifier</h1>
      <p className="text-gray-400 mb-6">Paste your CSS to get a minified version. Removes comments, whitespace, and unnecessary characters.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <textarea className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y" placeholder="Paste CSS here..." value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex gap-3 my-4 items-center">
        <button onClick={minify} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Minify</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Copy</button>}
        {output && <span className="text-sm text-gray-400">Saved {saved}% ({input.length} → {output.length} chars)</span>}
      </div>
      {output && <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 break-all">{output}</pre>}
    </div>
  );
}
