"use client";
import { useState } from "react";

function encodeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;", "/": "&#x2F;" }[c] || c));
}

function decodeHtml(str: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
}

export default function HtmlEntity() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => setOutput(mode === "encode" ? encodeHtml(input) : decodeHtml(input));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">HTML Entity Encoder / Decoder</h1>
      <p className="text-gray-400 mb-6">Encode special characters to HTML entities or decode them back to text.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setMode("encode")} className={`px-4 py-2 rounded-lg font-medium transition ${mode === "encode" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>Encode</button>
        <button onClick={() => setMode("decode")} className={`px-4 py-2 rounded-lg font-medium transition ${mode === "decode" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>Decode</button>
      </div>
      <textarea className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y" placeholder={mode === "encode" ? 'e.g. <div class="test">' : "e.g. &lt;div class=&quot;test&quot;&gt;"} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex gap-3 my-4">
        <button onClick={convert} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Convert</button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Copy</button>
      </div>
      {output && <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 break-all">{output}</pre>}
    </div>
  );
}
