import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "katex/dist/katex.min.css";
import { Providers } from "@/components/providers";
import { getSiteRobotsMetadata, seoSiteConfig } from "@/lib/seo";

const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(seoSiteConfig.canonicalOrigin),
  title: "Rongqi Lu | Research Profile",
  description:
    "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information.",
  robots: getSiteRobotsMetadata(),
  icons: {
    icon: `${siteBasePath}/icon.svg`,
    shortcut: `${siteBasePath}/icon.svg`
  },
  openGraph: {
    title: "Rongqi Lu | Research Profile",
    description:
      "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information.",
    url: seoSiteConfig.canonicalOrigin,
    siteName: "Rongqi Lu Research Profile",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Rongqi Lu | Research Profile",
    description:
      "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
