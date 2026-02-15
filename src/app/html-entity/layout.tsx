import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
export const metadata: Metadata = {
  title: "Free HTML Entity Encoder & Decoder Online | DevToolbox",
  description: "Encode and decode HTML entities instantly in your browser. Convert special characters to HTML entities and back. Free online tool for developers.",
  keywords: "HTML entity encoder, HTML entity decoder, encode HTML, decode HTML entities, special characters, HTML escape",
};
export default function L({ children }: { children: React.ReactNode }) {
  return <>{children}<JsonLd name="HTML Entity Encoder/Decoder" description="Encode and decode HTML entities online for free. Client-side processing." url="https://devtoolbox-delta.vercel.app/html-entity" category="DeveloperApplication" /></>;
}
