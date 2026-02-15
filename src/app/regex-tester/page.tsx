"use client";
import { useState, useMemo } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");

  const result = useMemo(() => {
    if (!pattern) return null;
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...testStr.matchAll(re)];
      return { matches, error: null };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, testStr]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
      <p className="text-gray-400 mb-6">Test regular expressions with live matching.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="flex gap-3 mb-4">
        <input className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:border-purple-500 focus:outline-none" placeholder="Regex pattern..." value={pattern} onChange={(e) => setPattern(e.target.value)} />
        <input className="w-24 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:border-purple-500 focus:outline-none" placeholder="Flags" value={flags} onChange={(e) => setFlags(e.target.value)} />
      </div>
      <textarea className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y" placeholder="Test string..." value={testStr} onChange={(e) => setTestStr(e.target.value)} />
      {result?.error && <p className="text-red-400 mt-4 font-mono text-sm">❌ {result.error}</p>}
      {result && !result.error && (
        <div className="mt-4">
          <p className="text-gray-400 mb-2">{result.matches.length} match{result.matches.length !== 1 ? "es" : ""} found</p>
          <div className="space-y-2">
            {result.matches.map((m, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm">
                <span className="text-purple-400">Match {i + 1}:</span> <span className="text-green-400">&quot;{m[0]}&quot;</span>
                <span className="text-gray-500 ml-2">index {m.index}</span>
                {m.length > 1 && (
                  <div className="mt-1 text-gray-400">
                    Groups: {m.slice(1).map((g, j) => <span key={j} className="text-blue-400 mr-2">[{j + 1}] &quot;{g}&quot;</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
