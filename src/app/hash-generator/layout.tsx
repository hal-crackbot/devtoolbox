import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
export const metadata: Metadata = {
  title: "Free Hash Generator Online - MD5, SHA-1, SHA-256 | DevToolbox",
  description: "Generate MD5, SHA-1, and SHA-256 hashes from text instantly in your browser. Free online hash generator using the Web Crypto API. No data leaves your device.",
  keywords: "hash generator, MD5 hash, SHA-1 hash, SHA-256 hash, online hash tool, checksum generator",
};
export default function L({ children }: { children: React.ReactNode }) {
  return <>{children}<JsonLd name="Hash Generator" description="Generate MD5, SHA-1, and SHA-256 hashes from text online for free." url="https://devtoolbox-delta.vercel.app/hash-generator" category="DeveloperApplication" /></>;
}
