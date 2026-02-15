"use client";
import { useState, useEffect } from "react";

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsResult, setTsResult] = useState("");
  const [dateResult, setDateResult] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const tsToDate = () => {
    const n = Number(tsInput);
    if (isNaN(n)) { setTsResult("❌ Invalid timestamp"); return; }
    const ms = tsInput.length > 10 ? n : n * 1000;
    const d = new Date(ms);
    setTsResult(`${d.toUTCString()}\n${d.toISOString()}\nLocal: ${d.toLocaleString()}`);
  };

  const dateToTs = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) { setDateResult("❌ Invalid date"); return; }
    setDateResult(`Unix (seconds): ${Math.floor(d.getTime() / 1000)}\nUnix (milliseconds): ${d.getTime()}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Timestamp Converter</h1>
      <p className="text-gray-400 mb-6">Convert between Unix timestamps and human-readable dates.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 text-center">
        <span className="text-gray-400 text-sm">Current Unix Timestamp</span>
        <div className="text-2xl font-mono font-bold text-purple-400 cursor-pointer" onClick={() => navigator.clipboard.writeText(String(now))}>{now}</div>
        <span className="text-gray-600 text-xs">Click to copy</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Timestamp → Date</h2>
          <input type="text" placeholder="e.g. 1700000000" value={tsInput} onChange={(e) => setTsInput(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:border-purple-500 focus:outline-none mb-2" />
          <button onClick={tsToDate} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Convert</button>
          {tsResult && <pre className="mt-3 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">{tsResult}</pre>}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Date → Timestamp</h2>
          <input type="text" placeholder="e.g. 2025-01-15T12:00:00Z" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm focus:border-purple-500 focus:outline-none mb-2" />
          <button onClick={dateToTs} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Convert</button>
          {dateResult && <pre className="mt-3 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">{dateResult}</pre>}
        </div>
      </div>
    </div>
  );
}
