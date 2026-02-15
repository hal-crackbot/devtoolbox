import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
export const metadata: Metadata = {
  title: "Free Unix Timestamp Converter Online - Epoch to Date | DevToolbox",
  description: "Convert Unix timestamps to human-readable dates and vice versa. Get the current timestamp instantly. Free online epoch converter for developers.",
  keywords: "Unix timestamp converter, epoch converter, timestamp to date, date to timestamp, current Unix time",
};
export default function L({ children }: { children: React.ReactNode }) {
  return <>{children}<JsonLd name="Timestamp Converter" description="Convert Unix timestamps to human dates and back. Free online tool." url="https://devtoolbox-delta.vercel.app/timestamp-converter" category="DeveloperApplication" /></>;
}
