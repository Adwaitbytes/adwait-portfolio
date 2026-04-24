import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";
import NoiseOverlay from "@/components/NoiseOverlay";
import BootSequence from "@/components/BootSequence";
import CommandPalette from "@/components/CommandPalette";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import DirectorsConsole from "@/components/DirectorsConsole";
import ChordNav from "@/components/ChordNav";
import CursorTrail from "@/components/CursorTrail";
import PlayReel from "@/components/PlayReel";
import ScrollAberration from "@/components/ScrollAberration";
import Terminal from "@/components/Terminal";
import { profile } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-jb",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  metadataBase: new URL("https://adwait.build"),
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: profile.handle,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  keywords: [
    "Adwait Keshari",
    "Full Stack Developer",
    "Web3 Developer",
    "IIT Madras",
    "Bhopal DAO",
    "ZK",
    "Stellar",
    "Story Protocol",
    "Portfolio",
  ],
  authors: [{ name: profile.name }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050507" },
    { media: "(prefers-color-scheme: light)", color: "#f5f1e8" },
  ],
};

const themeBootstrap = `(()=>{try{var t=localStorage.getItem('adwait:theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}else{document.documentElement.dataset.theme='dark';}}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="custom-cursor-on relative">
        <BootSequence />
        <CursorTrail />
        <CursorFollower />
        <NoiseOverlay />
        <SiteNav />
        <CommandPalette />
        <main className="relative z-10">{children}</main>
        <SiteFooter />
        <DirectorsConsole />
        <ChordNav />
        <PlayReel />
        <ScrollAberration />
        <Terminal />
      </body>
    </html>
  );
}
