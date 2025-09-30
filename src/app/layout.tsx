import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.srosthai.dev'),
  title: {
    default: "SrosThaiDev Blog - Web Development & Technology Insights",
    template: "%s | SrosThaiDev Blog"
  },
  description: "Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Developerper at SrosThaiDev Blog.",
  keywords: ["web development", "programming", "technology", "tutorials", "Full Stack Developerper", "javascript", "react", "nextjs", "blog"],
  authors: [{ name: "SrosThaiDev" }],
  creator: "SrosThaiDev",
  publisher: "SrosThaiDev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.srosthai.dev',
    siteName: 'SrosThaiDev Blog',
    title: 'SrosThaiDev Blog - Web Development & Technology Insights',
    description: 'Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Developer.',
    images: [
      {
        url: '/me-fav.png',
        width: 1200,
        height: 630,
        alt: 'SrosThaiDev Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SrosThaiDev Blog - Web Development & Technology Insights',
    description: 'Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Developer.',
    images: ['/me-fav.png'],
    creator: '@srosthai',
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/me-fav.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/me-fav.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/me-fav.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/me-fav.png",
    other: [
      {
        rel: "icon",
        url: "/me-fav.png",
      },
    ],
  },
  alternates: {
    canonical: 'https://blog.srosthai.dev',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SrosThaiDev Blog",
              "url": "https://blog.srosthai.dev",
              "description": "Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Developer.",
              "author": {
                "@type": "Person",
                "name": "SrosThaiDev"
              },
              "publisher": {
                "@type": "Organization",
                "name": "SrosThaiDev",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://blog.srosthai.dev/me-fav.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://blog.srosthai.dev/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            {children}
            <ScrollToTop />
            <Toaster />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
