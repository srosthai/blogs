import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SrosThaiDev Blog - Web Development & Technology Insights",
  description: "Discover the latest articles, tutorials, and insights on web development, technology, programming, and software engineering at SrosThaiDev Blog.",
  openGraph: {
    title: "SrosThaiDev Blog - Web Development & Technology Insights",
    description: "Discover the latest articles, tutorials, and insights on web development, technology, programming, and software engineering.",
    type: "website",
    url: "https://blog.srosthai.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "SrosThaiDev Blog - Web Development & Technology Insights",
    description: "Discover the latest articles, tutorials, and insights on web development, technology, programming, and software engineering.",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="dark"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}