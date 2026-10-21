import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/portfolio";

const poster = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-poster" });
const title = Oswald({ subsets: ["latin"], variable: "--font-title" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poster.variable} ${title.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
