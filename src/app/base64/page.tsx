"use client";
import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    try {
      setOutput(mode === "encode" ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input))));
    } catch {
      setOutput("❌ Invalid input");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Base64 Encode / Decode</h1>
      <p className="text-gray-400 mb-6">Convert text to and from Base64 encoding.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setMode("encode")} className={`px-4 py-2 rounded-lg font-medium transition ${mode === "encode" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>Encode</button>
        <button onClick={() => setMode("decode")} className={`px-4 py-2 rounded-lg font-medium transition ${mode === "decode" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>Decode</button>
      </div>
      <textarea className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y" placeholder="Enter text..." value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex gap-3 my-4">
        <button onClick={convert} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Convert</button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Copy</button>
      </div>
      {output && <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 break-all">{output}</pre>}
    </div>
  );
}
