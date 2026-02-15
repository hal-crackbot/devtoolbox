"use client";
import { useState } from "react";

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
  );
}

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => setUuids(Array.from({ length: count }, () => uuidv4()));
  const copy = () => navigator.clipboard.writeText(uuids.join("\n"));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">UUID Generator</h1>
      <p className="text-gray-400 mb-6">Generate random UUID v4 identifiers. Bulk generate and copy to clipboard.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="flex gap-3 mb-4 items-center">
        <label className="text-sm text-gray-400">Count:</label>
        <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Math.max(1, Math.min(1000, +e.target.value)))} className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 font-mono text-sm focus:border-purple-500 focus:outline-none" />
        <button onClick={generate} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Generate</button>
        {uuids.length > 0 && <button onClick={copy} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Copy All</button>}
      </div>
      {uuids.length > 0 && (
        <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
          {uuids.map((u, i) => (
            <div key={i} className="flex justify-between items-center hover:bg-gray-800 px-1 rounded cursor-pointer" onClick={() => navigator.clipboard.writeText(u)}>
              <span>{u}</span>
              <span className="text-gray-600 text-xs ml-2">click to copy</span>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
}
