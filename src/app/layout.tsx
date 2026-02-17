import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tcg-directory.vercel.app'),
  title: {
    default: 'TCG Directory',
    template: '%s | TCG Directory',
  },
  description: 'Browse and search trading cards from Pokemon, MTG, and more',
  keywords: ['pokemon', 'tcg', 'trading cards', 'pokemon cards', 'card database', 'card search'],
  openGraph: {
    title: 'TCG Directory',
    description: 'Browse and search trading cards from Pokemon, MTG, and more',
    siteName: 'TCG Directory',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'TCG Directory',
    description: 'Browse and search trading cards from Pokemon, MTG, and more',
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
