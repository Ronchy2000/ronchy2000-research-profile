import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers";
const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Rongqi Lu | Research Profile",
  description:
    "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information.",
  openGraph: {
    title: "Rongqi Lu | Research Profile",
    description:
      "Academic profile for Rongqi Lu showcasing research interests, publications, projects, and contact information.",
    url: "https://www.ronchy2000.top",
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
