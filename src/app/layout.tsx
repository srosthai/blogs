import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  description: "Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Developer at SrosThaiDev Blog.",
  keywords: ["web development", "programming", "technology", "tutorials", "Full Stack Developer", "javascript", "react", "nextjs", "blog"],
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
    description: 'Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Develo.',
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
    description: 'Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Develo.',
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
      <head>
        <link rel="canonical" href="https://blog.srosthai.dev" />
        {/* Replace with your actual Google Search Console verification code */}
        {/* <meta name="google-site-verification" content="your-google-verification-code" /> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SrosThaiDev Blog",
              "url": "https://blog.srosthai.dev",
              "description": "Discover the latest articles, tutorials, and insights on web development, technology, programming, and Full Stack Develo.",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
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
