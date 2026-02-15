import type { MetadataRoute } from "next";

const BASE = "https://devtoolbox-delta.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "json-formatter",
    "base64",
    "url-encode",
    "color-palette",
    "gradient-generator",
    "regex-tester",
    "lorem-ipsum",
    "markdown-preview",
    "image-compressor",
    "meta-tag-generator",
    "uuid-generator",
    "hash-generator",
    "timestamp-converter",
    "css-minifier",
    "html-entity",
  ];

  const blogs = [
    "best-free-online-json-formatter-and-validator",
    "how-to-test-regular-expressions-online",
    "free-developer-tools-you-need-in-2026",
  ];

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    ...tools.map((t) => ({
      url: `${BASE}/${t}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...blogs.map((b) => ({
      url: `${BASE}/blog/${b}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
