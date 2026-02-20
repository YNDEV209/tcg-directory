import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CompareBar } from "@/components/CompareBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tcg-directory.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TCG Directory',
    template: '%s | TCG Directory',
  },
  description: 'Browse and search trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam',
  keywords: ['pokemon', 'mtg', 'yugioh', 'one piece', 'gundam', 'tcg', 'trading cards', 'card database', 'card search'],
  openGraph: {
    title: 'TCG Directory',
    description: 'Browse and search trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam',
    siteName: 'TCG Directory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TCG Directory',
    description: 'Browse and search trading cards from Pokemon, MTG, Yu-Gi-Oh!, One Piece, and Gundam',
  },
  verification: {
    google: '-5ygCHju_Rh_IwhNzNfCBx1rFdhJNyzz9p2BCASOCBk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle("dark",localStorage.theme==="dark"||(!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches))}catch(e){}`,
          }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TCG Directory',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CompareBar />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
