import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/PreviewBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | MEEWA Industries',
    default: 'MEEWA Industries - B2B Export Platform',
  },
  description: "Premium Quality Export For Global Markets. Manufacturer and supplier of high quality paper cups, bagasse tableware, and packaging.",
  openGraph: {
    title: 'MEEWA Industries',
    description: 'Premium Quality Export For Global Markets',
    url: 'https://meewaindustries.com',
    siteName: 'MEEWA Industries',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema for GEO/SEO
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MEEWA Industries",
    "url": "https://meewaindustries.com",
    "logo": "https://meewaindustries.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98765-43210",
      "contactType": "customer service",
      "email": "info@meewaindustries.com"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className={inter.className}>
        <PreviewBanner />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
