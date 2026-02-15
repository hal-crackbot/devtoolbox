'use client';

import Link from "next/link";
import { useState, useMemo } from "react";

const tools = [
  { href: "/json-formatter", icon: "📋", title: "JSON Formatter", desc: "Format, validate, and minify JSON data" },
  { href: "/password-generator", icon: "🔑", title: "Password Generator", desc: "Generate secure, random passwords with custom options" },
  { href: "/qr-generator", icon: "📱", title: "QR Code Generator", desc: "Generate QR codes for text, URLs, and more" },
  { href: "/jwt-decoder", icon: "🎫", title: "JWT Token Decoder", desc: "Decode JSON Web Tokens and inspect claims" },
  { href: "/text-case-converter", icon: "🔄", title: "Text Case Converter", desc: "Convert between camelCase, snake_case, kebab-case, and more" },
  { href: "/diff-tool", icon: "📊", title: "Text Diff Tool", desc: "Compare two texts and see differences highlighted" },
  { href: "/base64", icon: "🔐", title: "Base64 Encode/Decode", desc: "Encode and decode Base64 strings" },
  { href: "/url-encode", icon: "🔗", title: "URL Encode/Decode", desc: "Encode and decode URL components" },
  { href: "/color-palette", icon: "🎨", title: "Color Palette Generator", desc: "Generate random color palettes with hex codes" },
  { href: "/gradient-generator", icon: "🌈", title: "CSS Gradient Generator", desc: "Create CSS gradients with a visual picker" },
  { href: "/regex-tester", icon: "🔍", title: "Regex Tester", desc: "Test regular expressions with live matching" },
  { href: "/lorem-ipsum", icon: "📝", title: "Lorem Ipsum Generator", desc: "Generate placeholder text for designs" },
  { href: "/markdown-preview", icon: "📄", title: "Markdown Preview", desc: "Side-by-side Markdown editor and preview" },
  { href: "/image-compressor", icon: "🖼️", title: "Image Compressor", desc: "Compress images client-side in your browser" },
  { href: "/meta-tag-generator", icon: "🏷️", title: "Meta Tag Generator", desc: "Generate HTML meta tags for SEO" },
  { href: "/uuid-generator", icon: "🆔", title: "UUID Generator", desc: "Generate v4 UUIDs, bulk generate, copy" },
  { href: "/hash-generator", icon: "🔒", title: "Hash Generator", desc: "Generate MD5, SHA-1, SHA-256 hashes" },
  { href: "/timestamp-converter", icon: "⏱️", title: "Timestamp Converter", desc: "Convert Unix timestamps to dates and back" },
  { href: "/css-minifier", icon: "✂️", title: "CSS Minifier", desc: "Minify and compress CSS code" },
  { href: "/html-entity", icon: "🔤", title: "HTML Entity Encoder/Decoder", desc: "Encode and decode HTML entities" },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchTerm) return tools;
    return tools.filter(tool =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Free Developer Tools
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Fast, free, and private. All tools run entirely in your browser — no data ever leaves your device.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Google AdSense Ad Slot */}
      <div className="ad-slot mb-8">{/* Ad placeholder - replace with AdSense code */}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group block p-6 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-purple-500/50 hover:bg-gray-900 transition-all"
          >
            <span className="text-3xl mb-3 block">{t.icon}</span>
            <h2 className="text-lg font-semibold mb-1 group-hover:text-purple-400 transition">{t.title}</h2>
            <p className="text-gray-500 text-sm">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
