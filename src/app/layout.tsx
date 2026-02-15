import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevToolbox - Free Online Developer Tools",
  description:
    "Free, fast, client-side developer utilities: JSON formatter, Base64 encoder, regex tester, color palette generator, and more.",
  keywords:
    "developer tools, JSON formatter, base64, regex tester, color palette, CSS gradient, lorem ipsum, markdown preview",
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🛠 DevToolbox
            </a>
            <div className="flex gap-4">
              <a href="/" className="text-sm text-gray-400 hover:text-gray-200 transition">All Tools</a>
              <a href="/blog" className="text-sm text-gray-400 hover:text-gray-200 transition">Blog</a>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        {/* Google AdSense Ad Slot */}
        <div className="ad-slot max-w-6xl mx-auto w-full px-4 py-4">
          {/* Ad placeholder - replace with AdSense code */}
        </div>

        <Analytics />
        <footer className="border-t border-gray-800 bg-gray-900/80 py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-400">Hal Crackbot</span> — Professional developer tools, all client-side.</p>
        </footer>
      </body>
    </html>
  );
}
