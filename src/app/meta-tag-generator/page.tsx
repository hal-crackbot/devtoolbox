"use client";
import { useState } from "react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const tags = [
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    title && `<title>${title}</title>`,
    desc && `<meta name="description" content="${desc}">`,
    keywords && `<meta name="keywords" content="${keywords}">`,
    author && `<meta name="author" content="${author}">`,
    title && `<meta property="og:title" content="${title}">`,
    desc && `<meta property="og:description" content="${desc}">`,
    ogImage && `<meta property="og:image" content="${ogImage}">`,
    url && `<meta property="og:url" content="${url}">`,
    `<meta property="og:type" content="website">`,
    title && `<meta name="twitter:card" content="summary_large_image">`,
    title && `<meta name="twitter:title" content="${title}">`,
    desc && `<meta name="twitter:description" content="${desc}">`,
    ogImage && `<meta name="twitter:image" content="${ogImage}">`,
  ].filter(Boolean).join("\n");

  const copy = () => {
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputCls = "w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-purple-500 focus:outline-none";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Meta Tag Generator</h1>
      <p className="text-gray-400 mb-6">Generate HTML meta tags for SEO and social sharing.</p>
      <div className="ad-slot mb-4">{/* Ad placeholder */}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input className={inputCls} placeholder="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={inputCls} placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input className={inputCls} placeholder="Keywords (comma separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        <input className={inputCls} placeholder="Page URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input className={inputCls + " md:col-span-2"} placeholder="OG Image URL" value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
        <textarea className={inputCls + " md:col-span-2 h-20 resize-y"} placeholder="Page Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <div className="flex gap-3 mb-4">
        <button onClick={copy} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition">{copied ? "Copied!" : "Copy Tags"}</button>
      </div>
      <pre className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96 whitespace-pre-wrap">{tags}</pre>
    </div>
  );
}
