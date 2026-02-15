"use client";
import { useState } from "react";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateParagraph() {
  const len = 40 + Math.floor(Math.random() * 40);
  const words = Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [text, setText] = useState("");

  const generate = () => setText(Array.from({ length: count }, generateParagraph).join("\n\n"));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
      <p className="text-gray-400 mb-6">Generate placeholder text for your designs.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-gray-400">Paragraphs:</label>
        <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(+e.target.value)} className="w-20 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
        <button onClick={generate} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">Generate</button>
        <button onClick={() => navigator.clipboard.writeText(text)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition">Copy</button>
      </div>
      {text && <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm overflow-auto max-h-96 whitespace-pre-wrap">{text}</pre>}
    </div>
  );
}
