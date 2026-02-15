import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: "File Size Calculator - Check File Sizes and Compression | DevToolbox",
  description: "Calculate file sizes and estimate gzip/Brotli compression for deployment optimization. Check asset sizes before deployment with our free file size calculator.",
  keywords: "file size calculator, gzip compression, brotli compression, file size checker, deployment optimization, asset size calculator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}<JsonLd name="File Size Calculator" description="Calculate file sizes and estimate compression ratios for deployment optimization. Check gzip and Brotli compression estimates." url="https://devtoolbox-delta.vercel.app/file-size-calculator" category="DeveloperApplication" /></>;
}