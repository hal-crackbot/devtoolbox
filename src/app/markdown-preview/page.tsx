"use client";
import { useState, useMemo } from "react";

// Simple markdown to HTML (no dependencies)
function md(s: string): string {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-gray-800 px-1 rounded text-purple-300'>$1</code>")
    .replace(/^\- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-4 list-decimal'>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-blue-400 underline'>$1</a>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

const INITIAL = `# Hello World

This is a **Markdown** preview tool.

## Features
- *Live* preview
- Side-by-side editing
- No dependencies

### Try it out!
1. Edit this text
2. See the preview update
3. [DevToolbox](/)

\`inline code\` works too!`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(INITIAL);
  const html = useMemo(() => md(input), [input]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Markdown Preview</h1>
      <p className="text-gray-400 mb-6">Edit Markdown on the left, see the rendered preview on the right.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm focus:border-purple-500 focus:outline-none resize-y" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm overflow-auto prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
