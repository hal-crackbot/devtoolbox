import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
export const metadata: Metadata = {
  title: "Free UUID v4 Generator Online - Bulk Generate UUIDs | DevToolbox",
  description: "Generate random UUID v4 identifiers instantly in your browser. Bulk generate multiple UUIDs, copy to clipboard. Free online UUID tool for developers.",
  keywords: "UUID generator, UUID v4, random UUID, bulk UUID generator, GUID generator, unique identifier",
};
export default function L({ children }: { children: React.ReactNode }) {
  return <>{children}<JsonLd name="UUID Generator" description="Generate random UUID v4 identifiers online for free. Bulk generate and copy to clipboard." url="https://devtoolbox-delta.vercel.app/uuid-generator" category="DeveloperApplication" /></>;
}
