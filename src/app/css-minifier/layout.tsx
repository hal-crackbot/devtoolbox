import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
export const metadata: Metadata = {
  title: "Free CSS Minifier Online - Compress CSS Code | DevToolbox",
  description: "Minify and compress CSS code instantly in your browser. Remove whitespace, comments, and unnecessary characters. Free online CSS minifier for developers.",
  keywords: "CSS minifier, minify CSS online, compress CSS, CSS compressor, reduce CSS size, optimize CSS",
};
export default function L({ children }: { children: React.ReactNode }) {
  return <>{children}<JsonLd name="CSS Minifier" description="Minify and compress CSS code online for free. Client-side processing." url="https://devtoolbox-delta.vercel.app/css-minifier" category="DeveloperApplication" /></>;
}
